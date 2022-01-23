import React from 'react';
import './reset.css';
import styles from './Tile.module.scss';
import c from 'classnames';

interface IProps {
	letter: string;
	onClick?: () => void;
	status: Wordle.TileStatus;
}

export const Tile: React.FC<IProps> = ({ letter, onClick, status }) => {
	return (
		<button
			className={c(styles.root, styles[`root__${status}`])}
			disabled={!onClick}
			onClick={onClick}
		>
			{letter}
		</button>
	);
}
