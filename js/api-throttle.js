// API Throttling and Rate Limiting
// Prevents excessive API calls and manages request queues

class APIThrottle {
    constructor() {
        this.queues = new Map(); // API endpoint queues
        this.lastCalls = new Map(); // Track last call times
        this.inProgress = new Map(); // Track in-progress requests
        
        // Default rate limits (can be overridden per endpoint)
        this.defaultLimits = {
            minInterval: 1000, // Minimum 1 second between calls
            maxConcurrent: 3,  // Max 3 concurrent requests
            maxRetries: 3,
            retryDelay: 1000
        };
        
        console.log('✅ APIThrottle initialized');
    }

    // Throttle an API call
    async throttle(key, apiFn, options = {}) {
        const limits = { ...this.defaultLimits, ...options };
        
        // Wait for rate limit
        await this.waitForRateLimit(key, limits.minInterval);
        
        // Wait for concurrency limit
        await this.waitForConcurrency(key, limits.maxConcurrent);
        
        // Mark as in progress
        this.markInProgress(key);
        
        try {
            // Execute API call with retry logic
            const result = await this.executeWithRetry(apiFn, limits);
            
            // Update last call time
            this.lastCalls.set(key, Date.now());
            
            return result;
        } finally {
            // Mark as complete
            this.markComplete(key);
        }
    }

    // Wait for rate limit
    async waitForRateLimit(key, minInterval) {
        const lastCall = this.lastCalls.get(key);
        
        if (lastCall) {
            const timeSinceLastCall = Date.now() - lastCall;
            const waitTime = minInterval - timeSinceLastCall;
            
            if (waitTime > 0) {
                console.log(`⏳ Rate limiting ${key}: waiting ${waitTime}ms`);
                await this.sleep(waitTime);
            }
        }
    }

    // Wait for concurrency limit
    async waitForConcurrency(key, maxConcurrent) {
        const inProgress = this.inProgress.get(key) || 0;
        
        if (inProgress >= maxConcurrent) {
            console.log(`⏳ Concurrency limit for ${key}: waiting...`);
            
            // Wait until a slot is available
            await new Promise(resolve => {
                const checkInterval = setInterval(() => {
                    const current = this.inProgress.get(key) || 0;
                    if (current < maxConcurrent) {
                        clearInterval(checkInterval);
                        resolve();
                    }
                }, 100);
            });
        }
    }

    // Mark request as in progress
    markInProgress(key) {
        const current = this.inProgress.get(key) || 0;
        this.inProgress.set(key, current + 1);
    }

    // Mark request as complete
    markComplete(key) {
        const current = this.inProgress.get(key) || 0;
        this.inProgress.set(key, Math.max(0, current - 1));
    }

    // Execute with retry logic
    async executeWithRetry(apiFn, limits) {
        let lastError;
        
        for (let attempt = 0; attempt < limits.maxRetries; attempt++) {
            try {
                return await apiFn();
            } catch (error) {
                lastError = error;
                
                console.warn(`⚠️ API call attempt ${attempt + 1} failed:`, error.message);
                
                // Don't retry on certain errors
                if (this.shouldNotRetry(error)) {
                    throw error;
                }
                
                // Wait before retrying (exponential backoff)
                if (attempt < limits.maxRetries - 1) {
                    const delay = limits.retryDelay * Math.pow(2, attempt);
                    console.log(`⏳ Retrying in ${delay}ms...`);
                    await this.sleep(delay);
                }
            }
        }
        
        throw lastError;
    }

    // Check if error should not be retried
    shouldNotRetry(error) {
        const noRetryStatuses = [400, 401, 403, 404, 422];
        const status = error.response?.status || error.status;
        
        return noRetryStatuses.includes(status);
    }

    // Sleep helper
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Debounce function calls
    debounce(key, fn, delay = 300) {
        // Clear existing timeout
        if (this.queues.has(key)) {
            clearTimeout(this.queues.get(key));
        }
        
        // Set new timeout
        const timeoutId = setTimeout(() => {
            fn();
            this.queues.delete(key);
        }, delay);
        
        this.queues.set(key, timeoutId);
    }

    // Batch multiple requests
    async batch(requests, options = {}) {
        const batchSize = options.batchSize || 5;
        const results = [];
        
        for (let i = 0; i < requests.length; i += batchSize) {
            const batch = requests.slice(i, i + batchSize);
            
            console.log(`📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(requests.length / batchSize)}`);
            
            const batchResults = await Promise.all(
                batch.map(({ key, fn, options }) => 
                    this.throttle(key, fn, options)
                )
            );
            
            results.push(...batchResults);
        }
        
        return results;
    }

    // Get status
    getStatus() {
        return {
            inProgress: Array.from(this.inProgress.entries()),
            lastCalls: Array.from(this.lastCalls.entries()).map(([key, time]) => ({
                key,
                timeSinceLastCall: Date.now() - time
            }))
        };
    }

    // Reset all throttles
    reset() {
        this.queues.clear();
        this.lastCalls.clear();
        this.inProgress.clear();
        console.log('🔄 API throttle reset');
    }
}

// Export singleton
window.apiThrottle = new APIThrottle();

// Helper function
window.throttledAPI = (key, fn, options) => {
    return window.apiThrottle.throttle(key, fn, options);
};
