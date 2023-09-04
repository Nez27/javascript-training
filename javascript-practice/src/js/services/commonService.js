import { timeOutConnect } from '../helpers/helpers';
import FirebaseService from './firebaseService';

export default class CommonService {
  constructor() {
    this.defaultPath = '/';
    this.firebaseService = FirebaseService;
  }

  connectToDb() {
    this.firebaseService.reconnect();
  }

  async findKeyByProperty(property, value, path = this.defaultPath) {
    this.connectToDb();
    const existUser = this.firebaseService.findKeyByPropery(
      path,
      property,
      value,
    );
    const result = await timeOutConnect(existUser);
    return result;
  }

  async save(data, path = this.defaultPath) {
    this.connectToDb();
    const saveUser = this.firebaseService.save(data, path);
    await timeOutConnect(saveUser);
  }

  async getDataFromId(id, path = this.defaultPath) {
    this.connectToDb();
    const result = await this.firebaseService.getDataFromId(id, path);
    const data = await timeOutConnect(result);
    if (data) return data;
    return null;
  }
}
