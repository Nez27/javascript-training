export default class User {
  constructor({ email, password, walletName = '', accessToken = '' }) {
    this.email = email;
    this.password = password;
    this.walletName = walletName;
    this.accessToken = accessToken;
  }

  static createIdUser() {
    return new Date().getTime();
  }
}
