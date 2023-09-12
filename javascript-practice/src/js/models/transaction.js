export default class Transaction {
  constructor({ categoryName = '', date = '', note = 'None', amount = 0 }) {
    this.id = Transaction.createIdTransactions();
    this.categoryName = categoryName;
    this.date = date;
    this.note = note;
    this.amount = amount;
  }

  static createIdTransactions() {
    return new Date().getTime();
  }
}
