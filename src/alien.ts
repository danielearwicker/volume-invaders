import { Sprite } from "./sprites";
import { GameState, withinBounds } from "./game";

const AlienSize = 20;

export class Alien extends Sprite<GameState> {

    up: boolean;
    direction: number;
    speed: number;

    constructor(game: GameState) {
        super(Math.random() * game.width, 1);

        this.up = Math.random() > 0.5;
        this.direction = Math.PI * Math.random(),
        this.speed = 0.3 + (0.5 * Math.random());
    }

    move(game: GameState) {

        this.direction += (Math.random() - 0.5) * 0.5;

        const speed = game.elapsed * this.speed / 5;

        this.x += Math.cos(this.direction) * speed;
        this.y += Math.sin(this.direction) * speed;

        return withinBounds(this.x, this.y, game);
    }

    rect() {        
        return {
            left: this.x - AlienSize,
            top: this.y,
            width: AlienSize * 2,
            height: AlienSize
        }
    }

    draw(ctx: CanvasRenderingContext2D) {

        ctx.beginPath();

        ctx.moveTo(this.x - AlienSize, this.y + (this.up ? AlienSize : 0));
        ctx.lineTo(this.x, this.y + (this.up ? 0 : AlienSize));
        ctx.lineTo(this.x + AlienSize, this.y + (this.up ? AlienSize : 0));

        ctx.lineWidth = 6;
        ctx.strokeStyle = this.up ? "red" : "blue";

        ctx.stroke();
    }
}
