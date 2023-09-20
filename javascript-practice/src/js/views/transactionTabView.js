import {
  createTransactionDetailObject,
  getAllCategoryNameInTransactions,
  getAllTransactionByCategoryName,
} from '../helpers/dataProcess';
import { formatNumber } from '../helpers/helpers';
import TransactionView from './transactionView';

class TransactionTabView {
  constructor() {
    this.addEventTransactionItem();
  }

  initFunction(transform) {
    this.transform = transform;
  }

  subscribe() {
    this.transform.create('transactionTabView', this.updateData.bind(this));
  }

  updateData(data) {
    if (data.wallet) this.wallet = data.wallet;

    if (data.listTransactions) this.listTransactions = data.listTransactions;

    if (data.listCategory) this.listCategory = data.listCategory;
  }

  async loadTransactionTab() {
    // Load category
    // Init data first
    this.transactionDetails = this.loadTransactionDetailsData();
    const transactionEl = document.querySelector('.transaction');
    const listTransactionDetailEl =
      transactionEl.querySelector('.transaction__list');
    const markup = [];
    if (this.transactionDetails) {
      this.transactionDetails.forEach((transactionDetail) => {
        markup.push(this.transactionDetailMarkup(transactionDetail));
      });
    }
    listTransactionDetailEl.innerHTML = '';
    listTransactionDetailEl.insertAdjacentHTML('afterbegin', markup.join('\n'));
    // Load event
    this.addEventTransactionItem();
  }

  loadTransactionDetailsData() {
    // Get all category user have in transactions
    const listCategoryInTransaction = getAllCategoryNameInTransactions(
      this.listTransactions,
    );

    // Create transactions details object
    const tempList = listCategoryInTransaction.map((categoryName) => {
      // Get category object from list category has been loaded.
      const category = this.listCategory.filter(
        (item) => item.name === categoryName,
      );

      const transactions = getAllTransactionByCategoryName(
        categoryName,
        this.listTransactions,
      );

      return createTransactionDetailObject(
        Object.assign({}, ...category),
        transactions,
      );
    });

    tempList.sort(
      (a, b) =>
        parseInt(b.transactions[0].id, 10) - parseInt(a.transactions[0].id, 10),
    );

    return tempList;
  }

  // eslint-disable-next-line class-methods-use-this
  transactionDetailMarkup(transactionDetail) {
    const transactionTimeMarkup = () => {
      const listMarkup = [];
      transactionDetail.transactions.forEach((transaction) => {
        const markup = `
          <div class="transaction__time" data-id=${transaction.id}>
            <div class="transaction__details">
              <p class="transaction__day">${transaction.day}</p>
              <div class="transaction__time-details">
                <p class="transaction__date-time">
                  ${transaction.fullDateString}
                </p>
                <p class="transaction__note">${
                  transaction.note === '' ? 'None' : transaction.note
                }</p>
              </div>
            </div>
            <p class="transaction__${
              transaction.amount >= 0 ? 'income' : 'outcome'
            }">${transaction.amount >= 0 ? '+' : '-'}$ ${formatNumber(
              Math.abs(transaction.amount),
            )}</p>
          </div>
        `;

        listMarkup.push(markup);
      });

      return listMarkup.join('\n');
    };

    return `
      <div class="transaction__item">
        <div class="transaction__category">
          <div class="transaction__category-infor">
            <div class="transaction__category-icon-container">
              <img
                class="icon-category"
                src="${transactionDetail.url}"
                alt="Transportation icon category"
              />
            </div>
            <div class="transaction__category-content">
              <p class="transaction__category-name">
                ${transactionDetail.categoryName}
              </p>
              <p class="transaction__total">${
                transactionDetail.totalTransaction
              } Transactions</p>
            </div>
          </div>
          <p class="transaction__category-total">${
            transactionDetail.totalAmount >= 0 ? '+' : '-'
          }$ ${formatNumber(Math.abs(transactionDetail.totalAmount))}</p>
        </div>
        <div class="transaction__line"></div>
        <!-- Transaction time item -->
        ${transactionTimeMarkup()}
      </div>
    `;
  }

  // eslint-disable-next-line class-methods-use-this
  addEventTransactionItem() {
    const transactionItemEl = document.querySelectorAll('.transaction__item');

    if (transactionItemEl) {
      transactionItemEl.forEach((item) => {
        item.addEventListener('click', (e) => {
          const transactionTime = e.target.closest('.transaction__time');
          const categoryNameEl = item.querySelector(
            '.transaction__category-name',
          );

          if (transactionTime) {
            const idTransaction = transactionTime.dataset.id;

            // If it is income transaction, don't show dialog
            if (categoryNameEl.textContent.trim() !== 'Income')
              TransactionView.showTransactionDialog(idTransaction);
          }
        });
      });
    }
  }
}

export default new TransactionTabView();
