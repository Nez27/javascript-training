export default class HomeController {
  constructor(service, view) {
    this.service = service;
    this.homeView = view.homeView;
  }

  handlerGetInfoUserLogin() {
    return this.service.userService.getInfoUserLogin();
  }

  handlerCheckWalletValid(idUser) {
    return this.service.walletService.isValidWallet(idUser);
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
        this.handlerCheckWalletValid.bind(this),
      );
    }
  }
}
