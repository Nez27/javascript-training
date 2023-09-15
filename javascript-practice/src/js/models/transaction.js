export default class Transaction {
  constructor({
    id = '',
    categoryName = '',
    date = '',
    note = '',
    amount = 0,
    idUser,
  }) {
    this.id = id === '' ? Transaction.createIdTransactions() : id;
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
