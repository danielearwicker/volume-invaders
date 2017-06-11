export abstract class Sprite<Game> {

    constructor(public x: number, public y: number) { }

    abstract move(game: Game): boolean;

    abstract rect(): {
        left: number;
        top: number;
        width: number;
        height: number;
    }

    abstract draw(ctx: CanvasRenderingContext2D): void;
}

export function renderSprites<G, T extends Sprite<G>>(
    ctx: CanvasRenderingContext2D,
    sprites: T[],
    game: G
) {

    for (let s = 0; s < sprites.length; s++) {
        const sprite = sprites[s];
        if (!sprite.move(game)) {
            sprites.splice(s, 1);
            s--;
        } else {
            sprite.draw(ctx);
        }
    }
}

export function hitTest<G, T1 extends Sprite<G>, T2 extends Sprite<G>>(
    game: G,
    first: T1[],
    second: T2[],
    handle: (first: T1, second: T2) => boolean    
) {
    for (let f = 0; f < first.length; f++) {
        for (let s = 0; s < second.length; s++) {

            const rect1 = first[f].rect(),
                  rect2 = second[s].rect();

            if (rect1.left + rect1.width < rect2.left ||
                rect1.left > rect2.left + rect2.width ||
                rect1.top + rect1.height < rect2.top ||
                rect1.top > rect2.top + rect2.height ||
                !handle(first[f], second[s])) {

                continue;
            }

            first.splice(f, 1);
            second.splice(s, 1);
            f--;
            s--;
            break;
        }
    }
}

export interface BasicGameState {
    width: number;
    height: number;
    elapsed: number;
}

export function runSprites<G extends BasicGameState>(
    state: G,    
    canvas: HTMLCanvasElement,
    frame: (ctx: CanvasRenderingContext2D) => void) {
    
    const ctx = canvas.getContext("2d")!;

    let oldTime = 0;

    const loop = (time: number) => {

        resize(canvas);
        state.width = ctx.canvas.width;
        state.height = ctx.canvas.height;

        if (oldTime !== 0) {
            state.elapsed = time - oldTime;
            frame(ctx);
        }

        oldTime = time;
        requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
}

function resize(canvas: HTMLCanvasElement) {

    const w = canvas.parentElement!.clientWidth;
    if (canvas.width != w) {
        canvas.width = w;
    }

    const h = canvas.parentElement!.clientHeight;
    if (canvas.height != h) {
        canvas.height = h;
    }
}
