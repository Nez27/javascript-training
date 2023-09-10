import { TYPE_POPUP, MESSAGE, BTN_CONTENT } from '../constants/constant';
import CommonView from './commonView';
import Wallet from '../models/wallet';

export default class HomeView extends CommonView {
  constructor() {
    super();

    this.tabs = document.querySelectorAll('.app__tab-item');
    this.allContent = document.querySelectorAll('.app__content-item');
    this.addTransactionBtn = document.getElementById('addTransaction');
    this.addBudgetBtn = document.getElementById('addBudget');
    this.overlay = document.querySelector('.overlay');
    this.darkOverlay = document.querySelector('.dark-overlay');
    this.dialog = document.querySelectorAll('.dialog');
    this.saveBtn = document.querySelectorAll('.form__save-btn');
    this.cancelBtn = document.querySelectorAll('.form__cancel-btn');
    this.categoryField = document.getElementById('selectCategory');
    this.closeIcon = document.querySelector('.close-icon');

    this.budgetForm = document.getElementById('budgetForm');
    this.transactionForm = document.getElementById('transactionForm');
    this.categoryForm = document.getElementById('categoryForm');
    this.walletForm = document.getElementById('walletForm');

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
        this.walletDialog.classList.add('active');
        // If overlay is not exist on page
        if (!this.overlay.classList.contains('active')) {
          this.toggleActiveOverlay();
        }
      } else {
        this.loadEvent();
      }
    }
  }

  addHandlerSubmitWalletForm(saveWallet) {
    this.walletForm.addEventListener('submit', (e) => {
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
      this.showSuccessPopup('Add wallet success', 'Click ok to continue!');
      this.loadEvent();
    } catch (error) {
      // Show popup error
      this.initErrorPopup(error);
    }
  }

  addHandlerInputChangeWalletForm() {
    this.walletForm.addEventListener('input', (e) => {
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

  showSuccessPopup(title, message) {
    const typePopup = TYPE_POPUP.success;
    const btnContent = BTN_CONTENT.OK;

    this.initPopupContent(typePopup, title, message, btnContent);

    // Show popup
    this.tooglePopupForm();
  }

  /**
   * Implement error popup in site
   * @param {string} content The content will show in error popup
   */
  initErrorPopup(error) {
    const title = error.title ? error.title : MESSAGE.DEFAULT_TITLE_ERROR_POPUP;
    const content = error.message ? error.message : error;

    this.initPopupContent(TYPE_POPUP.error, title, content, BTN_CONTENT.GOT_IT);

    // Show popup
    this.tooglePopupForm();
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
    this.addTransactionBtn.addEventListener('click', () => {
      this.transactionForm.classList.add('active');
      this.toggleActiveOverlay();
    });

    this.addBudgetBtn.addEventListener('click', () => {
      this.budgetForm.classList.add('active');
      this.toggleActiveOverlay();
    });

    this.cancelBtn.forEach((item) => {
      item.addEventListener('click', () => {
        this.hideDialog();
      });
    });

    this.overlay.addEventListener('click', () => {
      this.hideDialog();
    });

    this.popupBtn.addEventListener('click', this.tooglePopupForm.bind(this));
  }

  addEventSelectCategoryDialog() {
    this.categoryField.addEventListener('click', () => {
      this.categoryForm.classList.add('active');
      this.toggleDarkOverlayActive();
    });

    this.closeIcon.addEventListener(
      'click',
      this.hideSelectCategoryForm.bind(this),
    );

    this.darkOverlay.addEventListener(
      'click',
      this.hideSelectCategoryForm.bind(this),
    );
  }

  hideSelectCategoryForm() {
    this.categoryForm.classList.remove('active');
    this.toggleDarkOverlayActive();
  }

  toggleDarkOverlayActive() {
    this.darkOverlay.classList.toggle('active');
  }

  hideDialog() {
    this.dialog.forEach((item) => {
      if (item.classList.contains('active')) {
        item.classList.remove('active');
      }
    });
    this.toggleActiveOverlay();
  }

  toggleActiveOverlay() {
    this.overlay.classList.toggle('active');
  }

  removeActiveTab() {
    this.tabs.forEach((tab) => {
      tab.classList.remove('active');
    });
  }
}
