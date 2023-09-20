import { createId } from '../helpers/dataProcess';

export default class Wallet {
  constructor({ walletName, inflow = 0, outflow = 0, idUser }) {
    this.id = createId();
    this.walletName = walletName;
    this.inflow = inflow;
    this.outflow = outflow;
    this.idUser = idUser;
  }

  amountWallet() {
    return +this.inflow + +this.outflow;
  }
}
