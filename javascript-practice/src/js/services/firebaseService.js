import { initializeApp } from 'firebase/app';
import {
  getDatabase,
  ref,
  set,
  goOffline,
  goOnline,
  onValue,
  remove,
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
   * @returns {Promise} Return the resolves when write to database completed
   */
  save(data, path) {
    return set(ref(this.db, path), data);
  }

  delete(id, path) {
    return remove(ref(this.db, path + id));
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
   * Find id of value by property in database
   * @param {string} path The path of database to be found
   * @param {string} property The property of the value need to be found
   * @param {value} value The value to compare in database
   * @returns {Promise} Return the relsoves when find completed
   */
  getDataFromProp(path, property, value) {
    return new Promise((resolve) => {
      onValue(
        ref(this.db, path),
        (snapshot) => {
          let id;
          let data;

          // snapshot is a type of data by Firebase define
          snapshot.forEach((childSnapshot) => {
            const dataTemp = childSnapshot.val();

            if (dataTemp[property] === value) {
              id = childSnapshot.key;
              data = dataTemp;
            }
          });
          resolve({ id, data });
        },
        {
          onlyOnce: true,
        },
      );
    });
  }

  /**
   * Get data object from Id
   * @param {string} id The id of data object
   * @param {string} path The path of data save in database
   * @returns {Promise} Return new Promise
   */
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

  getAllDataFromPath(path) {
    return new Promise((resolve) => {
      onValue(
        ref(this.db, path),
        (snapshot) => {
          const listData = [];

          // snapshot is a type of data by Firebase define
          snapshot.forEach((childSnapshot) => {
            // const dataTemp = childSnapshot.val();

            // if (dataTemp[property] === value) {
            //   id = childSnapshot.key;
            //   data = dataTemp;
            // }
            const id = childSnapshot.key;
            const data = childSnapshot.val();

            listData.push({ id, data });
          });
          resolve(listData);
        },
        {
          onlyOnce: true,
        },
      );
    });
  }

  getListDataFromProp(path, property, value) {
    return new Promise((resolve) => {
      onValue(
        ref(this.db, path),
        (snapshot) => {
          let id;
          let data;
          const listData = [];

          // snapshot is a type of data by Firebase define
          snapshot.forEach((childSnapshot) => {
            const dataTemp = childSnapshot.val();

            if (dataTemp[property] === value) {
              id = childSnapshot.key;
              data = dataTemp;

              listData.push({ id, data });
            }
          });
          resolve(listData);
        },
        {
          onlyOnce: true,
        },
      );
    });
  }
}

export default new FirebaseService();
