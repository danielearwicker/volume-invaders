import { Sprite } from "./sprites";
import { GameState } from "./game";

const BulletHeight = 20;

export class Bullet extends Sprite<GameState> {

    move(game: GameState) {
        this.y -= game.elapsed;
        return this.y > 0;
    }

    rect() {
        return {
            left: this.x - 2,
            top: this.y - BulletHeight,
            width: 4,
            height: BulletHeight
        };
    }
    
    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y - BulletHeight);
        ctx.stroke();
    }
}
