import {
  convertDataObjectToModel,
  convertModelToDataObject,
  timeOutConnect,
} from '../helpers/helpers';
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

  async getDataFromProp(property, value, path = this.defaultPath) {
    this.connectToDb();
    const data = this.firebaseService.getDataFromProp(path, property, value);
    const result = await timeOutConnect(data);

    if (result.id && result.data) {
      return convertDataObjectToModel(result);
    }

    return null;
  }

  /**
   * Save data on database
   * @param {*} data The data wants to save on database
   * @param {string} path The path of database
   */
  async save(model) {
    this.connectToDb();
    const results = convertModelToDataObject(model);

    const saveData = this.firebaseService.save(
      results.data,
      this.defaultPath + results.id,
    );

    await timeOutConnect(saveData);
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

  async getAllDataFromPath(path = this.defaultPath) {
    this.connectToDb();

    const results = await timeOutConnect(
      this.firebaseService.getAllDataFromPath(path),
    );

    if (results) {
      // Convert format object
      return results.map((data) => {
        return convertDataObjectToModel(data);
      });
    }

    return null;
  }

  async getListDataFromProp(property, value, path = this.defaultPath) {
    this.connectToDb();

    const results = await timeOutConnect(
      this.firebaseService.getListDataFromProp(path, property, value),
    );
    if (results) {
      // Convert format object

      return results.map((data) => {
        return convertDataObjectToModel(data);
      });
    }

    return null;
  }

  async deleteData(id, path = this.defaultPath) {
    this.connectToDb();
    await timeOutConnect(this.firebaseService.delete(id, path));
  }
}
