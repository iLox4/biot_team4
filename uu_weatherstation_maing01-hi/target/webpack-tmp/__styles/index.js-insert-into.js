function insert(styleEl) {
  let insertionEl = document.head || document.body;

  styleEl.setAttribute("data-owner", "uu5_tutorial_maing01-hi/uu5_tutorial_maing01-hi@0.2.5");
  styleEl.setAttribute("data-emotion", "uu-tutorial");
  styleEl.setAttribute("data-tech", "less");

  // insert the style element
  // 1. after last matching data-emotion using technology "less"
  let els = insertionEl.querySelectorAll(`style[data-emotion="uu-tutorial"]`);
  for (let i = els.length - 1; i >= 0; i--) {
    let el = els[i];
    if (el.getAttribute("data-tech") === "less") {
      el.parentNode.insertBefore(styleEl, el.nextSibling);
      return;
    }
  }

  // 2. before first matching data-emotion using technology "emotion"
  for (let i = 0; i < els.length; i++) {
    let el = els[i];
    if (el.getAttribute("data-tech") !== "less") {
      el.parentNode.insertBefore(styleEl, el);
      return;
    }
  }

  // 3. before element with data-uu-app-styles-insert-before attribute
  let el = document.querySelector("[data-uu-app-styles-insert-before]");
  if (el) {
    el.parentNode.insertBefore(styleEl, el);
    return;
  }

  // 4. at the end of <head> or <body>
  insertionEl.appendChild(styleEl);
}

const PSEUDO_ELEMENT = {
  appendChild: insert,
  insertBefore: insert,
  insertAfter: insert
};

module.exports = function insertInto() {
  return PSEUDO_ELEMENT;
};
