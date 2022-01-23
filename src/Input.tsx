import React, { useState } from 'react';
import './reset.css';
import styles from './Input.module.scss';
import { Tile } from './Tile';
import _ from 'lodash';

interface IProps {
	onClick: (index: number, status: Wordle.Status) => void;
}

const statuses: Wordle.Status[] = ['notPresent', 'present', 'correct'];

export const Input: React.FC<IProps> = ({ onClick }) => {

	return (
		<div className={styles.root}>
			{statuses.map(s => {
				return _.range(0, 5).map(i => {
					if (i !== 0)
						return <div />;
						
					return (
						<Tile
							key={`${i}${s}`}
							letter=""
							onClick={() => {
								onClick(i, s);
							}}
							status={s}
						/>
					);
				});
			})}
		</div>
	);
}
