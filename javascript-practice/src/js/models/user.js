export default class User {
  constructor({ email, password, accessToken = '' }) {
    this.id = User.createIdUser();
    this.email = email;
    this.password = password;
    this.accessToken = accessToken;
  }

  static createIdUser() {
    return new Date().getTime();
  }
}
