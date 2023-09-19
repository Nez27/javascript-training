export default class TransactionView {
  constructor() {}

  onTransitionChange() {
    this.onTransitionChangeHandler();
  }

  initTransitionChange(handler) {
    this.onTransitionChangeHandler = handler;
  }

  submitTransaction() {
    const transactionDialog = document.getElementById('transactionDialog');

    const saveBtn = transactionDialog.querySelector('.form__save-btn');

    saveBtn.addEventListener('click', this.onTransitionChange);
  }
}
