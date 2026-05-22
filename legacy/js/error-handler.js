// Global Error Handler
// Catches and handles all errors gracefully

class ErrorHandler {
    constructor() {
        this.errorCount = 0;
        this.maxErrors = 10; // Prevent infinite error loops
        this.setupGlobalHandlers();
    }

    setupGlobalHandlers() {
        // Handle uncaught errors
        window.addEventListener('error', (event) => {
            this.handleError(event.error, {
                type: 'uncaught_error',
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno
            });
        });

        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError(event.reason, {
                type: 'unhandled_rejection',
                promise: event.promise
            });
        });

        console.log('✅ Global error handlers installed');
    }

    handleError(error, context = {}) {
        // Prevent error loops
        this.errorCount++;
        if (this.errorCount > this.maxErrors) {
            console.error('❌ Too many errors, stopping error handling');
            return;
        }

        // Log error
        console.error('❌ Error caught:', error);
        console.error('Context:', context);

        // Track in analytics
        if (window.analytics) {
            window.analytics.trackError(error, context);
        }

        // Determine error severity
        const severity = this.getErrorSeverity(error, context);

        // Show user-friendly message
        this.showUserMessage(error, severity, context);

        // In production, send to error tracking service (Sentry, LogRocket, etc.)
        if (window.appConfig && !window.appConfig.isDevelopment) {
            this.reportToService(error, context);
        }
    }

    getErrorSeverity(error, context) {
        // Critical errors that break core functionality
        if (context.type === 'database_error' || 
            context.type === 'auth_error' ||
            error.message?.includes('Supabase')) {
            return 'critical';
        }

        // High severity errors that affect user experience
        if (context.type === 'vote_error' ||
            context.type === 'share_error') {
            return 'high';
        }

        // Medium severity errors
        if (context.type === 'api_error' ||
            context.type === 'network_error') {
            return 'medium';
        }

        // Low severity errors
        return 'low';
    }

    showUserMessage(error, severity, context) {
        if (!window.showToast) {
            console.warn('Toast function not available');
            return;
        }

        let title, message, type;

        switch (severity) {
            case 'critical':
                type = 'error';
                title = 'Critical Error';
                message = 'Something went wrong. Please refresh the page.';
                break;

            case 'high':
                type = 'error';
                title = 'Error';
                message = this.getUserFriendlyMessage(error, context);
                break;

            case 'medium':
                type = 'warning';
                title = 'Warning';
                message = 'Something went wrong. Please try again.';
                break;

            case 'low':
                // Don't show toast for low severity errors
                return;
        }

        window.showToast(type, title, message);
    }

    getUserFriendlyMessage(error, context) {
        // Map technical errors to user-friendly messages
        const errorMessages = {
            'vote_error': 'Could not record your vote. Please try again.',
            'share_error': 'Could not share your vote. Please try again.',
            'auth_error': 'Authentication failed. Please open in Warpcast.',
            'network_error': 'Network error. Please check your connection.',
            'database_error': 'Database error. Please try again later.',
            'validation_error': error.message || 'Invalid input. Please check your data.',
            'rate_limit_error': error.message || 'Too many requests. Please slow down.'
        };

        return errorMessages[context.type] || 'An error occurred. Please try again.';
    }

    reportToService(error, context) {
        // TODO: Integrate with error tracking service
        // Example: Sentry.captureException(error, { extra: context });
        console.log('📊 Would report to error tracking service:', { error, context });
    }

    // Wrap async functions with error handling
    static async wrapAsync(fn, context = {}) {
        try {
            return await fn();
        } catch (error) {
            if (window.errorHandler) {
                window.errorHandler.handleError(error, context);
            }
            throw error; // Re-throw so caller can handle if needed
        }
    }

    // Wrap sync functions with error handling
    static wrapSync(fn, context = {}) {
        try {
            return fn();
        } catch (error) {
            if (window.errorHandler) {
                window.errorHandler.handleError(error, context);
            }
            throw error;
        }
    }

    // Reset error count (useful for testing)
    reset() {
        this.errorCount = 0;
    }
}

// Create singleton instance
window.errorHandler = new ErrorHandler();

// Helper function for wrapping code
window.withErrorHandling = (fn, context) => {
    if (fn.constructor.name === 'AsyncFunction') {
        return ErrorHandler.wrapAsync(fn, context);
    } else {
        return ErrorHandler.wrapSync(fn, context);
    }
};

console.log('✅ Error handler initialized');
