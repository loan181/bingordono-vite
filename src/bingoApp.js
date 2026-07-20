import Alpine from 'alpinejs';

const lists = import.meta.glob('./wordlist/*.json', { eager: true });
const verses = import.meta.glob('./verse/*.json', { eager: true });

function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}


Alpine.data('bingoApp', () => ({
    grid_size: 4,
    wordsPools: {},
    versePool: [],
    grids: [],
    gridCount: 4,

    init() {
        for (const path in verses) {
            const follower = capitalizeFirstLetter(path.split('/').pop().replace('verse_', '').replace('.json', ''));
            this.versePool.push({
                follower,
                verses: verses[path].default
            });
        }

        for (const path in lists) {
            const category = path.split('/').pop().replace('.json', '');
            this.wordsPools[category] = lists[path].default;
        }
    },

    // Fixed category per grid position (indices match getGridArea):
    //   top row    → [✝ religion] [⚔ larp] [⚔ larp] [✝ religion]
    //   side rows  → [📜 compendium] … [📜 compendium]
    //                [🟣 gordonno]  … [🟣 gordonno]
    //   bottom row → [🙏 action] [🎶 music] [🎶 music] [🙏 action]
    positionLayout: [
        'words_religion',     // 0  top-left
        'words_generic_larp', // 1  top-2nd
        'words_generic_larp', // 2  top-3rd
        'words_religion',     // 3  top-right
        'words_compendium',   // 4  mid-left  (row 2)
        'words_compendium',   // 5  mid-right (row 2)
        'words_gordonno',     // 6  mid-left  (row 3)
        'words_gordonno',     // 7  mid-right (row 3)
        'words_action',       // 8  bottom-left  corner
        'words_music',        // 9  bottom-2nd
        'words_music',        // 10 bottom-3rd
        'words_action',       // 11 bottom-right corner
    ],

    generateGrids(count) {
        this.grids = [];
        for (let i = 0; i < count; i++) {
            // Build a shuffled pool per category so no word repeats within a grid
            const pools = {};
            for (const category of new Set(this.positionLayout)) {
                pools[category] = [...this.wordsPools[category] ?? []].sort(() => 0.5 - Math.random());
            }

            const cardWords = this.positionLayout.map(category => {
                return pools[category].pop() ?? '?';
            });

            const randomFollower = this.versePool[Math.floor(Math.random() * this.versePool.length)];
            const verseIndex = Math.floor(Math.random() * randomFollower.verses.length);
            const verseText = randomFollower.verses[verseIndex];
            const chapter = verseIndex + 1;
            const verse = Math.floor(Math.random() * 20) + 1;
            const verseAttribution = `${randomFollower.follower} ${chapter}:${verse}`;

            this.grids.push({
                words: cardWords,
                verse: `"${verseText}" - ${verseAttribution}`
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