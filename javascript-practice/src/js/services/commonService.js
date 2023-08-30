/* eslint-disable class-methods-use-this */
import FirebaseService from './firebaseService';

export default class CommonService {
  connectToDb() {
    FirebaseService.reconnect();
  }
}
