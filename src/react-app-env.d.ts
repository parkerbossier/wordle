/// <reference types="react-scripts" />

declare namespace Wordle {
	type GameState = Wordle.TileState[][];
	
	type Status = 'absent' | 'correct' | 'none' | 'present';

	interface TileState {
		letter: string;
		status: Status;
	}
}
