export default class Wallet {
  constructor({
    id = Wallet.createIdWallet(),
    walletName = '',
    amount = 0,
    inflow = 0,
    outflow = 0,
    idUser,
  }) {
    this.id = id;
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
