import { timeOutConnect } from '../helpers/helpers';
import FirebaseService from './firebaseService';

export default class CommonService {
  constructor() {
    this.defaultPath = '/';
    this.firebaseService = FirebaseService;
  }

  /**
   * Connect to Firebase Databse
   */
  connectToDb() {
    this.firebaseService.reconnect();
  }

  /**
   * Find the id of data on database
   * @param {string} property The property want to get value
   * @param {string} value The value of property
   * @param {path} path The path of datbase
   * @returns {string} The id of data object
   */
  async findIdByProperty(property, value, path = this.defaultPath) {
    this.connectToDb();
    const existUser = this.firebaseService.findIdByProperty(
      path,
      property,
      value,
    );
    const result = await timeOutConnect(existUser);

    return result;
  }

  /**
   * Save data on database
   * @param {*} data The data wants to save on database
   * @param {string} path The path of database
   */
  async save(data, path = this.defaultPath) {
    this.connectToDb();
    const saveUser = this.firebaseService.save(data, path);

    await timeOutConnect(saveUser);
  }

  /**
   *
   * @param {string} id The string of data object
   * @param {string} path The path of database
   * @returns {Object || null} Return the object if has, otherwise return null
   */
  async getDataFromId(id, path = this.defaultPath) {
    this.connectToDb();
    const result = await this.firebaseService.getDataFromId(id, path);
    const data = await timeOutConnect(result);

    if (data) return data;

    return null;
  }
}
