import { MARK_ICON, TYPE_POPUP } from '../constants/constant';

export default class CommonView {
  constructor() {
    this.overlayMarkup = '<div class="overlay"></div>';

    this.initPopup();
    this.initElementPopup();
    this.initLoader();
    this.handleEventBtnPopupAndOverlay();
  }

  /**
   * Implement popup in site
   */
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

  /**
   * Assgign element in popup to property
   */
  initElementPopup() {
    this.modalBox = document.querySelector('.modal-box');
    this.popupIcon = document.querySelector('.mark');
    this.popupBtn = document.querySelector('.modal-box__redirect-btn');
    this.popupTitle = document.querySelector('.modal-box__title');
    this.popupContent = document.querySelector('.modal-box__message');
    this.overlay = document.querySelector('.overlay');
  }

  /**
   * Show or hide loader screen
   */
  toogleLoaderSpinner() {
    this.spinner.classList.toggle('hidden');
  }

  /**
   * Show or hide popup
   */
  tooglePopupForm() {
    this.overlay.classList.toggle('active');
    this.modalBox.classList.toggle('active');
  }

  /**
   * Add popup content
   * @param {TYPE_POPUP} typePopup Type of the popup
   * @param {string} title Title of popup
   * @param {string} content Content of popup
   * @param {string} btnContent Content of button
   */
  initPopupContent(typePopup, title, content, btnContent) {
    // Remove old typePopup class if haved
    this.modalBox.classList.forEach((classItem) =>
      classItem === TYPE_POPUP.success || classItem === TYPE_POPUP.error
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
      typePopup === TYPE_POPUP.success ? TYPE_POPUP.success : TYPE_POPUP.error,
    );
    this.popupIcon.classList.add(
      typePopup === TYPE_POPUP.success ? MARK_ICON.success : MARK_ICON.error,
    );
    this.popupTitle.textContent = title;
    this.popupContent.textContent = content;
    this.popupBtn.textContent = btnContent;
  }

  /**
   * Add event listener for popup and overlay
   */
  handleEventBtnPopupAndOverlay() {
    this.popupBtn.addEventListener('click', this.tooglePopupForm.bind(this));
    this.overlay.addEventListener('click', this.tooglePopupForm.bind(this));
  }

  /**
   * Implement loader screen
   */
  initLoader() {
    const markup = `<div class="loader hidden"></div>`;

    this.rootElement.insertAdjacentHTML('afterbegin', markup);

    // Init element
    this.spinner = document.querySelector('.loader');
  }
}
