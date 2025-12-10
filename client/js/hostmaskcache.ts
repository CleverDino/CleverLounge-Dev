// Global hostmask cache with localStorage persistence
const CACHE_KEY = 'lounge-mam-hostmask-cache';

// Load from localStorage on startup
const loadCache = (): Map<string, string> => {
	try {
		const saved = localStorage.getItem(CACHE_KEY);
		if (saved) {
			const entries = JSON.parse(saved);
			console.log('📦 Loaded', entries.length, 'cached hostmasks from localStorage');
			return new Map(entries);
		}
	} catch (e) {
		console.error('Failed to load hostmask cache:', e);
	}
	return new Map<string, string>();
};

// Save to localStorage
const saveCache = (cache: Map<string, string>) => {
	try {
		const entries = Array.from(cache.entries());
		localStorage.setItem(CACHE_KEY, JSON.stringify(entries));
	} catch (e) {
		console.error('Failed to save hostmask cache:', e);
	}
};

// Initialize cache from localStorage
export const hostmaskCache = loadCache();

// Save cache whenever it's updated (debounced)
let saveTimeout: number | null = null;
export const updateCache = (nick: string, hostmask: string) => {
	hostmaskCache.set(nick.toLowerCase(), hostmask);
	
	// Debounce saves to avoid hammering localStorage
	if (saveTimeout) {
		clearTimeout(saveTimeout);
	}
	saveTimeout = window.setTimeout(() => {
		saveCache(hostmaskCache);
		console.log('💾 Saved cache to localStorage');
	}, 1000);
};
