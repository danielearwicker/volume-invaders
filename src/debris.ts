import { Sprite } from "./sprites";
import { GameState, withinBounds } from "./game";

export class Debris extends Sprite<GameState> {

    vx: number;
    vy: number;

    constructor(other: Sprite<GameState>) {
        super(other.x, other.y);
        
        this.vx = 10 * (Math.random() - 0.5);
        this.vy = 10 * (Math.random() - 0.5);
    }

    move(game: GameState) {

        this.vy += game.elapsed / 100;
        this.x += (this.vx * game.elapsed / 10);
        this.y += (this.vy * game.elapsed / 10);

        return withinBounds(this.x, this.y, game);
    }

    rect() {
        return { left: this.x, top: this.y, width: 0, height: 0 };
    }

    draw(ctx: CanvasRenderingContext2D) {

        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(
            this.x + (2 * this.vx), 
            this.y + (2 * this.vy));        
        ctx.stroke();
    }

}
