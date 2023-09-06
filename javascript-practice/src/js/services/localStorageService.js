class LocalStorageService {
  constructor() {
    this.localStorage = localStorage;
  }

  add(key, value) {
    this.localStorage.setItem(key, value);
  }

  get(key) {
    this.localStorage.getItem(key);
  }

  remove(key) {
    this.localStorage.removeItem(key);
  }

  clear() {
    this.localStorage.clear();
  }
}

export default new LocalStorageService();
