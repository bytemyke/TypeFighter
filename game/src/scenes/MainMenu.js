import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.add.image(512, 384, 'background');

        this.add.image(512, 300, 'logo');

        this.add.text(512, 460, 'Main Menu', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        var style = { font: "24px Arial", fill: "#ffffff", align: "center" };

        var button1 = this.add.text(512, 420, "Single Player", style);
        button1.setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.scene.start('Game'));

        var button2 = this.add.text(512 - 300, 420, "Multiplayer", style);
        button2.setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.scene.start('Multiplayer'));

        var button3 = this.add.text(512 + 150, 420, "Instructions", style);
        button3.setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.scene.start('Instructions'));



    }
}
