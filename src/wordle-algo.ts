import _ from 'lodash';
import { words } from './words';

export function* wordleAlgo(): Generator<string, string, Wordle.GameState> {
	let gameState: Wordle.GameState = [];

	let optionsWithStats = words.map(w => {
		const letters = _.uniq(w);
		return {
			entropy: letters.length,
			vowels: letters.filter(l => ['a', 'e', 'i', 'o', 'u'].includes(l)).length,
			word: w
		}
	});
	optionsWithStats.sort((a, b) => {
		return b.entropy - a.entropy;
	});
	optionsWithStats.sort((a, b) => {
		return b.vowels - a.vowels;
	});
	let options = optionsWithStats.map(o => o.word);

	while (true) {
		if (gameState.length > 0) {
			const lastRow = gameState[gameState.length - 1];

			// remove any options that don't match the correct/incorrect letters
			options = options.filter(o => {
				const presentLetters: string[] = [];

				for (let i = 0; i < lastRow.length; i++) {
					// known absent letter present; omit
					if (
						lastRow[i].status === 'absent'
						&& o.includes(lastRow[i].letter)
					)
						return false;

					// known correct letter mismatch; omit
					else if (
						lastRow[i].status === 'correct'
						&& lastRow[i].letter !== o[i]
					)
						return false;

					// known present letter matches the word; omit
					else if (
						lastRow[i].status === 'present'
						&& lastRow[i].letter === o[i]
					)
						return false;

					if (lastRow[i].status === 'correct' || lastRow[i].status === 'present')
						presentLetters.push(lastRow[i].letter);
				}

				// if we have present/correct letters, make sure each is present
				if (presentLetters.length > 0) {
					o.split('').forEach(optionLetter => {
						const i = presentLetters.findIndex(l => l === optionLetter);
						if (i !== -1)
							presentLetters.splice(i, 1);
					});
					if (presentLetters.length > 0)
						return false;
				}

				return true;
			});
		}

		if (options.length === 1)
			return options[0];

		else
			gameState = yield options[0];
	}
}
