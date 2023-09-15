export default class Wallet {
  constructor({ walletName = '', inflow = 0, outflow = 0, idUser }) {
    this.id = Wallet.createIdWallet();
    this.walletName = walletName;
    this.inflow = inflow;
    this.outflow = outflow;
    this.idUser = idUser;
  }

  static createIdWallet() {
    return new Date().getTime();
  }
}
