export default class Transform {
  constructor() {
    this.signal = {};
  }

  onSendSignal(fromClass, value) {
    Object.keys(this.signal).forEach((key) => {
      const item = this.signal[key];

      // Same receiver
      if (item.name === fromClass) {
        return;
      }

      // Send signal
      const { handler } = this.signal[key];
      if (handler) {
        handler(value);
      }
    });
  }

  create(className, handler = null) {
    this.signal[className] = { name: className, handler };
  }
}
