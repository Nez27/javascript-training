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
   * Check user exist in database by email
   * @param {string} email Email need to be check
   * @returns {boolean} Return true if email exist and otherwise is false
   */
  async checkExistUserByEmail(email) {
    this.connectToDb();
    const existUser = FirebaseService.findKeyByPropery(
      this.path,
      'email',
      email,
    );
    const result = await timeOutConnect(existUser);

    return result;
  }
}
