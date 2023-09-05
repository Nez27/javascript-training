import { createToken } from '../helpers/helpers';
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

  async validateUser(email, password) {
    const user = await this.getUserByEmail(email);

    if (user) {
      // Check password
      if (user.password === password) {
        // Create token for user
        await this.createTokenUser(email);

        return true;
      }
      return false;
    }
    return false;
  }

  async createTokenUser(email) {
    const user = await this.getUserByEmail(email);

    // Add token to user object
    const newUserData = user;
    newUserData.accessToken = createToken();
    this.save(newUserData);
  }
}
