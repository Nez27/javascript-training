import { MARK_ICON, TYPE_FORM } from '../constants/constant';

export default class CommonView {
  constructor() {
    this.overlayMarkup = '<div class="overlay"></div>';

    this.initPopup();
    this.initElementPopup();
    this.initLoader();
    this.handleEventBtnPopupAndOverlay();
  }

  initPopup() {
    this.rootElement = document.querySelector('body');

    const markup = `
      ${this.overlayMarkup}
      <div class="modal-box">
        <div class="mark"></div>
        <h2 class="modal-box__title"></h2>
        <p class="modal-box__message"></p>

        <button class="modal-box__redirect-btn"></button>
      </div>
    `;

    this.rootElement.insertAdjacentHTML('afterbegin', markup);
  }

  initElementPopup() {
    // Init element
    this.modalBox = document.querySelector('.modal-box');
    this.popupIcon = document.querySelector('.mark');
    this.popupBtn = document.querySelector('.modal-box__redirect-btn');
    this.popupTitle = document.querySelector('.modal-box__title');
    this.popupContent = document.querySelector('.modal-box__message');
    this.overlay = document.querySelector('.overlay');
  }

  toogleLoaderSpinner() {
    this.spinner.classList.toggle('hidden');
  }

  tooglePopupForm() {
    this.overlay.classList.toggle('active');
    this.modalBox.classList.toggle('active');
  }

  initPopupContent(typeForm, title, content, btnContent) {
    // Remove old typeForm class if haved
    this.modalBox.classList.forEach((classItem) =>
      classItem === TYPE_FORM.success || classItem === TYPE_FORM.error
        ? this.modalBox.classList.remove(classItem)
        : '',
    );

    // Remove old icon popup if haved
    this.popupIcon.classList.forEach((classItem) =>
      classItem === MARK_ICON.success || classItem === MARK_ICON.error
        ? this.popupIcon.classList.remove(classItem)
        : '',
    );

    // Init content popup
    this.modalBox.classList.add(
      typeForm === TYPE_FORM.success ? TYPE_FORM.success : TYPE_FORM.error,
    );
    this.popupIcon.classList.add(
      typeForm === TYPE_FORM.success ? MARK_ICON.success : MARK_ICON.error,
    );
    this.popupTitle.textContent = title;
    this.popupContent.textContent = content;
    this.popupBtn.textContent = btnContent;
  }

  handleEventBtnPopupAndOverlay() {
    this.popupBtn.addEventListener('click', this.tooglePopupForm.bind(this));
    this.overlay.addEventListener('click', this.tooglePopupForm.bind(this));
  }

  initLoader() {
    const markup = `<div class="loader hidden"></div>`;

    this.rootElement.insertAdjacentHTML('afterbegin', markup);

    // Init element
    this.spinner = document.querySelector('.loader');
  }
}
