import { createId } from '../helpers/dataProcess';

export default class Transaction {
  constructor({ id, categoryName, date, note, amount = 0, idUser }) {
    this.id = !id ? createId() : id;
    this.categoryName = categoryName;
    this.date = date;
    this.note = note;
    this.amount = amount;
    this.idUser = idUser;
  }
}
