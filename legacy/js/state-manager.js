// Centralized State Management
// Manages application state with validation and change tracking

class StateManager {
    constructor() {
        this.state = {
            // Authentication
            auth: {
                isAuthenticated: false,
                userFID: null,
                username: null,
                displayName: null,
                pfpUrl: null,
                bio: null
            },
            
            // Stream state
            stream: {
                currentState: 'deciding', // deciding, locked, live
                lockTime: null,
                isLive: false
            },
            
            // Votes
            votes: {
                studio: 0,
                market: 0,
                social: 0,
                battle: 0
            },
            
            // User selections
            selections: {
                selectedModes: [],
                selectedFriends: []
            },
            
            // Friends data
            friends: {
                bestFriends: [],
                topFriend: null,
                displayCount: 10
            },
            
            // UI state
            ui: {
                isOnline: navigator.onLine,
                activeModal: null,
                isLoading: false
            },
            
            // Vote history
            history: {
                userVotes: [],
                lastVoteDate: null
            }
        };
        
        this.listeners = new Map();
        this.changeLog = [];
        
        console.log('✅ StateManager initialized');
    }

    // Get state value by path (e.g., 'auth.userFID')
    get(path) {
        const keys = path.split('.');
        let value = this.state;
        
        for (const key of keys) {
            if (value === undefined || value === null) {
                return undefined;
            }
            value = value[key];
        }
        
        return value;
    }

    // Set state value by path with validation
    set(path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        let target = this.state;
        
        // Navigate to parent object
        for (const key of keys) {
            if (!(key in target)) {
                target[key] = {};
            }
            target = target[key];
        }
        
        // Store old value for change detection
        const oldValue = target[lastKey];
        
        // Validate based on path
        const validated = this.validate(path, value);
        
        // Set new value
        target[lastKey] = validated;
        
        // Log change
        this.logChange(path, oldValue, validated);
        
        // Notify listeners
        this.notify(path, validated, oldValue);
        
        return validated;
    }

    // Validate state changes
    validate(path, value) {
        // Add validation rules based on path
        switch (path) {
            case 'auth.userFID':
                if (value !== null) {
                    return window.Validator?.validateFID(value) || value;
                }
                return value;
                
            case 'selections.selectedModes':
                if (Array.isArray(value) && value.length > 0) {
                    return window.Validator?.validateModes(value) || value;
                }
                return value;
                
            case 'selections.selectedFriends':
                if (Array.isArray(value) && value.length > 0) {
                    return window.Validator?.validateUsernames(value) || value;
                }
                return value;
                
            case 'stream.currentState':
                const validStates = ['deciding', 'locked', 'live'];
                if (!validStates.includes(value)) {
                    throw new Error(`Invalid stream state: ${value}`);
                }
                return value;
                
            default:
                return value;
        }
    }

    // Subscribe to state changes
    subscribe(path, callback) {
        if (!this.listeners.has(path)) {
            this.listeners.set(path, []);
        }
        
        this.listeners.get(path).push(callback);
        
        // Return unsubscribe function
        return () => {
            const callbacks = this.listeners.get(path);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        };
    }

    // Notify listeners of changes
    notify(path, newValue, oldValue) {
        // Notify exact path listeners
        if (this.listeners.has(path)) {
            this.listeners.get(path).forEach(callback => {
                try {
                    callback(newValue, oldValue);
                } catch (error) {
                    console.error('Error in state listener:', error);
                }
            });
        }
        
        // Notify wildcard listeners (e.g., 'auth.*')
        const pathParts = path.split('.');
        for (let i = 1; i <= pathParts.length; i++) {
            const wildcardPath = pathParts.slice(0, i).join('.') + '.*';
            if (this.listeners.has(wildcardPath)) {
                this.listeners.get(wildcardPath).forEach(callback => {
                    try {
                        callback(newValue, oldValue, path);
                    } catch (error) {
                        console.error('Error in wildcard listener:', error);
                    }
                });
            }
        }
    }

    // Log state changes
    logChange(path, oldValue, newValue) {
        const change = {
            timestamp: Date.now(),
            path,
            oldValue,
            newValue
        };
        
        this.changeLog.push(change);
        
        // Keep only last 100 changes
        if (this.changeLog.length > 100) {
            this.changeLog.shift();
        }
        
        console.log(`📝 State changed: ${path}`, { oldValue, newValue });
    }

    // Get entire state (for debugging)
    getState() {
        return JSON.parse(JSON.stringify(this.state));
    }

    // Get change log
    getChangeLog() {
        return [...this.changeLog];
    }

    // Reset state to initial values
    reset() {
        const oldState = this.getState();
        
        this.state = {
            auth: { isAuthenticated: false, userFID: null, username: null, displayName: null, pfpUrl: null, bio: null },
            stream: { currentState: 'deciding', lockTime: null, isLive: false },
            votes: { studio: 0, market: 0, social: 0, battle: 0 },
            selections: { selectedModes: [], selectedFriends: [] },
            friends: { bestFriends: [], topFriend: null, displayCount: 10 },
            ui: { isOnline: navigator.onLine, activeModal: null, isLoading: false },
            history: { userVotes: [], lastVoteDate: null }
        };
        
        console.log('🔄 State reset');
        this.notify('*', this.state, oldState);
    }

    // Batch updates (prevents multiple notifications)
    batch(updates) {
        const changes = [];
        
        // Disable notifications temporarily
        const originalNotify = this.notify;
        this.notify = () => {};
        
        // Apply all updates
        for (const [path, value] of Object.entries(updates)) {
            const oldValue = this.get(path);
            this.set(path, value);
            changes.push({ path, oldValue, newValue: value });
        }
        
        // Re-enable notifications
        this.notify = originalNotify;
        
        // Send single batch notification
        changes.forEach(({ path, oldValue, newValue }) => {
            this.notify(path, newValue, oldValue);
        });
        
        console.log('📦 Batch update complete:', changes.length, 'changes');
    }
}

// Export singleton
window.stateManager = new StateManager();

// Helper functions for common state operations
window.getState = (path) => window.stateManager.get(path);
window.setState = (path, value) => window.stateManager.set(path, value);
window.subscribeToState = (path, callback) => window.stateManager.subscribe(path, callback);
