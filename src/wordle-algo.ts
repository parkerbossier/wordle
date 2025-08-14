import _ from 'lodash';
import { officialWords } from './offical-words';

/**
 * A generator implementation of a Wordle solving algorithm.
 * 
 * To start, we sort all possible 5 letter words by decreasing entropy and vowel count.
 * The first guess is always the same.
 * Subsequent guesses are the first remaining word that isn't excluded by the latest input.
 * 
 * The generator is done when it returns the final word.
 */
export function* wordleAlgo(): Generator<string, string, Wordle.GameState> {
	// initialize the options
	let optionsWithStats = officialWords.map(w => {
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

	/** The game state, passed by the caller with every iteration */
	let gameState: Wordle.GameState = [];

	while (true) {
		// do option filtering if we have a game state to reference
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

		const guess = options[0];

		// done
		if (options.length === 1)
			return guess;

		// not yet done
		else
			gameState = yield guess;
	}
}
