import { renderSprites, hitTest, runSprites } from "./sprites";

import { GameState } from "./game";

import { Alien } from "./alien";
import { Bullet } from "./bullet";
import { Debris } from "./debris";

function registerKeys(game: GameState) {

    let leftKey = false, rightKey = false;

    [false, true].forEach((keyDown: boolean) => {

        document.addEventListener(keyDown ? "keydown" : "keyup", ev => {

            if (ev.repeat) {
                return;
            }

            switch (ev.keyCode) {
                case 90: 
                    leftKey = keyDown;
                    break;
                case 88: 
                    rightKey = keyDown;
                    break;
            }

            game.velocity = leftKey ? -1 : rightKey ? 1 : 0;
        });
    });

    document.addEventListener("keydown", ev => {

        if (ev.repeat) {
            return;
        }

        switch (ev.keyCode) {
            case 77:
                game.bullets.push(new Bullet(game.player, game.height - 60));
                break;
        }
    });
}

const canvas = document.querySelector("canvas")!;
const audio = document.querySelector("audio")!;

const game: GameState = {
    width: 0,
    height: 0,
    elapsed: 0,
    volume: 50,
    player: NaN,
    velocity: 0,
    bullets: [],
    aliens: [],
    debris: []
};

registerKeys(game);

runSprites(game, canvas, ctx => {

    ctx.save();

    ctx.fillStyle = ctx.strokeStyle = "#0F0";
    ctx.lineWidth = 2;

    ctx.clearRect(0, 0, game.width, game.height);

    const margin = 10,
          volumeWidth = 200,
          volumeHeight = 50,
          volumeTop = game.height - (margin + volumeHeight),
          volumePosition = (game.volume / 100) * volumeWidth;

    ctx.globalAlpha = 0.5;
    ctx.fillRect(margin, volumeTop, volumePosition, volumeHeight);

    ctx.globalAlpha = 1;
    ctx.strokeRect(margin, volumeTop, volumeWidth, volumeHeight);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "18pt Helvetica";
    ctx.fillText("" + game.volume, 
        margin + (volumeWidth / 2), 
        volumeTop + (volumeHeight / 2));

    if (isNaN(game.player)) {
        game.player = game.width / 2;
    }

    const playerSize = 20, playerY = volumeTop - margin;

    game.player = Math.max(playerSize, Math.min(game.width - playerSize, 
        game.player + (game.velocity * game.elapsed / 2)));
    
    ctx.fillStyle = "white";

    ctx.beginPath();
    ctx.moveTo(game.player - playerSize, playerY);
    ctx.lineTo(game.player, playerY - playerSize);
    ctx.lineTo(game.player + playerSize, playerY);
    ctx.closePath();
    ctx.fill();

    renderSprites(ctx, game.bullets, game);

    const maxAliens = 20,
          alienDeficit = 1 - (game.aliens.length / maxAliens),
          creationRate = Math.max(0, Math.min(1, alienDeficit)) * 0.1;

    if (Math.random() < creationRate) {
        game.aliens.push(new Alien(game));
    }

    renderSprites(ctx, game.aliens, game);

    hitTest(game, game.aliens, game.bullets, (alien, bullet) => {

        game.volume = Math.max(0, Math.min(100,
                        game.volume + (alien.up ? 5 : -5)));
        
        audio.volume = game.volume / 100;

        for (var d = 0; d < 5; d++) {
            game.debris.push(new Debris(alien));
        }

        return true;
    });

    ctx.strokeStyle = "green";

    renderSprites(ctx, game.debris, game);

    ctx.restore();
});
