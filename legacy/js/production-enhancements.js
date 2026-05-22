// Production-Ready Enhancements for ZABAL Live Hub
// Includes: Error handling, retry logic, analytics, data persistence, keyboard shortcuts

// ============================================
// 1. ERROR HANDLING & RETRY LOGIC
// ============================================

class APIRetryHandler {
    constructor(maxRetries = 3, baseDelay = 1000) {
        this.maxRetries = maxRetries;
        this.baseDelay = baseDelay;
    }

    async fetchWithRetry(url, options = {}, retryCount = 0) {
        try {
            const response = await fetch(url, options);
            
            if (!response.ok && retryCount < this.maxRetries) {
                const delay = this.baseDelay * Math.pow(2, retryCount);
                console.log(`⚠️ Request failed, retrying in ${delay}ms... (${retryCount + 1}/${this.maxRetries})`);
                await this.sleep(delay);
                return this.fetchWithRetry(url, options, retryCount + 1);
            }
            
            return response;
        } catch (error) {
            if (retryCount < this.maxRetries) {
                const delay = this.baseDelay * Math.pow(2, retryCount);
                console.log(`⚠️ Network error, retrying in ${delay}ms... (${retryCount + 1}/${this.maxRetries})`);
                await this.sleep(delay);
                return this.fetchWithRetry(url, options, retryCount + 1);
            }
            throw error;
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

window.apiRetryHandler = new APIRetryHandler();

// Offline detection
window.isOnline = navigator.onLine;
window.addEventListener('online', () => {
    window.isOnline = true;
    console.log('✅ Back online');
    if (window.showToast) {
        window.showToast('success', 'Back Online', 'Connection restored!');
    }
});

window.addEventListener('offline', () => {
    window.isOnline = false;
    console.log('⚠️ Offline');
    if (window.showToast) {
        window.showToast('warning', 'Offline', 'No internet connection');
    }
});

// ============================================
// 2. LOADING STATES
// ============================================

class LoadingManager {
    constructor() {
        this.activeLoaders = new Set();
    }

    show(id, message = 'Loading...') {
        this.activeLoaders.add(id);
        const loader = document.createElement('div');
        loader.id = `loader-${id}`;
        loader.className = 'loading-overlay';
        loader.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <div class="loading-message">${message}</div>
            </div>
        `;
        document.body.appendChild(loader);
    }

    hide(id) {
        this.activeLoaders.delete(id);
        const loader = document.getElementById(`loader-${id}`);
        if (loader) {
            loader.remove();
        }
    }

    hideAll() {
        this.activeLoaders.forEach(id => this.hide(id));
    }
}

window.loadingManager = new LoadingManager();

// ============================================
// 3. DATA PERSISTENCE (LocalStorage)
// ============================================

class DataPersistence {
    constructor() {
        this.prefix = 'zabal_';
    }

    save(key, value) {
        try {
            localStorage.setItem(this.prefix + key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
            return false;
        }
    }

    load(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(this.prefix + key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Failed to load from localStorage:', error);
            return defaultValue;
        }
    }

    remove(key) {
        try {
            localStorage.removeItem(this.prefix + key);
            return true;
        } catch (error) {
            console.error('Failed to remove from localStorage:', error);
            return false;
        }
    }

    clear() {
        try {
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.error('Failed to clear localStorage:', error);
            return false;
        }
    }

    // Save vote history
    saveVoteHistory(mode) {
        const history = this.load('vote_history', []);
        history.push({
            mode,
            timestamp: Date.now(),
            date: new Date().toISOString()
        });
        // Keep last 100 votes
        if (history.length > 100) {
            history.shift();
        }
        this.save('vote_history', history);
    }

    // Get voting streak
    getVotingStreak() {
        const history = this.load('vote_history', []);
        if (history.length === 0) return 0;

        let streak = 1;
        const today = new Date().setHours(0, 0, 0, 0);
        const yesterday = today - 86400000;

        // Check if voted today
        const lastVote = new Date(history[history.length - 1].timestamp).setHours(0, 0, 0, 0);
        if (lastVote !== today && lastVote !== yesterday) {
            return 0;
        }

        // Count consecutive days
        for (let i = history.length - 2; i >= 0; i--) {
            const voteDate = new Date(history[i].timestamp).setHours(0, 0, 0, 0);
            const expectedDate = today - (streak * 86400000);
            if (voteDate === expectedDate) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    }

    // Save selected friends
    saveSelectedFriends(friends) {
        this.save('selected_friends', friends);
    }

    loadSelectedFriends() {
        return this.load('selected_friends', []);
    }
}

window.dataPersistence = new DataPersistence();

// ============================================
// 4. ANALYTICS TRACKING
// ============================================

class Analytics {
    constructor() {
        this.events = [];
        this.sessionStart = Date.now();
        this.sessionId = this.generateSessionId();
    }

    generateSessionId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    track(eventName, properties = {}) {
        const event = {
            name: eventName,
            properties,
            timestamp: Date.now(),
            sessionId: this.sessionId,
            sessionDuration: Date.now() - this.sessionStart
        };

        this.events.push(event);
        console.log('📊 Analytics:', eventName, properties);

        // Save to localStorage
        this.saveEvents();

        // Send to analytics service (if configured)
        this.sendToService(event);
    }

    saveEvents() {
        const saved = window.dataPersistence.load('analytics_events', []);
        saved.push(...this.events);
        // Keep last 1000 events
        if (saved.length > 1000) {
            saved.splice(0, saved.length - 1000);
        }
        window.dataPersistence.save('analytics_events', saved);
        this.events = [];
    }

    sendToService(event) {
        // Placeholder for analytics service integration
        // Could integrate with Google Analytics, Mixpanel, etc.
        // Example: gtag('event', event.name, event.properties);
    }

    // Common tracking methods
    trackPageView(page) {
        this.track('page_view', { page });
    }

    trackVote(mode) {
        this.track('vote_submitted', { mode });
    }

    trackShare(modes, platform = 'farcaster') {
        this.track('share', { modes, platform });
    }

    trackError(error, context = {}) {
        this.track('error', {
            message: error.message,
            stack: error.stack,
            ...context
        });
    }

    trackUserAction(action, details = {}) {
        this.track('user_action', { action, ...details });
    }
}

window.analytics = new Analytics();

// ============================================
// 5. KEYBOARD SHORTCUTS
// ============================================

class KeyboardShortcuts {
    constructor() {
        this.shortcuts = new Map();
        this.enabled = true;
        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => {
            if (!this.enabled) return;
            
            // Don't trigger if user is typing in input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            const key = e.key.toLowerCase();
            const handler = this.shortcuts.get(key);
            
            if (handler) {
                e.preventDefault();
                handler(e);
            }
        });
    }

    register(key, handler, description) {
        this.shortcuts.set(key.toLowerCase(), handler);
        console.log(`⌨️ Registered shortcut: ${key} - ${description}`);
    }

    unregister(key) {
        this.shortcuts.delete(key.toLowerCase());
    }

    disable() {
        this.enabled = false;
    }

    enable() {
        this.enabled = true;
    }

    showHelp() {
        const shortcuts = [
            { key: 'V', action: 'Open voting' },
            { key: 'S', action: 'Share vote' },
            { key: 'Esc', action: 'Close modal' },
            { key: '?', action: 'Show this help' }
        ];

        const helpText = shortcuts.map(s => `${s.key}: ${s.action}`).join('\n');
        
        if (window.showToast) {
            window.showToast('info', 'Keyboard Shortcuts', helpText);
        } else {
            alert('Keyboard Shortcuts:\n\n' + helpText);
        }
    }
}

window.keyboardShortcuts = new KeyboardShortcuts();

// Register default shortcuts
window.keyboardShortcuts.register('v', () => {
    console.log('⌨️ V pressed - focusing on vote section');
    const voteSection = document.getElementById('votingSection');
    if (voteSection) {
        voteSection.scrollIntoView({ behavior: 'smooth' });
        window.analytics.trackUserAction('keyboard_shortcut', { key: 'v' });
    }
}, 'Focus on voting');

window.keyboardShortcuts.register('s', () => {
    console.log('⌨️ S pressed - opening share modal');
    if (window.currentShareMode && window.openShareModal) {
        window.openShareModal([window.currentShareMode]);
        window.analytics.trackUserAction('keyboard_shortcut', { key: 's' });
    }
}, 'Open share modal');

window.keyboardShortcuts.register('escape', () => {
    console.log('⌨️ Escape pressed - closing modals');
    if (window.closeShareModal) window.closeShareModal();
    if (window.closeLiveShareModal) window.closeLiveShareModal();
    window.analytics.trackUserAction('keyboard_shortcut', { key: 'escape' });
}, 'Close modals');

window.keyboardShortcuts.register('?', () => {
    window.keyboardShortcuts.showHelp();
}, 'Show keyboard shortcuts help');

// ============================================
// 6. VOTE CONFIRMATION ANIMATION
// ============================================

function showVoteConfirmation(mode) {
    const modeEmojis = {
        studio: '🎬',
        market: '🛒',
        social: '🌐',
        battle: '⚔️'
    };

    const confirmation = document.createElement('div');
    confirmation.className = 'vote-confirmation';
    confirmation.innerHTML = `
        <div class="vote-confirmation-content">
            <div class="vote-confirmation-emoji">${modeEmojis[mode]}</div>
            <div class="vote-confirmation-text">Vote Recorded!</div>
        </div>
    `;
    
    document.body.appendChild(confirmation);
    
    // Animate in
    setTimeout(() => confirmation.classList.add('show'), 10);
    
    // Remove after animation
    setTimeout(() => {
        confirmation.classList.remove('show');
        setTimeout(() => confirmation.remove(), 300);
    }, 2000);
}

window.showVoteConfirmation = showVoteConfirmation;

// ============================================
// 7. INITIALIZE ON LOAD
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Production enhancements loaded');
    
    // Track page view
    window.analytics.trackPageView('home');
    
    // Load saved data
    const savedFriends = window.dataPersistence.loadSelectedFriends();
    if (savedFriends.length > 0) {
        console.log('📦 Loaded saved friends:', savedFriends);
    }
    
    // Show voting streak if exists
    const streak = window.dataPersistence.getVotingStreak();
    if (streak > 0) {
        console.log('🔥 Voting streak:', streak, 'days');
        setTimeout(() => {
            if (window.showToast) {
                window.showToast('success', `${streak} Day Streak! 🔥`, 'Keep voting daily!');
            }
        }, 2000);
    }
});

// Export for use in main app
window.productionEnhancements = {
    apiRetryHandler: window.apiRetryHandler,
    loadingManager: window.loadingManager,
    dataPersistence: window.dataPersistence,
    analytics: window.analytics,
    keyboardShortcuts: window.keyboardShortcuts,
    showVoteConfirmation: window.showVoteConfirmation
};
