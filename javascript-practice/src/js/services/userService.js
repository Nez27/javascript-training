import { timeOutConnect } from '../helpers/helpers';
import FirebaseService from './firebaseService';
import User from '../models/userModel';

export default class UserService {
  constructor() {
    this.path = 'users/';
  }

  async saveUser(user) {
    FirebaseService.reconnect();
    const saveUser = FirebaseService.save(
      user,
      this.path + User.createIdUser(),
    );
    await timeOutConnect(saveUser);
  }

  async checkExistUserByEmail(email) {
    FirebaseService.reconnect();
    const existUser = FirebaseService.findKeyByPropery(
      this.path,
      'email',
      email,
    );
    const result = await timeOutConnect(existUser);

    return result;
  }
}
