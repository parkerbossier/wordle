/// <reference types="react-scripts" />

declare namespace Wordle {
	type GameState = Wordle.TileState[][];
	
	type TileStatus = 'absent' | 'correct' | 'none' | 'present';

	interface TileState {
		letter: string;
		status: TileStatus;
	}
}
