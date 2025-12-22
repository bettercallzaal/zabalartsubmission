// Database Connection Manager
// Handles Supabase connections with retry logic and error handling

class DatabaseManager {
    constructor() {
        this.client = null;
        this.isConnected = false;
        this.retryAttempts = 0;
        this.maxRetries = 3;
        this.retryDelay = 1000;
        this.connectionTimeout = 10000; // 10 seconds
        
        console.log('✅ DatabaseManager initialized');
    }

    // Initialize Supabase client
    async initialize() {
        if (this.client) {
            console.log('ℹ️ Database already initialized');
            return this.client;
        }

        try {
            if (!window.supabase) {
                throw new Error('Supabase library not loaded');
            }

            if (!window.appConfig) {
                throw new Error('App configuration not loaded');
            }

            this.client = window.supabase.createClient(
                window.appConfig.SUPABASE_URL,
                window.appConfig.SUPABASE_ANON_KEY
            );

            // Test connection
            await this.testConnection();

            this.isConnected = true;
            console.log('✅ Database connected');
            
            return this.client;
        } catch (error) {
            console.error('❌ Database initialization failed:', error);
            window.errorHandler?.handleError(error, { 
                type: 'database_error', 
                context: 'initialization' 
            });
            throw error;
        }
    }

    // Test database connection
    async testConnection() {
        try {
            const { data, error } = await this.client
                .from('votes')
                .select('count')
                .limit(1);

            if (error) throw error;
            
            console.log('✅ Database connection test passed');
            return true;
        } catch (error) {
            console.error('❌ Database connection test failed:', error);
            throw error;
        }
    }

    // Execute query with retry logic
    async query(queryFn, context = {}) {
        if (!this.client) {
            await this.initialize();
        }

        let lastError;
        
        for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
            try {
                // Add timeout to query
                const result = await Promise.race([
                    queryFn(this.client),
                    this.timeout(this.connectionTimeout)
                ]);

                // Reset retry counter on success
                this.retryAttempts = 0;
                
                return result;
            } catch (error) {
                lastError = error;
                
                console.warn(`⚠️ Query attempt ${attempt + 1} failed:`, error.message);
                
                // Don't retry on certain errors
                if (this.shouldNotRetry(error)) {
                    throw error;
                }
                
                // Wait before retrying (exponential backoff)
                if (attempt < this.maxRetries) {
                    const delay = this.retryDelay * Math.pow(2, attempt);
                    console.log(`⏳ Retrying in ${delay}ms...`);
                    await this.sleep(delay);
                }
            }
        }

        // All retries failed
        console.error('❌ All query attempts failed');
        window.errorHandler?.handleError(lastError, {
            type: 'database_error',
            context: 'query',
            ...context
        });
        
        throw lastError;
    }

    // Check if error should not be retried
    shouldNotRetry(error) {
        const noRetryErrors = [
            'Invalid API key',
            'Permission denied',
            'Row level security',
            'Unique constraint',
            'Foreign key constraint'
        ];

        return noRetryErrors.some(msg => 
            error.message?.includes(msg) || error.hint?.includes(msg)
        );
    }

    // Timeout helper
    timeout(ms) {
        return new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Query timeout')), ms);
        });
    }

    // Sleep helper
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Get client (with auto-initialization)
    async getClient() {
        if (!this.client) {
            await this.initialize();
        }
        return this.client;
    }

    // Check connection status
    isHealthy() {
        return this.isConnected && this.client !== null;
    }

    // Disconnect (cleanup)
    disconnect() {
        this.client = null;
        this.isConnected = false;
        console.log('🔌 Database disconnected');
    }
}

// Export singleton
window.databaseManager = new DatabaseManager();

// Helper function for queries
window.dbQuery = async (queryFn, context) => {
    return await window.databaseManager.query(queryFn, context);
};
