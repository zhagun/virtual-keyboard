import createElement from './createKeyborad.js';

export default class Key {
  constructor({ keyChar, keySpecial, keyCode }) {
    this.keyCode = keyCode;
    this.keyChar = keyChar;
    this.keySpecial = keySpecial;
    this.keyConainer = createElement(
      'div',
      'keys',
      ['code', this.keyCode],
    );
    if (keySpecial && keySpecial.match(/[^a-zA-Zа-яА-ЯёЁ0-9]/)) {
      this.supText = createElement('div', 'supText');
      this.mainKeyText = createElement('div', 'mainText');
      this.supText.innerHTML = keySpecial;
      this.mainKeyText.innerHTML = keyChar;
      this.keyConainer.appendChild(this.supText);
      this.keyConainer.appendChild(this.mainKeyText);
    } else {
      this.mainKeyText = createElement('div', 'mainText');
      this.mainKeyText.innerHTML = keyChar;
      this.keyConainer.appendChild(this.mainKeyText);
    }
  }
}
