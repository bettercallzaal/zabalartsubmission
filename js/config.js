// Configuration and Environment Variables
// This file manages all configuration and secrets

class Config {
    constructor() {
        // Check if we're in development or production
        this.isDevelopment = window.location.hostname === 'localhost' || 
                            window.location.hostname === '127.0.0.1';
        
        // Load configuration
        this.loadConfig();
    }

    loadConfig() {
        // Supabase Configuration
        // In production, these should come from Vercel environment variables
        // For now, using the anon key is safe as it has RLS policies
        this.SUPABASE_URL = this.getEnvVar('SUPABASE_URL', 'https://vfdwmvkjbxsqcwykyybt.supabase.co');
        this.SUPABASE_ANON_KEY = this.getEnvVar('SUPABASE_ANON_KEY', 'sb_publishable_FWOea9rLUfAWTrdN-c1nrg_AIGbWhCF');
        
        // Neynar Configuration
        // API key is now handled server-side via /api/neynar proxy
        // No client-side key needed
        
        // App URLs
        this.MINIAPP_URL = 'https://zabal.art';
        this.SONGJAM_URL = 'https://www.songjam.space/zabal';
        
        // Feature Flags
        this.ENABLE_ANALYTICS = true;
        this.ENABLE_NOTIFICATIONS = true;
        this.ENABLE_OFFLINE_MODE = true;
        
        // Rate Limiting
        this.VOTE_COOLDOWN_MS = 1000; // 1 second between votes
        this.API_RETRY_ATTEMPTS = 3;
        this.API_RETRY_DELAY_MS = 1000;
    }

    getEnvVar(key, defaultValue) {
        // In a real production setup, this would read from process.env
        // For client-side, we'll use a different approach
        // TODO: Move sensitive keys to serverless functions
        return defaultValue;
    }

    // Validate configuration on load
    validate() {
        const required = [
            'SUPABASE_URL',
            'SUPABASE_ANON_KEY',
            'MINIAPP_URL'
        ];

        const missing = required.filter(key => !this[key]);
        
        if (missing.length > 0) {
            console.error('❌ Missing required configuration:', missing);
            throw new Error(`Missing required configuration: ${missing.join(', ')}`);
        }

        console.log('✅ Configuration validated');
        return true;
    }
}

// Export singleton instance
window.appConfig = new Config();
window.appConfig.validate();
