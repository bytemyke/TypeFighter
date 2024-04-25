export function flash(element, color, delay) {
  element.setTint(0xff0000);
  setTimeout(() => {
    element.clearTint();
  }, delay);
}
