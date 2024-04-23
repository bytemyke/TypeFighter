/**
+ * Creates a button with the given text, and when clicked will start the given scene with the given data.
+ * @param {number} x - The x position of the button.
+ * @param {number} y - The y position of the button.
+ * @param {string} text - The text to display on the button.
+ * @param {Phaser.Scene} scene - The scene that this button will be added to.
+ * @param {string} nextScene - The name of the scene to start when the button is clicked.
+ * @param {Object} sceneData - The data to pass to the next scene when the button is clicked.
+ * @returns {Phaser.GameObjects.Container} - The button container.
+ */
export  function createButton(x, y, text, scene,nextScene, sceneData) {
    scene.anims.create({
      key: "on_button_hover",
      frames: scene.anims.generateFrameNumbers("button", {
        start: 0,
        end: 6,
        first: 0,
      }),
      frameRate: 24,
      repeat: 0,
    });

    const Button = scene.add.container(
      [x],
      [y],
      [
        scene.add
          .sprite(0, 0, "button")
          .setInteractive({ useHandCursor: true })
          .on("pointerdown", () => scene.scene.start(nextScene, sceneData))
          .on("pointerover", function (pointer) {
            this.play("on_button_hover");
          })
          .on("pointerout", function (pointer) {
            // scene.stop("button_hover");
            this.anims.playReverse("on_button_hover");
          }),
        scene.add.text(-120, -50, text, {
          fontFamily: '"Caveat"',
          fontSize: 60,
          color: "#7a7a7a",
          stroke: "#FFF",
          strokeThickness: 4,
        }),
      ]
    );
    return Button
  }
