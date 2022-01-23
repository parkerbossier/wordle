// function main() {
// 	console.log(words.filter(w => w[0] === 'e'));

// 	const stats = words.map(getWordStats);
// 	const sortedByEntropy = _.sortBy(stats, e => e.entropy).reverse();
// 	const sortedByVowels = _.sortBy(sortedByEntropy, e => e.vowels).reverse();
// 	console.log(sortedByVowels);
// }

// function getWordStats(word: string) {
// 	const letters = _.uniq(word);
// 	return {
// 		entropy: letters.length,
// 		vowels: letters.filter(l => ['a', 'e', 'i', 'o', 'u'].includes(l)).length,
// 		word
// 	};
// }


// main();

export {};
