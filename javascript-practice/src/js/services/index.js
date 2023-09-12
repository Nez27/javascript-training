import UserService from './userService';

export default class Service {
  constructor() {
    this.userService = new UserService();
  }
}
