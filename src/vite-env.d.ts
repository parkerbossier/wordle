/// <reference types="react-scripts" />

declare module "*.css";
declare module "*.module.css";
declare module "*.module.scss";

declare module "*.jpg";
declare module "*.png";

declare namespace Wordle {
	type GameState = Wordle.TileState[][];

	type TileStatus = 'absent' | 'correct' | 'none' | 'present';

	interface TileState {
		letter: string;
		status: TileStatus;
	}
}
