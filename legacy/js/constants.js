// Constants and Configuration
// Centralized source of truth for hardcoded assumptions

// Stream States
const StreamState = {
    DECIDING: 'deciding',
    LOCKED: 'locked',
    LIVE: 'live'
};

// Voting Configuration
const VOTING_CLOSE_HOUR = 17; // 5 PM
const VOTING_TIMEZONE = 'America/New_York'; // EST/EDT
const VOTING_TIMEZONE_OFFSET = -5; // EST offset in hours

// Vote Power
const DEFAULT_VOTE_POWER = 1;
const MAX_ZAO_POWER_BONUS = 2; // Max +2x from /zao posts
const ZAO_POWER_MULTIPLIER = 0.1; // 0.1x per post

// Sharing
const MAX_SHARE_TAGS = 5;
const MINIAPP_URL = 'https://zabal.art';

// Modes
const SUPPORTED_MODES = ['studio', 'market', 'social', 'battle'];
const MODE_NAMES = {
    studio: 'Studio',
    market: 'Market',
    social: 'Social',
    battle: 'Battle'
};

// Host Configuration
const IS_SINGLE_HOST = true;
const HOST_NAME = 'Zaal';
const HOST_TWITCH = 'bettercallzaal';
const HOST_RETAKE = 'zaal';

// Farcaster
const FARCASTER_CHANNEL = 'zao';

// UI Timing
const TOAST_DURATION = 3000;
const SHARE_SUCCESS_DELAY = 1500;
const ONCHAT_LOAD_DELAY = 5000;

// Accessibility
const MIN_TAP_TARGET = 44; // pixels
const MIN_CONTRAST_RATIO = 4.5; // WCAG AA

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        StreamState,
        VOTING_CLOSE_HOUR,
        VOTING_TIMEZONE,
        VOTING_TIMEZONE_OFFSET,
        DEFAULT_VOTE_POWER,
        MAX_ZAO_POWER_BONUS,
        ZAO_POWER_MULTIPLIER,
        MAX_SHARE_TAGS,
        MINIAPP_URL,
        SUPPORTED_MODES,
        MODE_NAMES,
        IS_SINGLE_HOST,
        HOST_NAME,
        HOST_TWITCH,
        HOST_RETAKE,
        FARCASTER_CHANNEL,
        TOAST_DURATION,
        SHARE_SUCCESS_DELAY,
        ONCHAT_LOAD_DELAY,
        MIN_TAP_TARGET,
        MIN_CONTRAST_RATIO
    };
}
