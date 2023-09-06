export default class User {
  constructor({ email, password, walletName = '' }) {
    this.id = User.createIdUser();
    this.email = email;
    this.password = password;
    this.walletName = walletName;
  }

  static createIdUser() {
    return new Date().getTime();
  }
}
