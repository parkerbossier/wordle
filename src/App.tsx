import c from 'classnames';
import React, { useEffect, useMemo, useState } from 'react';
import { Tile } from './Tile';
import { wordleAlgo } from './wordle-algo';
import styles from './App.module.scss';
import './reset.css';

const App: React.FC = () => {
	const algoIterator = useMemo(() => wordleAlgo(), []);
	const [data, setData] = useState<Wordle.GameState>([]);
	const [done, setDone] = useState(false);

	function generateNextRow() {
		// TODO: default non-selected options to none

		const nextResult = algoIterator.next(data);
		const guess = nextResult.value;

		const lastRow = data.length > 0 && data[data.length - 1];
		const newRow = guess.split('').map((l, i) => {
			const alreadyCorrect = (lastRow && lastRow[i].status === 'correct');
			const status: Wordle.Status = (alreadyCorrect || nextResult.done)
				? 'correct'
				: 'none';

			return {
				letter: l,
				status
			};
		});

		setData([
			...data,
			newRow
		]);

		if (nextResult.done)
			setDone(true);
	}

	useEffect(
		() => { generateNextRow(); },
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	const lastRowIsValid = data[data.length - 1]?.every(t => t.status !== 'none');

	return (
		<div className={styles.root}>
			<div className={styles.content}>
				<div className={styles.grid}>
					{data.slice(0, -1).map(row => {
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
							: 'Use the word below, and tap the results.'
						}
					</div>

					{data[data.length - 1]?.map((t, i) => (
						<Tile
							key={i}
							letter={t.letter}
							onClick={() => {
								const newData = data.slice(0, -1);
								const newLastRow = [...data[data.length - 1]];
								const newStatus = incrementStatus(t.status);
								newLastRow[i] = { ...newLastRow[i], status: newStatus };
								newData.push(newLastRow);

								setData(newData);
							}}
							status={t.status}
						/>
					))}
				</div>

				<button
					className={c(styles.next, done && styles.next__hide)}
					disabled={!lastRowIsValid || done}
					onClick={() => {
						// TODO: sanity checking
						generateNextRow();
					}}
				>
					Next
				</button>
			</div>
		</div>
	);
}

function incrementStatus(status: Wordle.Status) {
	const statuses: Wordle.Status[] = ['absent', 'present', 'correct'];
	const index = statuses.indexOf(status);
	const nextIndex = index > -1 ? (index + 1) % statuses.length : 0;
	return statuses[nextIndex];
}

export default App;
