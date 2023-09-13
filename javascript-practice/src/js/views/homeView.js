import { TYPE_TOAST, BTN_CONTENT } from '../constants/variable';
import * as MESSAGE from '../constants/message';
import CommonView from './commonView';
import Wallet from '../models/wallet';
import { formatNumber } from '../helpers/helpers';

export default class HomeView extends CommonView {
  constructor() {
    super();

    this.tabs = document.querySelectorAll('.app__tab-item');
    this.allContent = document.querySelectorAll('.app__content-item');
    this.addTransactionBtn = document.getElementById('addTransaction');
    this.addBudgetBtn = document.getElementById('addBudget');
    this.cancelBtns = document.querySelectorAll('.form__cancel-btn');
    this.saveBtns = document.querySelectorAll('.form__save-btn');
    this.dialogs = document.querySelectorAll('.dialog');
    this.categoryField = document.getElementById('selectCategory');
    this.closeIcon = document.querySelector('.close-icon');

    this.budgetDialog = document.getElementById('budgetDialog');
    this.transactionDialog = document.getElementById('transactionDialog');
    this.categoryDialog = document.getElementById('categoryDialog');
    this.walletDialog = document.getElementById('walletDialog');
  }

  async loadPage(getInfoUserLogin, isValidWallet, getWalletByIdUser) {
    this.getWalletByIdUser = getWalletByIdUser; // Init function
    this.toggleLoaderSpinner();
    const user = await getInfoUserLogin();

    if (!user) {
      window.location.replace('/login');
    } else {
      this.user = user;
      const wallet = await isValidWallet(user.id);

      // Check user's wallet if have or not
      if (!wallet) {
        // Show add wallet dialog
        this.walletDialog.showModal();
      } else {
        // Load event page
        this.loadEvent();

        // Init data
        this.loadData();
      }
    }

    this.toggleLoaderSpinner();
  }

  async loadData() {
    const wallet = await this.getWalletByIdUser(this.user.id); // Get data wallet
    const walletName = document.querySelector('.wallet__name');
    const walletPrice = document.querySelector('.wallet__price');
    const sign = wallet.amount >= 0 ? '+' : '-';
    const walletNameValue = wallet.walletName;
    const walletAmountValue = formatNumber(wallet.amount);

    this.wallet = wallet;

    walletName.textContent = walletNameValue;
    walletPrice.textContent = `${sign}$ ${walletAmountValue}`;
  }

  // ---------------------ADD BUDGET DIALOG---------------------//
  addHandlerSubmitBudgetForm() {
    this.budgetDialog.addEventListener('submit', (e) => {
      e.preventDefault();

      this.submitBudgetForm();
    });
  }

  submitBudgetForm() {
    const { formAddBudget } = document.forms;
    const form = new FormData(formAddBudget);
    const date = form.get('date');
    const amount = form.get('amount');
    const note = form.get('note');

    alert(`Date: ${date}, Amount: ${amount}, Note: ${note}`);
  }
  // ---------------------END DIALOG---------------------//

  // ---------------------WALLET DIALOG--------------------- //
  addHandlerSubmitWalletForm(saveWallet) {
    this.walletDialog.addEventListener('submit', (e) => {
      e.preventDefault();

      this.submitWalletForm(saveWallet);
    });
  }

  async submitWalletForm(saveWallet) {
    this.walletDialog.close();
    this.toggleLoaderSpinner();
    try {
      const wallet = new Wallet({
        walletName: this.walletName,
        amount: +this.amount,
        idUser: this.user.id,
      });

      await saveWallet(wallet);

      this.showSuccessToast('Add wallet success', 'Click ok to continue!');
      this.loadEvent();
      this.loadData();
    } catch (error) {
      // Show toast error
      this.initErrorToast(error);
    }

    this.toggleLoaderSpinner();
  }

  addHandlerInputChangeWalletForm() {
    this.walletDialog.addEventListener('input', (e) => {
      const bodyDialog = e.target.closest('.dialog__body');
      this.validateWalletForm(bodyDialog);
    });
  }

  validateWalletForm(bodyDialog) {
    this.walletName = bodyDialog.querySelector('.form__input-text').value;
    this.amount = bodyDialog.querySelector('.form__input-balance').value;
    const saveBtns = bodyDialog.querySelector('.form__save-btn');

    if (this.walletName.length >= 3 && this.amount.length >= 1) {
      saveBtns.classList.add('active');
    } else {
      saveBtns.classList.remove('active');
    }
  }

  // ---------------------END DIALOG--------------------- //

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
  initErrorToast(error) {
    const title = error.title ? error.title : MESSAGE.DEFAULT_TITLE_ERROR_TOAST;
    const content = error.message ? error.message : error;

    this.initToastContent(TYPE_TOAST.error, title, content, BTN_CONTENT.GOT_IT);

    // Show toast
    this.dialogToast.showModal();
  }

  // ------------------------------- HANDLER EVENT ------------------------------- //

  loadEvent() {
    this.addCommonEventPage();
    this.handlerTabsTransfer();
    this.addEventSelectCategoryDialog();
  }

  /**
   * Handle event when click on tabs
   */
  handlerTabsTransfer() {
    this.tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        this.removeActiveTab();
        tab.classList.add('active');

        const line = document.querySelector('.app__line');

        line.classList.toggle('right', line.classList.contains('left'));
        line.classList.toggle('left', !line.classList.contains('right'));

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

    this.addTransactionBtn.addEventListener('click', () => {
      this.transactionDialog.showModal();
    });

    this.addBudgetBtn.addEventListener('click', () => {
      this.budgetDialog.showModal();
    });

    this.cancelBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.closeAllDialog();
      });
    });
  }

  addEventSelectCategoryDialog() {
    this.categoryField.addEventListener('click', () => {
      this.categoryDialog.showModal();
    });

    this.closeIcon.addEventListener('click', () => {
      this.categoryDialog.close();
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
