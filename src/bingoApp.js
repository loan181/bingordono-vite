import Alpine from 'alpinejs';

const lists = import.meta.glob('./wordlist/*.json', { eager: true });
const verses = import.meta.glob('./verse/*.json', { eager: true });

Alpine.data('bingoApp', () => ({
    grid_size: 4,
    wordsPools: {},
    versePool: [],
    grids: [],

    init() {
        const versePath = './verse/verse.json';
        if (verses[versePath]) {
            this.versePool = verses[versePath].default;
        } else {
            console.error("Verse file not found:", versePath);
        }

        for (const path in lists) {
            const category = path.split('/').pop().replace('.json', '');
            this.wordsPools[category] = lists[path].default;
        }
    },

    generateGrids(count) {
        this.grids = [];
        for (let i = 0; i < count; i++) {
            let cardWords = [];
            const category_occurence = {
                'words_compendium': 3,
                'words_gordonno': 3,
                'words_religion': 2,
                'words_generic_larp': 2,
                'words_music': 2
            }
            let sum = 0;
            for (const category in category_occurence) {
                this.addWords(cardWords, category, category_occurence[category]);
                sum += category_occurence[category];
            }
            if (sum !== 12) {
                console.warn("The occurence of categories does not match the number of bingo cells");
            }
            
            // Hardcoded positions/counts

            let randomVerse = this.versePool[Math.floor(Math.random() * this.versePool.length)];

            this.grids.push({
                words: cardWords.sort(() => 0.5 - Math.random()), // Shuffle the final word list
                verse: randomVerse
            });
        }
    },

    addWords(cardWords, category, count) {
        const pool = this.wordsPools[category];
        if (pool && pool.length > 0) {
            let shuffled = [...pool].sort(() => 0.5 - Math.random());
            for (let i = 0; i < count; i++) {
                if (shuffled.length > 0) {
                    cardWords.push(shuffled.pop());
                }
            }
        }
    },

    getGridArea(index) {
        const positions = [
            '1 / 1', '1 / 2', '1 / 3', '1 / 4',
            '2 / 1', '2 / 4',
            '3 / 1', '3 / 4',
            '4 / 1', '4 / 2', '4 / 3', '4 / 4',
        ];
        return `grid-area: ${positions[index]};`;
    }
}));

// Start Alpine automatically
Alpine.start();