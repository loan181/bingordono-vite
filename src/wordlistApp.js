import Alpine from 'alpinejs';

const lists = import.meta.glob('./wordlist/*.json', { eager: true });

const CATEGORY_LABELS = {
    words_gordonno: '🟣 Gordonno',
    words_religion: '✝ Religion',
    words_compendium: '📜 Compendium',
    words_generic_larp: '⚔ Aventure',
    words_music: '🎶 Musique',
    words_action: '🙏 Actions',
};

Alpine.data('wordlistApp', () => ({
    categories: [],
    activeTab: 'all',
    search: '',
    filteredWords: [],
    totalCount: 0,

    init() {
        for (const path in lists) {
            const key = path.split('/').pop().replace('.json', '');
            const words = lists[path].default;
            this.categories.push({
                key,
                label: CATEGORY_LABELS[key] ?? key,
                words,
            });
        }
        // Sort by label for consistent order
        this.categories.sort((a, b) => a.label.localeCompare(b.label));
        this.totalCount = this.categories.reduce((sum, c) => sum + c.words.length, 0);
        this.updateWords();
    },

    get activeCategory() {
        return this.categories.find(c => c.key === this.activeTab) ?? null;
    },

    setTab(tab) {
        this.activeTab = tab;
        this.search = '';
        this.updateWords();
    },

    onSearch() {
        this.updateWords();
    },

    updateWords() {
        const q = this.search.trim().toLowerCase();
        let pool;

        if (this.activeTab === 'all') {
            pool = this.categories.flatMap(c => c.words);
        } else {
            const cat = this.categories.find(c => c.key === this.activeTab);
            pool = cat ? [...cat.words] : [];
        }

        this.filteredWords = q
            ? pool.filter(w => w.toLowerCase().includes(q))
            : pool;
    },
}));

Alpine.start();
