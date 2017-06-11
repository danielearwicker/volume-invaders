import { Bullet } from "./bullet";
import { Alien } from "./alien";
import { Debris } from "./debris";

export function withinBounds(x: number, y: number, game: GameState) {
    return x < game.width && x > 0 && y < game.height && y > 0;
}

export interface GameState {    
    width: number;
    height: number;
    elapsed: number;

    volume: number;
    
    player: number; 
    velocity: number;

    bullets: Bullet[];
    aliens: Alien[];
    debris: Debris[];
}
