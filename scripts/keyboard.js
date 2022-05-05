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
    this.viewTxt = createElement(
      'textarea',
      'viewBlock',
      ['rows', 5],
      ['cols', 50],
      ['placeholder', 'Type text'],
      ['spellcheck', false],
      ['autocorrect', 'off'],
    );
    this.keyboardContainer = createElement('div', 'container__keyboard', ['lang', lngCode]);
    container.appendChild(this.viewTxt);
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
        const keyItem = this.startLang.find((key) => key.keyCode === code);
        if (keyItem) {
          const keyButton = new Key(keyItem);
          this.btnsKey.push(keyButton);
          lineElem.appendChild(keyButton.keyConainer);
        }
      });
    });
    this.keyboardContainer.onmousedown = this.getPressedBtn;
  }

  getPressedBtn = (e) => {
    const keyPressed = e.target.closest('.keys');
    if (!keyPressed) return;
    const { dataset: { code } } = keyPressed;
    this.showTextOnTextaria(code);
  };

  showTextOnTextaria(code) {
    const keyItem = this.btnsKey.find((key) => key.keyCode === code);
    this.viewTxt.value += keyItem.keyChar;
  }
}
