// __tests__/conseilController.test.js

import request from 'supertest';
import express from 'express';
import { createConseil, getAllConseils, deleteConseil, updateConseil } from '../../controllers/conseilController';
import Conseil from '../../models/conseilModel';

// Mock de l'application Express
const app = express();
app.use(express.json());

app.post('/conseils', createConseil);
app.get('/conseils', getAllConseils);
app.delete('/conseils/:id', deleteConseil);
app.put('/conseils/:id', updateConseil);

// Mock du modèle Conseil
jest.mock('../../models/conseilModel');

describe('Conseil Controller', () => {

    describe('POST /conseils', () => {
        it('should create a new conseil and return it', async () => {
            const newConseil = { title: 'Conseil 1', content: 'Content of Conseil 1' };
            const createdConseil = { id: 1, ...newConseil };

            Conseil.createConseil.mockImplementation((conseil, callback) => {
                callback(null, createdConseil);
            });

            const res = await request(app)
                .post('/conseils')
                .send(newConseil)
                .expect(201);

            expect(res.body).toEqual(createdConseil);
            expect(Conseil.createConseil).toHaveBeenCalledWith(newConseil, expect.any(Function));
        });

        it('should return a 500 error if createConseil fails', async () => {
            Conseil.createConseil.mockImplementation((conseil, callback) => {
                callback(new Error('Creation error'));
            });

            const res = await request(app)
                .post('/conseils')
                .send({ title: 'Conseil 1', content: 'Content of Conseil 1' })
                .expect(500);

            expect(res.body).toEqual({ error: 'Creation error' });
        });
    });

    describe('GET /conseils', () => {
        it('should return all conseils', async () => {
            const conseils = [
                { id: 1, title: 'Conseil 1', content: 'Content of Conseil 1' },
                { id: 2, title: 'Conseil 2', content: 'Content of Conseil 2' }
            ];

            Conseil.getAllConseils.mockImplementation((callback) => {
                callback(null, conseils);
            });

            const res = await request(app)
                .get('/conseils')
                .expect(200);

            expect(res.body).toEqual(conseils);
            expect(Conseil.getAllConseils).toHaveBeenCalledWith(expect.any(Function));
        });

        it('should return a 500 error if getAllConseils fails', async () => {
            Conseil.getAllConseils.mockImplementation((callback) => {
                callback(new Error('Fetch error'));
            });

            const res = await request(app)
                .get('/conseils')
                .expect(500);

            expect(res.body).toEqual({ error: 'Fetch error' });
        });
    });

    describe('DELETE /conseils/:id', () => {
        it('should delete a conseil and return 204 status', async () => {
            const conseilId = 1;

            Conseil.deleteConseil.mockImplementation((id, callback) => {
                callback(null);
            });

            const res = await request(app)
                .delete(`/conseils/${conseilId}`)
                .expect(204);

            expect(res.text).toBe(''); // Le corps de la réponse devrait être vide
            expect(Conseil.deleteConseil).toHaveBeenCalledWith(conseilId.toString(), expect.any(Function));
        });

        it('should return a 500 error if deleteConseil fails', async () => {
            const conseilId = 1;

            Conseil.deleteConseil.mockImplementation((id, callback) => {
                callback(new Error('Delete error'));
            });

            const res = await request(app)
                .delete(`/conseils/${conseilId}`)
                .expect(500);

            expect(res.body).toEqual({ error: 'Delete error' });
        });
    });

    describe('PUT /conseils/:id', () => {
        it('should update a conseil and return a success message', async () => {
            const conseilId = 1;
            const updatedConseil = { title: 'Updated Title', content: 'Updated Content' };

            Conseil.updateConseil.mockImplementation((id, conseil, callback) => {
                callback(null);
            });

            const res = await request(app)
                .put(`/conseils/${conseilId}`)
                .send(updatedConseil)
                .expect(200);

            expect(res.body).toEqual({ message: 'Conseil mis à jour avec succès' });
            expect(Conseil.updateConseil).toHaveBeenCalledWith(conseilId.toString(), updatedConseil, expect.any(Function));
        });

        it('should return a 500 error if updateConseil fails', async () => {
            const conseilId = 1;
            const updatedConseil = { title: 'Updated Title', content: 'Updated Content' };

            Conseil.updateConseil.mockImplementation((id, conseil, callback) => {
                callback(new Error('Update error'));
            });

            const res = await request(app)
                .put(`/conseils/${conseilId}`)
                .send(updatedConseil)
                .expect(500);

            expect(res.body).toEqual({ error: 'Update error' });
        });
    });

});
