import { getUserInfo, changePassword, verifyPassword, updateUserProfilePic, getUserProfilePic, } from "../../controllers/userController";
import { getUserById, updateUserPassword, getUserInfoFromDb, updateUserPhoto, getUserPhoto, } from "../../models/userModel";
import { jest, expect, describe, test, it, beforeAll, beforeEach, mockImplementation } from '@jest/globals';

const bcrypt = require('bcrypt')
jest.mock('bcrypt');
jest.mock('../../models/userModel')

describe('Test de la fonction getUserInfo', () => {
  let req;
  let res;
  beforeEach(() => {
    req = {
          userId: 1
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  })

  test('User info reçue', async () => {
    let userInfo = {
      nom: 'Test',
      prenom: 'Test'
    }

    getUserInfoFromDb.mockImplementation((userId, callback) => {callback(null, userInfo)})

    await getUserInfo(req, res)

    expect(getUserInfoFromDb).toHaveBeenCalledWith(1, expect.any(Function))
    expect(res.status).toHaveBeenCalledWith(200);
  })
})

describe('Test de la fonction changePassword', () => {
  let req;
  let res;
  beforeEach(() => {
    req = {
          userId: 1,
          body: {
            currentPassword: '123',
            newPassword: '321'
          }
      
  };

  res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
  };
  })

    test('Mot de passe mis à jour avec succès', async () => {
      let user = {
        email: 'test@gmail.com',
        password: '123'
    }
      getUserById.mockImplementation((userId, callback) => {callback(null, user)})
      bcrypt.compare.mockImplementation((currentPassword, password, callback) => {
        callback(null, true);
      });
      bcrypt.hash.mockImplementation((newPassword, saltRounds, callback) => {
        callback(null, 'mdp');
      });
      updateUserPassword.mockImplementation((userId, hash, callback) => {callback(null)})

      await changePassword(req, res)

      expect(bcrypt.compare).toHaveBeenCalledWith('123', user.password, expect.any(Function));
      expect(bcrypt.hash).toHaveBeenCalledWith('321', 10, expect.any(Function));
      expect(bcrypt.hash).toBeCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);

      
    })

})