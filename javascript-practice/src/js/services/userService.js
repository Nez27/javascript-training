import { timeOutConnect } from '../helpers/helpers';
import FirebaseService from './firebaseService';
import User from '../models/userModel';
import CommonService from './commonService';

export default class UserService extends CommonService {
  constructor() {
    super();
    this.path = 'users/';
  }

  /**
   * Save user into database
   * @param {Object} user The user object need to be saved into databae
   */
  async saveUser(user) {
    this.connectToDb();
    const saveUser = FirebaseService.save(
      user,
      this.path + User.createIdUser(),
    );
    await timeOutConnect(saveUser);
  }

  /**
   * Get user id by email
   * @param {string} email Email need to be check
   * @returns {Promise || number} Return id user when exist, otherwise will undefined
   */
  async getUserIdByEmail(email) {
    this.connectToDb();
    const existUser = FirebaseService.findKeyByPropery(
      this.path,
      'email',
      email,
    );
    const result = await timeOutConnect(existUser);

    return result;
  }

  /**
   * Check user exist in database
   * @param {string} email Email to find user
   * @returns {boolean} Return true if find, otherwise return false
   */
  async checkUserExist(email) {
    const userExist = await this.getUserIdByEmail(email);
    if (userExist) {
      return true;
    }
    return false;
  }

  /**
   * Get user data from email
   * @param {string} email Email user
   * @returns {Object || null} Return new User Object if find, otherwise return null.
   */
  async getUserByEmail(email) {
    const id = await this.getUserIdByEmail(email);
    if (id) {
      const user = await FirebaseService.getDataFromId(id, this.path);
      return new User(user);
    }
    return null;
  }
}
