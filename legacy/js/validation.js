// Input Validation Module
// Validates all user inputs to prevent injection attacks and data corruption

class Validator {
    // Validate Farcaster FID
    static validateFID(fid) {
        if (fid === null || fid === undefined) {
            throw new Error('FID is required');
        }

        const parsed = parseInt(fid);
        
        if (isNaN(parsed)) {
            throw new Error('FID must be a number');
        }

        if (parsed < 0) {
            throw new Error('FID must be positive');
        }

        if (parsed > Number.MAX_SAFE_INTEGER) {
            throw new Error('FID is too large');
        }

        return parsed;
    }

    // Validate voting mode
    static validateMode(mode) {
        const validModes = ['studio', 'market', 'social', 'battle'];
        
        if (!mode) {
            throw new Error('Mode is required');
        }

        if (typeof mode !== 'string') {
            throw new Error('Mode must be a string');
        }

        const normalized = mode.toLowerCase().trim();

        if (!validModes.includes(normalized)) {
            throw new Error(`Invalid mode. Must be one of: ${validModes.join(', ')}`);
        }

        return normalized;
    }

    // Validate multiple modes
    static validateModes(modes) {
        if (!Array.isArray(modes)) {
            throw new Error('Modes must be an array');
        }

        if (modes.length === 0) {
            throw new Error('At least one mode is required');
        }

        if (modes.length > 4) {
            throw new Error('Maximum 4 modes allowed');
        }

        // Validate each mode and check for duplicates
        const validated = modes.map(mode => this.validateMode(mode));
        const unique = [...new Set(validated)];

        if (unique.length !== validated.length) {
            throw new Error('Duplicate modes not allowed');
        }

        return unique;
    }

    // Validate username for friend tagging
    static validateUsername(username) {
        if (!username) {
            throw new Error('Username is required');
        }

        if (typeof username !== 'string') {
            throw new Error('Username must be a string');
        }

        const trimmed = username.trim();

        if (trimmed.length === 0) {
            throw new Error('Username cannot be empty');
        }

        if (trimmed.length > 50) {
            throw new Error('Username too long (max 50 characters)');
        }

        // Basic sanitization - remove @ if present
        const sanitized = trimmed.replace(/^@/, '');

        // Check for invalid characters (allow alphanumeric, underscore, hyphen)
        if (!/^[a-zA-Z0-9_-]+$/.test(sanitized)) {
            throw new Error('Username contains invalid characters');
        }

        return sanitized;
    }

    // Validate array of usernames
    static validateUsernames(usernames) {
        if (!Array.isArray(usernames)) {
            throw new Error('Usernames must be an array');
        }

        if (usernames.length > 10) {
            throw new Error('Maximum 10 friends can be tagged');
        }

        return usernames.map(username => this.validateUsername(username));
    }

    // Validate URL
    static validateURL(url) {
        if (!url) {
            throw new Error('URL is required');
        }

        try {
            const parsed = new URL(url);
            
            // Only allow https
            if (parsed.protocol !== 'https:') {
                throw new Error('Only HTTPS URLs are allowed');
            }

            return parsed.toString();
        } catch (error) {
            throw new Error('Invalid URL format');
        }
    }

    // Validate date string
    static validateDate(dateString) {
        if (!dateString) {
            throw new Error('Date is required');
        }

        const date = new Date(dateString);

        if (isNaN(date.getTime())) {
            throw new Error('Invalid date format');
        }

        return date;
    }

    // Sanitize text input (prevent XSS)
    static sanitizeText(text) {
        if (!text) return '';

        if (typeof text !== 'string') {
            text = String(text);
        }

        // Remove any HTML tags
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Validate vote power
    static validateVotePower(power) {
        const parsed = parseInt(power);

        if (isNaN(parsed)) {
            throw new Error('Vote power must be a number');
        }

        if (parsed < 1 || parsed > 10) {
            throw new Error('Vote power must be between 1 and 10');
        }

        return parsed;
    }

    // Validate pagination parameters
    static validatePagination(limit, offset) {
        const validatedLimit = parseInt(limit);
        const validatedOffset = parseInt(offset);

        if (isNaN(validatedLimit) || validatedLimit < 1 || validatedLimit > 100) {
            throw new Error('Limit must be between 1 and 100');
        }

        if (isNaN(validatedOffset) || validatedOffset < 0) {
            throw new Error('Offset must be non-negative');
        }

        return { limit: validatedLimit, offset: validatedOffset };
    }
}

// Rate limiting helper
class RateLimiter {
    constructor() {
        this.attempts = new Map();
    }

    // Check if action is allowed
    canPerform(key, cooldownMs = 1000) {
        const now = Date.now();
        const lastAttempt = this.attempts.get(key);

        if (lastAttempt && now - lastAttempt < cooldownMs) {
            const remainingMs = cooldownMs - (now - lastAttempt);
            throw new Error(`Please wait ${Math.ceil(remainingMs / 1000)} seconds before trying again`);
        }

        this.attempts.set(key, now);
        return true;
    }

    // Reset rate limit for a key
    reset(key) {
        this.attempts.delete(key);
    }

    // Clear all rate limits
    clearAll() {
        this.attempts.clear();
    }
}

// Export to window
window.Validator = Validator;
window.rateLimiter = new RateLimiter();

console.log('✅ Validation module loaded');
