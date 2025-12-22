// Application Lifecycle Management
// Handles cleanup of intervals, event listeners, and prevents memory leaks

class AppLifecycle {
    constructor() {
        this.intervals = [];
        this.timeouts = [];
        this.listeners = [];
        this.isInitialized = false;
        
        // Setup cleanup on page unload
        window.addEventListener('beforeunload', () => this.cleanup());
        
        console.log('✅ AppLifecycle initialized');
    }

    // Add interval with automatic tracking
    addInterval(fn, delay, name = 'unnamed') {
        const id = setInterval(fn, delay);
        this.intervals.push({ id, name, delay });
        console.log(`⏱️ Interval added: ${name} (${delay}ms)`);
        return id;
    }

    // Add timeout with automatic tracking
    addTimeout(fn, delay, name = 'unnamed') {
        const id = setTimeout(() => {
            fn();
            // Remove from tracking after execution
            this.timeouts = this.timeouts.filter(t => t.id !== id);
        }, delay);
        this.timeouts.push({ id, name, delay });
        console.log(`⏲️ Timeout added: ${name} (${delay}ms)`);
        return id;
    }

    // Add event listener with automatic tracking
    addEventListener(element, event, handler, options = {}) {
        element.addEventListener(event, handler, options);
        this.listeners.push({ element, event, handler, options });
        console.log(`👂 Event listener added: ${event} on ${element.tagName || 'window'}`);
    }

    // Remove specific interval
    removeInterval(id) {
        clearInterval(id);
        this.intervals = this.intervals.filter(i => i.id !== id);
        console.log('⏱️ Interval removed');
    }

    // Remove specific timeout
    removeTimeout(id) {
        clearTimeout(id);
        this.timeouts = this.timeouts.filter(t => t.id !== id);
        console.log('⏲️ Timeout removed');
    }

    // Remove specific event listener
    removeEventListener(element, event, handler) {
        element.removeEventListener(event, handler);
        this.listeners = this.listeners.filter(
            l => !(l.element === element && l.event === event && l.handler === handler)
        );
        console.log('👂 Event listener removed');
    }

    // Cleanup all tracked resources
    cleanup() {
        console.log('🧹 Cleaning up application resources...');

        // Clear all intervals
        this.intervals.forEach(({ id, name }) => {
            clearInterval(id);
            console.log(`⏱️ Cleared interval: ${name}`);
        });
        this.intervals = [];

        // Clear all timeouts
        this.timeouts.forEach(({ id, name }) => {
            clearTimeout(id);
            console.log(`⏲️ Cleared timeout: ${name}`);
        });
        this.timeouts = [];

        // Remove all event listeners
        this.listeners.forEach(({ element, event, handler }) => {
            try {
                element.removeEventListener(event, handler);
                console.log(`👂 Removed listener: ${event}`);
            } catch (error) {
                console.warn('⚠️ Failed to remove listener:', error);
            }
        });
        this.listeners = [];

        console.log('✅ Cleanup complete');
    }

    // Get status of tracked resources
    getStatus() {
        return {
            intervals: this.intervals.length,
            timeouts: this.timeouts.length,
            listeners: this.listeners.length,
            details: {
                intervals: this.intervals.map(i => ({ name: i.name, delay: i.delay })),
                timeouts: this.timeouts.map(t => ({ name: t.name, delay: t.delay })),
                listeners: this.listeners.map(l => ({ 
                    event: l.event, 
                    element: l.element.tagName || 'window' 
                }))
            }
        };
    }

    // Mark app as initialized
    markInitialized() {
        this.isInitialized = true;
        console.log('✅ App marked as initialized');
    }
}

// Export singleton
window.appLifecycle = new AppLifecycle();
