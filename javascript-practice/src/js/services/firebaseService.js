import { initializeApp } from 'firebase/app';
import {
  getDatabase,
  ref,
  set,
  goOffline,
  goOnline,
  onValue,
} from 'firebase/database';
import { databaseURL } from '../constants/constant';

class FirebaseService {
  constructor() {
    const firebaseConfig = {
      databaseURL,
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
