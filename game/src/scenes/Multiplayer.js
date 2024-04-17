import {Scene} from 'phaser'
import io from 'socket.io-client';

export class Multiplayer extends Scene {
    constructor() {
        super('Multiplayer');
    } 
    create(){
        //real backend url : https://typefighterserver.adaptable.app
        //Dev url : http://localhost:3000
        const URL = 'https://typefighterserver.adaptable.app';
        this.socket = io(URL);

        this.socket.on('connect', function () {
        	console.log('Connected!');
        });
    }
}