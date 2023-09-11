import { TYPE_TOAST, BTN_CONTENT } from '../constants/variable';
import * as MESSAGE from '../constants/message';
import CommonView from './commonView';
import Wallet from '../models/wallet';

export default class HomeView extends CommonView {
  constructor() {
    super();

    this.tabs = document.querySelectorAll('.app__tab-item');
    this.allContent = document.querySelectorAll('.app__content-item');
    this.addTransactionBtn = document.getElementById('addTransaction');
    this.addBudgetBtn = document.getElementById('addBudget');
    this.saveBtn = document.querySelectorAll('.form__save-btn');
    this.dialogs = document.querySelectorAll('.dialog');
    this.cancelBtn = document.querySelectorAll('.form__cancel-btn');
    this.categoryField = document.getElementById('selectCategory');
    this.closeIcon = document.querySelector('.close-icon');

    this.budgetDialog = document.getElementById('budgetDialog');
    this.transactionDialog = document.getElementById('transactionDialog');
    this.categoryDialog = document.getElementById('categoryDialog');
    this.walletDialog = document.getElementById('walletDialog');
  }

  async loadPage(getInfoUserLogin, checkWalletExist) {
    const user = await getInfoUserLogin();

    if (!user) {
      window.location.replace('/login');
    } else {
      this.user = user;
      const walletExist = await checkWalletExist(user.id);

      // Check user's wallet if have or not
      if (!walletExist) {
        // Show add wallet dialog
        this.walletDialog.showModal();
      } else {
        this.loadEvent();
      }
    }
  }

  addHandlerSubmitWalletForm(saveWallet) {
    this.walletDialog.addEventListener('submit', (e) => {
      e.preventDefault();

      this.submitWalletForm(saveWallet);
    });
  }

  async submitWalletForm(saveWallet) {
    try {
      const wallet = new Wallet({
        walletName: this.walletName,
        amount: this.amount,
        idUser: this.user.id,
      });

      await saveWallet(wallet);

      this.hideDialog();
      this.showSuccessToast('Add wallet success', 'Click ok to continue!');
      this.loadEvent();
    } catch (error) {
      // Show toast error
      this.initErrorToast(error);
    }
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
    const saveBtn = bodyDialog.querySelector('.form__save-btn');

    if (this.walletName.length >= 3 && this.amount.length >= 1) {
      saveBtn.classList.add('active');
    } else {
      saveBtn.classList.remove('active');
    }
  }

  showSuccessToast(title, message) {
    const typeToast = TYPE_TOAST.success;
    const btnContent = BTN_CONTENT.OK;

    this.initToastContent(typeToast, title, message, btnContent);

    this.dialogToast.showModal();
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
    this.toggleToastForm();
  }

  /* ------------------------------- HANDLER EVENT ------------------------------- */

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

    this.addTransactionBtn.addEventListener('click', () => {
      this.transactionDialog.showModal();
    });

    this.addBudgetBtn.addEventListener('click', () => {
      this.budgetDialog.showModal();
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

  removeActiveTab() {
    this.tabs.forEach((tab) => {
      tab.classList.remove('active');
    });
  }

  toggleDialog() {
    this.dialog.forEach((item) => {
      if (item.classList.contains('active')) {
        item.classList.remove('active');
      }
    });
  }
}
