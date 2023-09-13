import CommonService from './commonService';
import Transaction from '../models/transaction';

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
    const transactionObject = new Transaction(transaction);

    await this.save(transactionObject);
  }
}
