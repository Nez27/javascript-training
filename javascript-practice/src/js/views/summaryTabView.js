import { formatNumber } from '../helpers/helpers';

class SummaryTabView {
  initFunction(transform) {
    this.transform = transform;
  }

  subscribe() {
    this.transform.create('summaryTabView', this.updateData.bind(this));
  }

  updateData(data) {
    if (data.wallet) this.wallet = data.wallet;

    if (data.listTransactions) this.listTransaction = data.listTransactions;

    if (data.listCategory) this.listCategory = data.listCategory;
  }

  load() {
    const inflowValue = document.querySelector('.inflow__text--income');
    const outflowValue = document.querySelector('.outflow__text--outcome');
    const totalValue = document.querySelector('.summary__total');

    const { inflow } = this.wallet;
    const { outflow } = this.wallet;
    const total = inflow + outflow;

    inflowValue.textContent = `+$ ${formatNumber(inflow)}`;
    outflowValue.textContent = `-$ ${formatNumber(Math.abs(outflow))}`;
    totalValue.textContent = `${total >= 0 ? '+' : '-'}$ ${formatNumber(
      Math.abs(total),
    )}`;
  }
}

export default new SummaryTabView();
