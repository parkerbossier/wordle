import c from 'classnames';
import _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import styles from './App.module.scss';
import { Tile } from './Tile';
import { wordleAlgo } from './wordle-algo';

const App: React.FC = () => {
	const algoIterator = useMemo(() => wordleAlgo(), []);
	const [gameState, setGameState] = useState<Wordle.GameState>(() => ([
		algoIterator.next([]).value.split('').map(l => ({
			letter: l,
			status: 'none'
		}))
	]));

	const [done, setDone] = useState(false);

	/** Assumes one row already exists */
	function generateNextRow() {
		const newState = _.cloneDeep(gameState);

		// default all untouched tiles to absent
		newState[newState.length - 1].forEach(t => {
			if (t.status === 'none')
				t.status = 'absent';
		});

		const nextResult = algoIterator.next(newState);
		const guess = nextResult.value;
		if (!guess) {
			alert('Oh no! No words found. Try again?');
			window.location.reload();
		}

		const lastRow = newState[newState.length - 1];
		const newRow = guess.split('').map((l, i) => {
			const alreadyCorrect = lastRow[i].status === 'correct';
			const tile: Wordle.TileState = {
				letter: l,
				status: (alreadyCorrect || nextResult.done) ? 'correct' : 'none'
			};
			return tile;
		});

		newState.push(newRow);
		setGameState(newState);

		if (nextResult.done)
			setDone(true);
	}

	// this is why we can't have nice things
	useEffect(
		() => {
			function fix100vh() {
				document.body.style.setProperty('--real100vh', `${window.innerHeight}px`);
			}
			fix100vh();
			window.addEventListener('resize', fix100vh);
			return () => {
				window.removeEventListener('resize', fix100vh);
			};
		},
		[]
	);

	return (
		<div className={styles.root}>
			<header>
				<h1 className={styles.h1}>Wordle Solver</h1>

				<a
					href="https://www.powerlanguage.co.uk/wordle/"
					rel="noreferrer"
					target="_blank"
				>
					(open Wordle)
				</a>
			</header>

			<main className={styles.gridWrapper}>
				<div className={styles.grid}>
					{gameState.slice(0, -1).map(row => {
						return row.map((t, i) => (
							<Tile
								key={i}
								letter={t.letter}
								status={t.status}
							/>
						))
					})}

					<div className={styles.lastRowTitle}>
						{done
							? `That's it!`
							: 'Use the word below, and enter the results.'
						}
					</div>

					{gameState[gameState.length - 1]?.map((t, i) => (
						<Tile
							key={i}
							letter={t.letter}
							onClick={() => {
								const newState = _.cloneDeep(gameState);
								const newStatus = incrementTileStatus(t.status);
								newState[newState.length - 1][i].status = newStatus;
								setGameState(newState);
							}}
							status={t.status}
						/>
					))}

					<button
						className={c(styles.next, done && styles.next__hide)}
						onClick={() => {
							// TODO: sanity checking
							generateNextRow();
						}}
					>
						Next
					</button>
				</div>
			</main>

			<footer className={styles.footer}>
				<a
					href="https://github.com/parkerbossier/wordle"
					rel="noreferrer"
					target="_blank"
				>
					Source @ GitHub
				</a>
				{' | '}
				<a
					href="https://parkerbossier.com"
					rel="noreferrer"
					target="_blank"
				>
					parkerbossier.com
				</a>
			</footer>
		</div>
	);
}

function incrementTileStatus(status: Wordle.TileStatus) {
	const statuses: Wordle.TileStatus[] = ['present', 'correct', 'absent'];
	const index = statuses.indexOf(status);
	const nextIndex = index > -1 ? (index + 1) % statuses.length : 0;
	return statuses[nextIndex];
}

export default App;
