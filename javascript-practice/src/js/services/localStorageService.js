class LocalStorageService {
  constructor() {
    this.localStorage = localStorage;
  }

  add(key, value) {
    this.localStorage.setItem(key, value);
  }

  static get(key) {
    this.localStorage.getItem(key);
  }

  static remove(key) {
    this.localStorage.removeItem(key);
  }

  static clear() {
    this.localStorage.clear();
  }
}

export default new LocalStorageService();
