export function flash(scene, element, color, delay) {
  console.log(element);
  element.setTint(0xff0000);
  setTimeout(() => {
    element.clearTint();
  }, delay);
}
