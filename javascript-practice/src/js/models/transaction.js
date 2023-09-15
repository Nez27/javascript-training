export default class Transaction {
  constructor({
    id = Transaction.createIdTransactions(),
    categoryName = '',
    date = '',
    note = '',
    amount = 0,
    idUser,
  }) {
    this.id = id;
    this.categoryName = categoryName;
    this.date = date;
    this.note = note;
    this.amount = amount;
    this.idUser = idUser;
  }

  static createIdTransactions() {
    return new Date().getTime();
  }
}
