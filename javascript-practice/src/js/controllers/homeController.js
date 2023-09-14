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

  handlerGetWalletUser(idUser) {
    return this.service.walletService.getWalletByIdUser(idUser);
  }

  handlerSaveWallet(wallet) {
    return this.service.walletService.saveWallet(wallet);
  }

  handlerSaveTransaction(transaction) {
    return this.service.transactionService.saveTransaction(transaction);
  }

  handlerGetAllCategory() {
    return this.service.categoryService.getAllCategory();
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
        this.handlerGetWalletUser.bind(this),
        this.handlerGetAllCategory.bind(this),
      );

      this.homeView.addHandlerSubmitBudgetForm(
        this.handlerSaveTransaction.bind(this),
        this.handlerSaveWallet.bind(this),
      );

      this.homeView.addHandlerInputChangeBudgetForm();

      this.homeView.handlerInputChangeCategoryDialog();
    }
  }
}
