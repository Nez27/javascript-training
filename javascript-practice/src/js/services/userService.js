import { createToken } from '../helpers/helpers';
import User from '../models/user';
import CommonService from './commonService';

export default class UserService extends CommonService {
  constructor() {
    super();

    this.defaultPath = 'users/';
  }

  /**
   * Save user into database
   * @param {Object} user The user object need to be saved into databae
   */
  saveUser(user) {
    const pathData = this.defaultPath + User.createIdUser();

    this.save(user, pathData);
  }

  /**
   * Get user id by email
   * @param {string} email Email need to be check
   * @returns {Promise || number} Return id user when exist, otherwise will undefined
   */
  getUserIdByEmail(email) {
    return this.findIdByProperty('email', email);
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
      const user = await this.getDataFromId(id);

      return new User(user);
    }

    return null;
  }

  async createTokenUser(user) {
    const id = await this.getUserIdByEmail(user.email);

    // Add token to user object
    const newUserData = new User(user);
    newUserData.accessToken = createToken();

    this.save(newUserData, this.defaultPath + id);
  }
}
