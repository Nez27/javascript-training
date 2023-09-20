import { createId } from '../helpers/dataProcess';

export default class User {
  constructor({ email, password, accessToken = '' }) {
    this.id = createId();
    this.email = email;
    this.password = password;
    this.accessToken = accessToken;
  }
}
