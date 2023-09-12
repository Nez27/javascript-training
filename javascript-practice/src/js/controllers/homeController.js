export default class HomeController {
  constructor(service, view) {
    this.service = service;
    this.homeView = view.homeView;
  }

  init() {
    if (this.homeView) {
      this.homeView.handlerTabsTransfer();
      this.homeView.addCommonEventPage();
      this.homeView.addEventSelectCategoryDialog();
    }
  }
}
