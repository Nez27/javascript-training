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
      databaseUrl: DATABASE_URL,
    };
    this.app = initializeApp(firebaseConfig);
    this.db = getDatabase(this.app);
  }

  save(data, path) {
    return set(ref(this.db, path), data);
  }

  disconnect() {
    goOffline(this.db);
  }

  reconnect() {
    goOnline(this.db);
  }

  findKeyByPropery(path, property, value) {
    return new Promise((resolve) => {
      onValue(
        ref(this.db, path),
        (snapshot) => {
          let result = false;

          // snapshot is a type of data by Firebase define
          snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();

            if (data[property] === value) {
              result = true;
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
}

export default new FirebaseService();
