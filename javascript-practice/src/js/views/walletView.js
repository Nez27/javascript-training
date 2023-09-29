import { FIRST_ADD_WALLET_NOTE } from '../constants/config';
import Transaction from '../models/transaction';
import Wallet from '../models/wallet';
import * as MESSAGE from '../constants/message';
import { renderRequiredText } from '../helpers/validateForm';

export default class WalletView {
  constructor() {
    this.walletDialog = document.getElementById('walletDialog');

    this.addHandlerEventWalletForm();
  }

  initFunction(
    transform,
    toggleLoaderSpinner,
    saveWallet,
    saveTransaction,
    loadTransactionData,
    loadData,
    loadEvent,
    showSuccessToast,
    showErrorToast,
  ) {
    this.transform = transform;
    this.toggleLoaderSpinner = toggleLoaderSpinner;
    this.saveWallet = saveWallet;
    this.saveTransaction = saveTransaction;
    this.loadTransactionData = loadTransactionData;
    this.loadData = loadData;
    this.loadEvent = loadEvent;
    this.showSuccessToast = showSuccessToast;
    this.showErrorToast = showErrorToast;
  }

  subscribe() {
    this.transform.create('walletView', this.updateData.bind(this));
  }

  sendData() {
    const data = {
      wallet: this.wallet,
      listTransactions: this.listTransactions,
      user: this.user,
    };

    this.transform.onSendSignal('walletView', data);
  }

  updateData(data) {
    if (data.wallet) this.wallet = data.wallet;

    if (data.listTransactions) this.listTransaction = data.listTransactions;

    if (data.listCategory) this.listCategory = data.listCategory;

    if (data.user) this.user = data.user;
  }

  showDialog() {
    this.walletDialog.showModal();
  }

  addHandlerEventWalletForm() {
    this.walletDialog.addEventListener('submit', (e) => {
      e.preventDefault();

      this.clearErrorStyleWalletDialog();
      this.submitWalletForm();
    });

    this.walletDialog.addEventListener('input', (e) => {
      const bodyDialog = e.target.closest('.dialog__body');

      this.changeBtnStyleWalletDialog(bodyDialog);
      this.clearErrorStyleWalletDialog();
    });
  }

  clearErrorStyleWalletDialog() {
    const inputFieldEls =
      this.walletDialog.querySelectorAll('.form__input-field');
    const errorTextEls = this.walletDialog.querySelectorAll('.error-text');

    inputFieldEls.forEach((item) => {
      if (item.classList.contains('error-input'))
        item.classList.remove('error-input');
    });

    errorTextEls.forEach((item) => {
      if (item) item.remove();
    });
  }

  async submitWalletForm() {
    try {
      // Wallet info
      const { walletForm } = document.forms;
      const form = new FormData(walletForm);
      const walletName = form.get('walletName');
      const amount = form.get('amount');

      if (this.validateWalletDialog(walletName, amount)) {
        this.walletDialog.close();
        this.toggleLoaderSpinner();

        this.wallet = new Wallet({
          walletName,
          amount: +amount,
          idUser: this.user.id,
          inflow: +amount,
        });

        this.sendData();

        await this.saveWallet(this.wallet);
        // Transaction info
        const transaction = new Transaction({
          categoryName: 'Income',
          date: new Date().toISOString().slice(0, 10),
          note: FIRST_ADD_WALLET_NOTE,
          amount: +amount,
          idUser: this.user.id,
        });
        await this.saveTransaction(transaction);
        // Load data and event
        await this.loadTransactionData();
        await this.loadData();
        this.loadEvent();
        this.showSuccessToast(
          MESSAGE.ADD_WALLET_SUCCESS,
          MESSAGE.DEFAULT_MESSAGE,
        );
        await this.loadData(); // Load data from database into page

        this.toggleLoaderSpinner();
      }
    } catch (error) {
      // Show toast error
      this.showErrorToast(error);
      this.toggleLoaderSpinner();
    }
  }

  validateWalletDialog(walletName, amount) {
    const inputFieldEls =
      this.walletDialog.querySelectorAll('.form__input-field');

    if (!walletName || !amount) {
      if (!walletName) {
        renderRequiredText('wallet name', inputFieldEls[0]);
        inputFieldEls[0].classList.add('error-input');
      }

      if (!amount) {
        renderRequiredText('amount', inputFieldEls[2]);
        inputFieldEls[2].classList.add('error-input');
      }

      return false;
    }

    return true;
  }

  // eslint-disable-next-line class-methods-use-this
  changeBtnStyleWalletDialog(bodyDialog) {
    const walletName = bodyDialog.querySelector('.form__input-text').value;
    const amount = bodyDialog.querySelector('.form__input-balance').value;
    const saveBtn = bodyDialog.querySelector('.form__save-btn');

    if (walletName.length >= 3 && amount >= 1) {
      saveBtn.classList.add('active');
    } else {
      saveBtn.classList.remove('active');
    }
  }
}
