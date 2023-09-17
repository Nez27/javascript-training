import UserService from '../services/userService';

export default class HomeController {
  constructor(service, view) {
    this.service = service;
    this.homeView = view.homeView;
  }

  handlerGetInfoUserLogin() {
    return this.service.userService.getInfoUserLogin();
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

  handlerGetAllTransactions(idUser) {
    return this.service.transactionService.getListTransactionByIdUser(idUser);
  }

  handlerDeleteTransaction(idTransaction) {
    return this.service.transactionService.deleteTransaction(idTransaction);
  }

  static handlerClearAccessToken() {
    UserService.clearAccessToken();
  }

  init() {
    if (this.homeView) {
      this.homeView.initFunction(
        this.handlerGetInfoUserLogin.bind(this),
        this.handlerGetWalletUser.bind(this),
        this.handlerGetAllCategory.bind(this),
        this.handlerGetAllTransactions.bind(this),
        this.handlerSaveWallet.bind(this),
        this.handlerSaveTransaction.bind(this),
        HomeController.handlerClearAccessToken.bind(this),
        this.handlerDeleteTransaction.bind(this),
      );
      this.homeView.addHandlerEventWalletForm();

      this.homeView.loadPage();

      this.homeView.addHandlerEventBudgetForm();

      this.homeView.handlerEventCategoryDialog();

      this.homeView.handlerEventTransactionDialog();
    }
  }
}
