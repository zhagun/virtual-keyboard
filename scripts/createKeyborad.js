export default function createElement(element, classNames, ...dataAttr) {
  let elementHtml = null;

  elementHtml = document.createElement(element);

  if (classNames) {
    elementHtml.classList.add(...classNames.split(' '));
  }

  if (dataAttr.length) {
    dataAttr.forEach(([attrName, attrValue]) => {
      if (attrValue === '') {
        elementHtml.setAttribute(attrName, '');
      }
      if (attrName.match(/value|id|placeholder|cols|rows/)) {
        elementHtml.setAttribute(attrName, attrValue);
      } else {
        elementHtml.dataset[attrName] = attrValue;
      }
    });
  }
  return elementHtml;
}
