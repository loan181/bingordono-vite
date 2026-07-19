import Alpine from 'alpinejs';

const lists = import.meta.glob('./wordlist/*.json', { eager: true });
const verseLists = import.meta.glob('./verse/*.json', { eager: true });

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
    verses: [],
    activeTab: 'all',
    search: '',
    filteredWords: [],
    totalCount: 0,
    verseSearch: '',
    filteredVerses: [],

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
        this.categories.sort((a, b) => a.label.localeCompare(b.label));
        this.totalCount = this.categories.reduce((sum, c) => sum + c.words.length, 0);
        this.updateWords();

        for (const path in verseLists) {
            const follower = path.split('/').pop().replace('.json', '').replace('verse_', '');
            const followerLabel = follower.charAt(0).toUpperCase() + follower.slice(1);
            const lines = verseLists[path].default;
            lines.forEach((text, i) => {
                this.verses.push({
                    text,
                    follower: followerLabel,
                    ref: `Livre de ${followerLabel}, verset ${i + 1}`,
                });
            });
        }
        this.filteredVerses = [...this.verses];
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

    onVerseSearch() {
        const q = this.verseSearch.trim().toLowerCase();
        this.filteredVerses = q
            ? this.verses.filter(v => v.text.toLowerCase().includes(q) || v.ref.toLowerCase().includes(q))
            : [...this.verses];
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
