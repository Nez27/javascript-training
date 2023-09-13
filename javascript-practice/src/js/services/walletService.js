import Wallet from '../models/wallet';
import CommonService from './commonService';

export default class WalletService extends CommonService {
  constructor() {
    super();

    this.defaultPath = 'wallets/';
  }

  /**
   * Save wallet into database
   * @param {Object} wallet The wallet object need to be saved into database
   */
  async saveWallet(wallet) {
    await this.save(wallet);
  }

  /**
   * Check wallet exist in database
   * @param {string} idUser The id user to find user's wallet
   * @returns {boolean} Return true if find, otherwise return false
   */
  async isValidWallet(idUser) {
    const wallet = await this.getWalletByIdUser(idUser);

    if (wallet) {
      return true;
    }

    return false;
  }

  /**
   * Get wallet data from idUser
   * @param {string} email The id user to find user's wallet
   * @returns {Object || null} Return new Wallet Object if find, otherwise return null.
   */
  async getWalletByIdUser(idUser) {
    const result = await this.getDataFromProp('idUser', idUser);

    if (result) {
      return new Wallet(result);
    }

    return null;
  }
}
