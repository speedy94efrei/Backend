import request from 'supertest';
import express from 'express';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { addAnnonce, getAllAnnonces, getAnnonceImage } from '../../controllers/annonceController.js';
import annonceModel from '../../models/annonceModel.js';

// Mock des dépendances
jest.mock('fs');
jest.mock('path');
jest.mock('sharp');
jest.mock('uuid');
jest.mock('../../models/annonceModel.js');
jest.mock('sqlite3', () => {
    const sqlite3 = {
        verbose: jest.fn(() => ({
            Database: jest.fn().mockImplementation(() => ({
                run: jest.fn(),
                get: jest.fn(),
                all: jest.fn(),
                close: jest.fn(),
            })),
        })),
    };
    return sqlite3;
});

// Configuration de l'application Express
const app = express();
app.use(express.json());

app.post('/annonce', addAnnonce);
app.get('/annonces', getAllAnnonces);
app.get('/uploads/plante/:filename', getAnnonceImage);

describe('Annonce Controller', () => {

    describe('GET /annonces', () => {
        it('should return all annonces', async () => {
            const annonces = [{ id: 1, title: 'Annonce 1' }, { id: 2, title: 'Annonce 2' }];
            annonceModel.getAllAnnonces.mockImplementation((callback) => {
                callback(null, annonces);
            });

            const res = await request(app)
                .get('/annonces')
                .expect(200);

            expect(res.body).toEqual(annonces);
            expect(annonceModel.getAllAnnonces).toHaveBeenCalled();
        });

        it('should return a 500 error if there is a database issue', async () => {
            annonceModel.getAllAnnonces.mockImplementation((callback) => {
                callback(new Error('Database error'));
            });

            const res = await request(app)
                .get('/annonces')
                .expect(500);

            expect(res.body).toEqual({ error: 'Erreur lors de la récupération des annonces' });
        });
    });

    describe('GET /uploads/plante/:filename', () => {
        it('should return the image if it exists', async () => {
            const imageBuffer = Buffer.from('fake image buffer');
            const filePath = 'fake/path/to/image.webp';

            path.join.mockReturnValue(filePath);
            fs.existsSync.mockReturnValue(true);
            sharp.mockReturnValue({
                toBuffer: jest.fn().mockResolvedValue(imageBuffer),
            });

            const res = await request(app)
                .get('/uploads/plante/test-image.webp')
                .expect(200);

            expect(res.headers['content-type']).toBe('image/webp');
            expect(res.body).toEqual(imageBuffer);
            expect(sharp).toHaveBeenCalledWith(filePath);
        });

        it('should return a 404 error if image is not found', async () => {
            path.join.mockReturnValue('fake/path/to/image.webp');
            fs.existsSync.mockReturnValue(false);

            const res = await request(app)
                .get('/uploads/plante/nonexistent-image.webp')
                .expect(404);

            expect(res.body).toEqual({ error: 'Image non trouvée' });
        });
    });
});
