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
    this.keysPressed = {};
    this.isCaps = false;
    this.btnsSort = btnsSort;
  }

  createTextBlock(lngCode) {
    this.startLang = keysLang[lngCode];
    this.viewTxt = createElement(
      'textarea',
      'viewBlock',
      ['rows', 5],
      ['cols', 50],
      ['placeholder', 'Type text'],
    );
    this.keyboardContainer = createElement('div', 'container__keyboard', [
      'lang',
      lngCode,
    ]);
    container.appendChild(this.viewTxt);
    container.appendChild(this.keyboardContainer);
    document.body.prepend(mainBlock);
    return this;
  }

  generateBtns() {
    this.btnsKey = [];
    this.btnsSort.forEach((lineKeys, index) => {
      const lineElem = createElement('div', 'keyboard__line', [
        'line',
        index + 1,
      ]);
      this.keyboardContainer.appendChild(lineElem);
      lineKeys.forEach((code) => {
        const keyItem = this.startLang.find((key) => key.keyCode === code);
        if (keyItem) {
          const keyButton = new Key(keyItem);
          this.btnsKey.push(keyButton);
          lineElem.appendChild(keyButton.keyContainer);
        }
      });
    });
    document.addEventListener('keydown', this.getPressedBtn);
    this.keyboardContainer.onmousedown = this.getPressedBtn;
    document.addEventListener('keyup', this.getPressedBtn);
    this.keyboardContainer.onmouseup = this.getPressedBtn;
  }

  getPressedBtn = (e) => {
    e.preventDefault();
    let code = '';
    const { type } = e;
    if (type.match(/keydown|keyup/)) {
      const keyPressed = e;
      ({ code } = keyPressed);
    }
    if (type.match(/mousedown|mouseup/)) {
      const keyPressed = e.target.closest('.keys');
      if (!keyPressed) return;
      ({
        dataset: { code },
      } = keyPressed);
      keyPressed.addEventListener('mouseleave', this.resetButtonState);
    }
    this.workingWithBtns({ code, type });
  };

  workingWithBtns = (e) => {
    if (e.stopPropagation) e.stopPropagation();
    const { code, type } = e;
    const keyItem = this.btnsKey.find((key) => key.keyCode === code);
    if (!keyItem) return;
    this.viewTxt.focus();
    if (type.match(/mousedown|keydown/)) {
      keyItem.keyContainer.classList.add('pressed');
      if (code.match(/Shift/)) this.shiftKey = true;
      if (this.shiftKey) this.changeCaseToUpper(true);
      if (code.match(/Control|Alt|Caps/) && e.repeat) return;
      if (code.match(/Control/)) this.ctrKey = true;
      if (code.match(/Alt/)) this.altKey = true;
      if (code.match(/Caps/) && !this.isCaps) {
        this.isCaps = true;
        this.changeCaseToUpper(true);
      } else if (code.match(/Caps/) && this.isCaps) {
        this.isCaps = false;
        this.changeCaseToUpper(false);
        keyItem.keyContainer.classList.remove('pressed');
      }
      if (!this.isCaps) {
        this.showTextOnTextaria(
          keyItem,
          this.shiftKey ? keyItem.keySpecial : keyItem.keyChar,
        );
      } else if (this.isCaps) {
        if (this.shiftKey) {
          this.showTextOnTextaria(
            keyItem,
            keyItem.supText ? keyItem.keySpecial : keyItem.keyChar,
          );
        } else {
          this.showTextOnTextaria(
            keyItem,
            !keyItem.supText ? keyItem.keySpecial : keyItem.keyChar,
          );
        }
      }
    }
    this.keysPressed[keyItem.keyCode] = keyItem;
    if (type.match(/mouseup|keyup/)) {
      this.clearEventPressed(code);
      if (code.match(/Shift/)) {
        this.shiftKey = false;
        this.changeCaseToUpper(false);
      }
      if (code.match(/Control/)) this.ctrKey = false;
      if (code.match(/Alt/)) this.altKey = false;

      if (!code.match(/Caps/)) keyItem.keyContainer.classList.remove('pressed');
    }
  };

  changeCaseToUpper(statusCaseUper) {
    if (statusCaseUper) {
      this.btnsKey.forEach((keyBtn, i) => {
        if (
          !keyBtn.specialKeyStatus && this.isCaps && !this.shiftKey && !keyBtn.supText
        ) {
          this.btnsKey[i].mainKeyText.innerHTML = keyBtn.keySpecial;
        } else if (!keyBtn.specialKeyStatus && this.isCaps && this.shiftKey) {
          this.btnsKey[i].mainKeyText.innerHTML = keyBtn.keyChar;
        } else if (!keyBtn.specialKeyStatus && !keyBtn.supText) {
          this.btnsKey[i].mainKeyText.innerHTML = keyBtn.keySpecial;
        }
      });
    } else {
      this.btnsKey.forEach((keyBtn, i) => {
        if (keyBtn.supText && !keyBtn.specialKeyStatus) {
          if (!this.isCaps) {
            this.btnsKey[i].mainKeyText.innerHTML = keyBtn.keyChar;
          } else this.btnsKey[i].mainKeyText.innerHTML = keyBtn.keySpecial;
        } else if (!keyBtn.specialKeyStatus) {
          if (this.isCaps) {
            this.btnsKey[i].mainKeyText.innerHTML = keyBtn.keySpecial;
          } else {
            this.btnsKey[i].mainKeyText.innerHTML = keyBtn.keyChar;
          }
        }
      });
    }
  }

  resetButtonState = ({
    target: {
      dataset: { code },
    },
  }) => {
    if (code.match('Shift')) {
      this.shiftKey = false;
      this.changeCaseToUpper(false);
      this.keysPressed[code].keyContainer.classList.remove('pressed');
    }
    if (code.match(/Alt/)) this.altKey = false;
    if (code.match(/Control/)) this.ctrKey = false;
    this.clearEventPressed(code);
    this.viewTxt.focus();
  };

  clearEventPressed = (targetCode) => {
    if (!this.keysPressed[targetCode]) return;
    if (!this.isCaps || (this.isCaps && !targetCode.match(/Caps/))) {
      this.keysPressed[targetCode].keyContainer.classList.remove('pressed');
    }
    this.keysPressed[targetCode].keyContainer.removeEventListener(
      'mouseleave',
      this.resetButtonState,
    );
    delete this.keysPressed[targetCode];
  };

  showTextOnTextaria(keyItem, keyText) {
    this.viewTxt.value += keyText;
  }
}
