export default class HomeController {
  constructor(service, view) {
    this.service = service;
    this.homeView = view.homeView;
  }

  handlerGetInfoUserLogin() {
    return this.service.userService.getInfoUserLogin();
  }

  handlerCheckWalletExist(idUser) {
    return this.service.walletService.checkWalletExist(idUser);
  }

  handlerGetWalletUser(idUser) {
    return this.service.walletService.getWalletByIdUser(idUser);
  }

  handlerSaveWallet(wallet) {
    return this.service.walletService.saveWallet(wallet);
  }

  init() {
    if (this.homeView) {
      this.homeView.addHandlerInputChangeWalletForm();

      this.homeView.addHandlerSubmitWalletForm(
        this.handlerSaveWallet.bind(this),
      );

      this.homeView.loadPage(
        this.handlerGetInfoUserLogin.bind(this),
        this.handlerCheckWalletExist.bind(this),
        this.handlerGetWalletUser.bind(this),
      );

      this.homeView.addHandlerSubmitBudgetForm();
    }
  }
}
