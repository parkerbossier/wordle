import React, { useState } from 'react';
import './reset.css';
import styles from './Row.module.scss';
import { Tile } from './Tile';

interface IProps {
	editing?: boolean;
	tiles: Wordle.TileState[];
}

export const Row: React.FC<IProps> = ({ editing, tiles }) => {
	return (
		<div className={styles.root}>
			{tiles.map((t, i) => {
				return (
					<Tile
						key={i}
						letter={t.letter}
						status={t.status}
					/>
				);
			})}
		</div>
	);
}
