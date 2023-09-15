export default class Transaction {
  constructor({
    id = Transaction.createIdTransactions(),
    categoryName = '',
    date = '',
    note = 'None',
    amount = 0,
  }) {
    this.id = id;
    this.categoryName = categoryName;
    this.date = date;
    this.note = note;
    this.amount = amount;
  }

  static createIdTransactions() {
    return new Date().getTime();
  }
}
