import Alpine from 'alpinejs';

const lists = import.meta.glob('./wordlist/*.json', { eager: true });

Alpine.data('bingoApp', () => ({
    wordsPool: [],
    grids: [],
    selectedCategory: '',

    loadCategory(category) {
        this.selectedCategory = category;
        const path = `./wordlist/${category}.json`;

        if (lists[path]) {
            this.wordsPool = lists[path].default;
        } else {
            console.error("List not found:", path);
        }
    },

    generateGrids(count) {
        if (this.wordsPool.length < 24) {
            alert("You need at least 24 words!");
            return;
        }

        this.grids = [];
        for (let i = 0; i < count; i++) {
            let shuffled = [...this.wordsPool];
            for (let j = shuffled.length - 1; j > 0; j--) {
                const k = Math.floor(Math.random() * (j + 1));
                [shuffled[j], shuffled[k]] = [shuffled[k], shuffled[j]];
            }

            let cardWords = shuffled.slice(0, 24);
            cardWords.splice(12, 0, "🔥 FREE SPACE 🔥");

            this.grids.push(cardWords);
        }
    }
}));

// Start Alpine automatically
Alpine.start();