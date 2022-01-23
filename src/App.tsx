import React, { useEffect, useMemo, useState } from 'react';
import { Tile } from './Tile';
import { wordleAlgo } from './wordle-algo';
import './reset.css';
import styles from './App.module.scss';

const App: React.FC = () => {
	const algoIterator = useMemo(() => wordleAlgo(), []);
	const [data, setData] = useState<Wordle.GameState>([]);

	function generateNextRow() {
		const nextResult = algoIterator.next(data);

		console.log(nextResult)

		if (nextResult.done) {
			console.log('done')
			return;
		}

		const newWord = nextResult.value;
		setData([
			...data,
			newWord.split('').map(l => ({
				letter: l,
				status: 'none'
			}))
		]);
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
						Use the word below, and tap the results.
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

								// console.log(newData, newLastRow, newStatus)

								setData(newData);
							}}
							status={t.status}
						/>
					))}
				</div>

				<button
					className={styles.next}
					disabled={!lastRowIsValid}
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
