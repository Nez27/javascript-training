import CommonService from './commonService';

export default class TransactionService extends CommonService {
  constructor() {
    super();

    this.defaultPath = 'transactions/';
  }

  /**
   * Save transaction into database
   * @param {Object} transaction The wallet object need to be saved into database
   */
  async saveTransaction(transaction) {
    await this.save(transaction);
  }

  async getListTransactionByIdUser(idUser) {
    const results = this.getListDataFromProp(
      'idUser',
      idUser,
      this.defaultPath,
    );

    if (results) {
      return results;
    }

    return null;
  }
}
