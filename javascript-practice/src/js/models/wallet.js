export default class Wallet {
  constructor({
    walletName = '',
    amount = 0,
    inflow = 0,
    outflow = 0,
    idUser,
  }) {
    this.id = Wallet.createIdWallet();
    this.walletName = walletName;
    this.amount = amount;
    this.inflow = inflow;
    this.outflow = outflow;
    this.idUser = idUser;
  }

  static createIdWallet() {
    return new Date().getTime();
  }
}
