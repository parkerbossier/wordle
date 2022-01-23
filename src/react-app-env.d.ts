/// <reference types="react-scripts" />

declare namespace Wordle {
	type Status = 'correct' | 'none' | 'notPresent' | 'present';

	interface TileState {
		letter: string;
		status: Status;
	}
}
