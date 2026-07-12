import Alpine from 'alpinejs';

const lists = import.meta.glob('./wordlist/*.json', { eager: true });
const verses = import.meta.glob('./verse/*.json', { eager: true });

Alpine.data('bingoApp', () => ({
    grid_size: 4,
    wordsPool: [],
    versePool: [],
    grids: [],
    selectedCategory: '',

    init() {
        const versePath = './verse/verse.json';
        if (verses[versePath]) {
            this.versePool = verses[versePath].default;
        } else {
            console.error("Verse file not found:", versePath);
        }
    },

    loadCategory(category) {
        this.selectedCategory = category;
        const path = `./wordlist/${category}.json`;
        if (lists[path]) {
            this.wordsPool = lists[path].default;
        } else {
            console.error("Word list not found:", path);
            this.wordsPool = [];
        }
    },

    generateGrids(count) {
        const requiredWords = 12;
        if (this.wordsPool.length < requiredWords) {
            alert(`You need at least ${requiredWords} words!`);
            return;
        }

        this.grids = [];
        for (let i = 0; i < count; i++) {
            let shuffledWords = [...this.wordsPool].sort(() => 0.5 - Math.random());
            let cardWords = shuffledWords.slice(0, requiredWords);
            let randomVerse = this.versePool[Math.floor(Math.random() * this.versePool.length)];

            this.grids.push({
                words: cardWords,
                verse: randomVerse
            });
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