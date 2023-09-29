/* eslint-disable class-methods-use-this */
import { TYPE_TOAST, BTN_CONTENT } from '../constants/config';
import * as MESSAGE from '../constants/message';
import CommonView from './commonView';
import { formatNumber } from '../helpers/helpers';

import WalletView from './walletView';
import TransactionView from './transactionView';
import CategoryView from './categoryView';
import BudgetView from './budgetView';
import SummaryTabView from './summaryTabView';
import TransactionTabView from './transactionTabView';

export default class HomeView extends CommonView {
  constructor() {
    super();

    this.tabs = document.querySelectorAll('.app__tab-item');
    this.allContent = document.querySelectorAll('.app__content-item');
    this.cancelBtns = document.querySelectorAll('.form__cancel-btn');
    this.saveBtns = document.querySelectorAll('.form__save-btn');
    this.dialogs = document.querySelectorAll('.dialog');

    this.amountInputs = document.querySelectorAll('.form__input-balance');

    this.transactionDialog = document.getElementById('transactionDialog');

    this.walletView = new WalletView();
    this.categoryView = new CategoryView();
    this.transactionView = new TransactionView(this.categoryView);
    this.budgetView = new BudgetView();
    this.summaryTabView = new SummaryTabView();
    this.transactionTabView = new TransactionTabView(this.transactionView);
  }

  initFunction(
    getInfoUserLogin,
    getWalletByIdUser,
    getAllCategory,
    getAllTransactions,
    saveWallet,
    saveTransaction,
    clearAccessToken,
    deleteTransaction,
    transform,
  ) {
    this.getInfoUserLogin = getInfoUserLogin;
    this.getWalletByIdUser = getWalletByIdUser;
    this.getAllCategory = getAllCategory;
    this.getAllTransactions = getAllTransactions;
    this.saveWallet = saveWallet;
    this.saveTransaction = saveTransaction;
    this.clearAccessToken = clearAccessToken;
    this.deleteTransaction = deleteTransaction;

    this.transform = transform;

    this.initTransactionViewFunction();
    this.initCategoryViewFunction();
    this.initBudgetViewFunction();
    this.initSummaryTabViewFunction();
    this.initTransactionTabViewFunction();
    this.initWalletViewFunction();
  }

  initCategoryViewFunction() {
    this.categoryView.initFunction(this.getAllCategory, this.transform);
  }

  initTransactionViewFunction() {
    this.transactionView.initFunction(
      this.toggleLoaderSpinner.bind(this),
      this.deleteTransaction,
      this.loadTransactionData.bind(this),
      this.updateAmountWallet.bind(this),
      this.loadData.bind(this),
      this.showSuccessToast.bind(this),
      this.showErrorToast.bind(this),
      this.saveTransaction,
      this.transform,
    );
  }

  initBudgetViewFunction() {
    this.budgetView.initFunction(
      this.showErrorToast.bind(this),
      this.showSuccessToast.bind(this),
      this.toggleLoaderSpinner.bind(this),
      this.saveTransaction.bind(this),
      this.loadTransactionData.bind(this),
      this.updateAmountWallet.bind(this),
      this.loadData.bind(this),
      this.transform,
    );
  }

  initFunctionCategoryView() {
    this.categoryView.initFunction(this.getAllCategory, this.transform);
  }

  initSummaryTabViewFunction() {
    this.summaryTabView.initFunction(this.transform);
  }

  initTransactionTabViewFunction() {
    this.transactionTabView.initFunction(this.transform);
  }

  initWalletViewFunction() {
    this.walletView.initFunction(
      this.transform,
      this.toggleLoaderSpinner.bind(this),
      this.saveWallet,
      this.saveTransaction,
      this.loadTransactionData.bind(this),
      this.loadData.bind(this),
      this.loadEvent.bind(this),
      this.showSuccessToast.bind(this),
      this.showErrorToast.bind(this),
    );
  }

  subscribeListenerData() {
    this.subscribe();
    this.transactionView.subscribe();
    this.budgetView.subscribe();
    this.summaryTabView.subscribe();
    this.transactionTabView.subscribe();
    this.walletView.subscribe();
  }

  async loadData() {
    // Send data to other class
    this.sendData();

    await this.categoryView.loadCategory();

    await this.loadWalletUser();

    this.summaryTabView.load();

    this.transactionTabView.loadTransactionTab();
  }

  async loadPage() {
    this.toggleLoaderSpinner();
    const user = await this.getInfoUserLogin();

    if (!user) {
      this.clearAccessToken();
      window.location.replace('/login');
    } else {
      this.user = user;
      this.wallet = await this.getWalletByIdUser(user.id);

      this.sendData();
      // Check user's wallet if have or not
      if (!this.wallet) {
        // Show add wallet dialog
        this.walletView.showDialog();
      } else {
        // Init data
        await this.loadTransactionData();
        await this.loadData();

        // Load event page
        this.loadEvent();
      }
    }

    this.toggleLoaderSpinner();
  }

  // ---------------------LOAD DATA---------------------//

  subscribe() {
    this.transform.create('homeView', this.updateData.bind(this));
  }

  sendData() {
    const data = {
      wallet: this.wallet,
      listTransactions: this.listTransactions,
      user: this.user,
    };

    this.transform.onSendSignal('homeView', data);
  }

  updateData(data) {
    if (data.wallet) this.wallet = data.wallet;

    if (data.listTransactions) this.listTransaction = data.listTransactions;

    if (data.listCategory) this.listCategory = data.listCategory;
  }

  /**
   * Load wallet user
   */
  async loadWalletUser() {
    const wallet = this.wallet
      ? this.wallet
      : await this.getWalletByIdUser(this.user.id);
    const walletName = document.querySelector('.wallet__name');
    const walletPrice = document.querySelector('.wallet__price');
    const walletNameValue = wallet.walletName;
    const walletAmountValue = wallet.amountWallet();

    const sign = walletAmountValue >= 0 ? '+' : '-';

    this.wallet = wallet; // Make wallet into global variable

    walletName.textContent = walletNameValue;
    walletPrice.textContent = `${sign}$ ${formatNumber(
      Math.abs(walletAmountValue),
    )}`; // Math.abs(walletAmountValue) to keep the value always > 0

    // Update amount wallet into database
    this.saveWallet(this.wallet);
  }

  async updateAmountWallet() {
    let inflow = 0;
    let outflow = 0;

    // Init data first
    this.transactionDetails =
      this.transactionTabView.loadTransactionDetailsData();

    this.transactionDetails.forEach((transaction) => {
      if (transaction.totalAmount >= 0) {
        inflow += transaction.totalAmount;
      } else {
        outflow -= transaction.totalAmount;
      }
    });

    // Reassign value for wallet user;
    this.wallet.inflow = inflow;
    this.wallet.outflow = -outflow;

    await this.saveWallet(this.wallet);
  }

  async loadTransactionData() {
    this.listTransactions = await this.getAllTransactions(this.wallet.idUser);

    this.sendData();
  }

  // ---------------------END---------------------//

  showSuccessToast(title, message) {
    const typeToast = TYPE_TOAST.success;
    const btnContent = BTN_CONTENT.OK;

    this.initToastContent(typeToast, title, message, btnContent);

    this.toastDialog.showModal();
  }

  /**
   * Implement error toast in site
   * @param {string} content The content will show in error toast
   */
  showErrorToast(error) {
    const title = error.title ? error.title : MESSAGE.DEFAULT_TITLE_ERROR_TOAST;
    const content = error.message ? error.message : error;

    this.initToastContent(TYPE_TOAST.error, title, content, BTN_CONTENT.GOT_IT);

    // Show toast
    this.toastDialog.showModal();
  }

  // ------------------------------- HANDLER EVENT ------------------------------- //

  loadEvent() {
    this.addCommonEventPage();
    this.handlerTabsTransfer();
  }

  /**
   * Handle event when click on tabs
   */
  handlerTabsTransfer() {
    this.tabs.forEach((tab, index) => {
      tab.addEventListener('click', (e) => {
        this.removeActiveTab();
        tab.classList.add('active');

        const line = document.querySelector('.app__line');

        line.style.width = `${e.target.offsetWidth}px`;
        line.style.left = `${e.target.offsetLeft}px`;

        this.allContent.forEach((content) => {
          content.classList.remove('active');
        });
        this.allContent[index].classList.add('active');
      });
    });
  }

  addCommonEventPage() {
    // Add event close dialog when click outside
    this.dialogs.forEach((dialog) => {
      dialog.addEventListener('click', (e) => {
        const dialogDimensions = dialog.getBoundingClientRect();
        if (
          e.clientX < dialogDimensions.left ||
          e.clientX > dialogDimensions.right ||
          e.clientY < dialogDimensions.top ||
          e.clientY > dialogDimensions.bottom
        ) {
          dialog.close();
        }
      });
    });

    this.cancelBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.closeAllDialog();
      });
    });

    // Prevent input =,-,e into amount input
    this.amountInputs.forEach((item) => {
      item.addEventListener(
        'keypress',
        (e) => ['+', '-', 'e'].includes(e.key) && e.preventDefault(),
      );
    });

    // Prevent user input at category search
    const categorySearchEl = document.querySelector('.category-name');
    categorySearchEl.addEventListener('keydown', (e) => {
      e.preventDefault();
    });

    const logoutBtn = document.querySelector('.logout-text');
    logoutBtn.addEventListener('click', () => {
      this.clearAccessToken();

      window.location.replace('/login');
    });
  }

  closeAllDialog() {
    this.dialogs.forEach((dialog) => {
      dialog.close();
    });
  }

  removeActiveTab() {
    this.tabs.forEach((tab) => {
      tab.classList.remove('active');
    });
  }
}
