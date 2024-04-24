export function flash(scene, element, color, delay) {
  console.log(element);
  element.setTint(0xFF0000);
  scene.scene.time.addEvent({
    delay: delay,
    callback: function () {
      element.clearTint();
    },
    callbackScope: scene,
  });
}
