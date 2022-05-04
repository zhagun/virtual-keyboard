import createElement from './createKeyborad.js';
import keysLang from './keysLang/general.js';
import Key from './keys.js';

const mainBlock = document.createElement('main');
const container = document.createElement('div');
container.classList.add('main__container');
mainBlock.appendChild(container);
container.innerHTML = '<h1 class = "main__title">Virtual Keyboard</h1>';

export default class Keyboard {
  constructor(btnsSort) {
    this.btnsSort = btnsSort;
    this.keysPressed = {};
    this.isCaps = false;
  }

  createTextBlock(lngCode) {
    this.startLang = keysLang[lngCode];
    this.view = createElement(
      'textarea',
      'viewBlock',
      ['rows', 5],
      ['cols', 50],
      ['placeholder', 'Type text'],
      ['spellcheck', false],
      ['autocorrect', 'off'],
    );
    this.keyboardContainer = createElement('div', 'container__keyboard');
    container.appendChild(this.view);
    container.appendChild(this.keyboardContainer);
    document.body.prepend(mainBlock);
    return this;
  }

  generateBtns() {
    this.btnsKey = [];
    this.btnsSort.forEach((lineKeys, index) => {
      const lineElem = createElement('div', 'keyboard__line', ['line', index + 1]);
      this.keyboardContainer.appendChild(lineElem);
      lineKeys.forEach((code) => {
        const keyObj = this.startLang.find((key) => key.keyCode === code);
        if (keyObj) {
          const keyButton = new Key(keyObj);
          this.btnsKey.push(keyButton);
          lineElem.appendChild(keyButton.keyConainer);
        }
      });
    });
  }
}
