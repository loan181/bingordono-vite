function bingoApp() {
    return {
        wordsPool: [],
        grids: [],
        selectedCategory: '',

        // 1. Fetch data from your GitHub Pages static JSON paths
        async loadCategory(category) {
            this.selectedCategory = category;
            try {
                const response = await fetch(`./wordlist/${category}.json`);
                this.wordsPool = await response.json();
            } catch (error) {
                console.error("Failed to load wordlist:", error);
            }
        },

        generateGrids(count) {
            if (this.wordsPool.length < 24) {
                alert("You need at least 24 words in your JSON file!");
                return;
            }

            this.grids = [];
            for (let i = 0; i < count; i++) {
                // 2. Fisher-Yates Shuffle Logic
                let shuffled = [...this.wordsPool];
                for (let j = shuffled.length - 1; j > 0; j--) {
                    const k = Math.floor(Math.random() * (j + 1));
                    [shuffled[j], shuffled[k]] = [shuffled[k], shuffled[j]];
                }

                // 3. Take 24 words and inject the center Free Space
                let cardWords = shuffled.slice(0, 24);
                cardWords.splice(12, 0, "🔥 FREE SPACE 🔥");

                this.grids.push(cardWords);
            }
        }
    }
}