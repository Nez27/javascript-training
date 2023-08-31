import { initializeApp } from 'firebase/app';
import {
  getDatabase,
  ref,
  set,
  goOffline,
  goOnline,
  onValue,
} from 'firebase/database';
import { DATABASE_URL } from '../constants/config';

class FirebaseService {
  constructor() {
    const firebaseConfig = {
      databaseURL: DATABASE_URL,
    };
    this.app = initializeApp(firebaseConfig);
    this.db = getDatabase(this.app);
  }

  /**
   * Save data in database
   * @param {Object} data The object need to save into database
   * @param {string} path The path of database need to be save
   * @returns {Promise} Return the relsoves when write to database completed
   */
  save(data, path) {
    return set(ref(this.db, path), data);
  }

  /**
   * Disconnect to database
   */
  disconnect() {
    goOffline(this.db);
  }

  /**
   * Reconnect to database
   */
  reconnect() {
    goOnline(this.db);
  }

  /**
   * Find the key of value by property in database
   * @param {string} path The path of database to be found
   * @param {string} property The property of the value need to be found
   * @param {value} value The value to compare in database
   * @returns {Promise} Return the relsoves when find completed
   */
  findKeyByPropery(path, property, value) {
    return new Promise((resolve) => {
      onValue(
        ref(this.db, path),
        (snapshot) => {
          let result;

          // snapshot is a type of data by Firebase define
          snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();

            if (data[property] === value) {
              result = childSnapshot.key;
            }
          });
          resolve(result);
        },
        {
          onlyOnce: true,
        },
      );
    });
  }

  getDataFromId(id, path) {
    return new Promise((resolve) => {
      onValue(
        ref(this.db, path + id),
        (snapshot) => {
          resolve(snapshot.val());
        },
        {
          onlyOnce: true,
        },
      );
    });
  }
}

export default new FirebaseService();
