import createElement from './createKeyborad.js';

export default class Key {
  constructor({ keyChar, keySpecial, keyCode }) {
    this.keyCode = keyCode;
    this.keyChar = keyChar;
    this.keySpecial = keySpecial;
    this.specialKeyStatus = Boolean(keyChar.match(/Ctrl|arr|Alt|Shift|Tab|Back|Del|Enter|Caps|Win/));
    this.keyContainer = createElement(
      'div',
      'keys',
      ['code', this.keyCode],
    );
    if (keySpecial && keySpecial.match(/[^a-zA-Zа-яА-ЯёЁ0-9]/)) {
      this.supText = createElement('div', 'supText');
      this.mainKeyText = createElement('div', 'mainText');
      this.supText.innerHTML = keySpecial;
      this.mainKeyText.innerHTML = keyChar;
      this.keyContainer.appendChild(this.supText);
      this.keyContainer.appendChild(this.mainKeyText);
    } else {
      this.supText = createElement('div', 'supText');
      this.supText.innerHTML = '';
      this.mainKeyText = createElement('div', 'mainText');
      this.mainKeyText.innerHTML = keyChar;
      this.keyContainer.appendChild(this.supText);
      this.keyContainer.appendChild(this.mainKeyText);
    }
  }
}
