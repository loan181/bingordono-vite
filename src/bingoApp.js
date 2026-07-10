import Alpine from 'alpinejs';

const lists = import.meta.glob('./wordlist/*.json', { eager: true });

Alpine.data('bingoApp', () => ({
    grid_size: 3,
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
        const total_cell = this.grid_size*this.grid_size
        const real_cell = total_cell - 1 // 1 free cell in the center
        if (this.wordsPool.length < real_cell) {
            alert(`You need at least ${real_cell} words!`);
            return;
        }

        this.grids = [];
        for (let i = 0; i < count; i++) {
            let shuffled = [...this.wordsPool];
            for (let j = shuffled.length - 1; j > 0; j--) {
                const k = Math.floor(Math.random() * (j + 1));
                [shuffled[j], shuffled[k]] = [shuffled[k], shuffled[j]];
            }

            let cardWords = shuffled.slice(0, real_cell);
            cardWords.splice(real_cell/2, 0, "🔥 FREE SPACE 🔥");

            this.grids.push(cardWords);
        }
    }
}));

// Start Alpine automatically
Alpine.start();