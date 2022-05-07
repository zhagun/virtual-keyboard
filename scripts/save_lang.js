export function setValueLang(name, value) {
  window.localStorage.setItem(name, JSON.stringify(value));
}

export function getValueLang(name, subst = null) {
  return JSON.parse(window.localStorage.getItem(name) || subst);
}

export function remValueLang(name) {
  localStorage.removeItem(name);
}
