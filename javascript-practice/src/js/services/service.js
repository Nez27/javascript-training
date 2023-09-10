import UserService from './userService';
import WalletService from './walletService';

export default class Service {
  constructor() {
    this.userService = new UserService();
    this.walletService = new WalletService();
  }
}
