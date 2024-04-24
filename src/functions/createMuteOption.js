export function createMuteOption(scene){
    let icon;
    scene.sound.mute == true? icon= "muted_audio" : icon= "audio" 

    scene.add
    let muteButton = scene.add.sprite(20, scene.sys.game.scale.gameSize.height - 120, icon).setOrigin(0)
    .setInteractive({ useHandCursor: true })
    .on("pointerdown", () => {
        scene.sound.mute == true? scene.sound.mute = false : scene.sound.mute = true;
        scene.sound.mute == true? icon = "audio" : icon ="muted_audio" 
        console.log(muteButton)
        muteButton.setTexture(icon)
    }).setScale(.25);
}