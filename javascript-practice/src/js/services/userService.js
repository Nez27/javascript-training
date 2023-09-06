import { createToken } from '../helpers/helpers';
import CommonService from './commonService';
import LocalStorageService from './localStorageService';

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
    this.save(user);
  }

  /**
   * Check user exist in database
   * @param {string} email Email to find user
   * @returns {boolean} Return true if find, otherwise return false
   */
  async checkUserExist(email) {
    const userExist = await this.getUserByEmail(email);

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
    const result = await this.getDataFromProp('email', email);

    if (result) {
      return result;
    }

    return null;
  }

  /**
   * Validate user info
   * @param {string} email The email user input
   * @param {*} password The password user input
   * @returns {boolean} Return true if match info on database, otherwise return false
   */
  async validateUser(email, password) {
    const user = await this.getUserByEmail(email);

    // Check password
    if (user && user.password === password) {
      // Create token for user
      await this.createTokenUser(email);

      return true;
    }

    return false;
  }

  /**
   * Create token for user on database
   * @param {string} email The email user need to be create token
   */
  async createTokenUser(email) {
    const user = await this.getUserByEmail(email);
    const newUserData = user;

    // Add token to user object
    newUserData.accessToken = createToken();

    this.save(newUserData);

    // Add access token to local storage
    LocalStorageService.add('accessToken', newUserData.accessToken);
  }
}
