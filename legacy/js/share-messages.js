/**
 * Dynamic Share Message Generator
 * Creates varied, personalized share messages for ZABAL voting
 */

class ShareMessageGenerator {
    constructor() {
        // Message templates for different voting modes
        this.modeTemplates = {
            studio: [
                "🎬 Voted STUDIO for this week's stream! Time for deep work and long-form creation.",
                "🎨 I'm backing STUDIO mode this week - let's see some serious building!",
                "🎬 STUDIO MODE gets my vote! Ready for focused creation time.",
                "🔨 Voted for STUDIO - can't wait to see what gets built this week!",
                "🎬 My vote: STUDIO MODE. Let's dive deep into creation."
            ],
            market: [
                "🛒 MARKET MODE has my vote! Fast decisions and community-driven action.",
                "📊 Backing MARKET this week - let's see some rapid-fire moves!",
                "🛒 Voted MARKET! Time for quick decisions and community energy.",
                "💼 My vote goes to MARKET MODE - let's make things happen fast!",
                "🛒 MARKET MODE for the win! Community-driven chaos incoming."
            ],
            social: [
                "🌐 SOCIAL MODE gets my vote! Engagement-first, interactive vibes.",
                "💬 I voted SOCIAL - let's prioritize community interaction this week!",
                "🌐 Backing SOCIAL MODE! Time for maximum engagement.",
                "🤝 My vote: SOCIAL! Let's make this week all about the community.",
                "🌐 SOCIAL MODE has my support - interaction over everything!"
            ],
            battle: [
                "⚔️ BATTLE MODE! I voted for high stakes and competitive energy.",
                "🔥 My vote goes to BATTLE - let's see some intense competition!",
                "⚔️ Voted BATTLE MODE! Ready for high-stakes action.",
                "💪 BATTLE MODE gets my vote - bring on the competitive energy!",
                "⚔️ I'm backing BATTLE this week. Let the competition begin!"
            ]
        };

        // Call-to-action variations
        this.ctas = [
            "What's your pick?",
            "Where should we focus?",
            "What mode are you voting for?",
            "Cast your vote!",
            "What's your signal?",
            "Which direction should we go?",
            "Add your voice!",
            "What do you think?",
            "Join the vote!",
            "Make your choice count!"
        ];

        // Weekly focus variations
        this.weeklyIntros = [
            "This week's stream direction:",
            "My vote for Monday's stream:",
            "Shaping this week's content:",
            "Here's my pick for the week:",
            "Voting for this week's focus:",
            "My signal for the week:",
            "This week I'm backing:",
            "My choice for the stream:"
        ];

        // Emoji sets for variety
        this.emojis = {
            studio: ['🎬', '🎨', '🔨', '🎯', '🎪'],
            market: ['🛒', '📊', '💼', '🏪', '💰'],
            social: ['🌐', '💬', '🤝', '👥', '🗣️'],
            battle: ['⚔️', '🔥', '💪', '🎮', '🏆']
        };
    }

    /**
     * Get a random item from an array
     */
    random(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    /**
     * Generate a personalized vote share message
     * @param {string} mode - The voting mode (studio, market, social, battle)
     * @param {object} options - Additional options (streak, votePower, isFirstVote, etc.)
     * @returns {string} Customized share message
     */
    generateVoteMessage(mode, options = {}) {
        const {
            streak = 0,
            votePower = 1,
            isFirstVote = false,
            username = null
        } = options;

        // Get random template and emoji
        const template = this.random(this.modeTemplates[mode] || this.modeTemplates.studio);
        const cta = this.random(this.ctas);
        
        let message = template;

        // Add streak bonus text
        if (streak >= 3) {
            const streakTexts = [
                `\n\n🔥 ${streak} week streak!`,
                `\n\n⚡ On a ${streak}-week voting streak!`,
                `\n\n🎯 ${streak} weeks strong!`
            ];
            message += this.random(streakTexts);
        }

        // Add vote power indicator for high power
        if (votePower >= 3) {
            const powerTexts = [
                `\n💎 ${votePower}x vote power`,
                `\n⭐ ${votePower}x multiplier active`,
                `\n✨ Voting with ${votePower}x power`
            ];
            message += this.random(powerTexts);
        }

        // Add first vote celebration
        if (isFirstVote) {
            message += '\n\n🎉 First vote of the week!';
        }

        // Add CTA
        message += `\n\n${cta} 👇`;

        return message;
    }

    /**
     * Generate a weekly social platform vote message
     * @param {string} platform - Social platform name
     * @param {object} options - Additional options
     * @returns {string} Customized message
     */
    generateWeeklySocialMessage(platform, options = {}) {
        const {
            streak = 0,
            isFirstVote = false
        } = options;

        const platformEmojis = {
            'Farcaster': ['🟣', '💜', '🎯'],
            'Twitter': ['🐦', '🔵', '✨'],
            'YouTube': ['📺', '🎥', '▶️'],
            'Instagram': ['📸', '💫', '🌟']
        };

        const emoji = this.random(platformEmojis[platform] || ['📱']);

        const intros = [
            `${emoji} Voted ${platform} for ZABAL's weekly focus!`,
            `${emoji} My pick: ${platform} for this week's community engagement!`,
            `${emoji} Backing ${platform} as the social priority this week!`,
            `${emoji} ${platform} gets my vote for the week!`,
            `${emoji} I'm supporting ${platform} this week!`
        ];

        const questions = [
            'Where should we focus community engagement?',
            'What platform should we prioritize?',
            'Where should ZABAL show up this week?',
            'Which platform deserves the attention?',
            'Where should we build community?'
        ];

        let message = this.random(intros);
        message += `\n\n${this.random(questions)}`;

        // Add streak
        if (streak >= 2) {
            message += `\n\n🔥 ${streak} week voting streak!`;
        }

        // Add first vote
        if (isFirstVote) {
            message += '\n\n🎉 First weekly vote!';
        }

        message += '\n\nVote now 👇';

        return message;
    }

    /**
     * Generate a "currently winning" share message
     * @param {string} mode - Leading mode
     * @param {number} voteCount - Number of votes
     * @returns {string} Share message
     */
    generateLeadingMessage(mode, voteCount) {
        const modeNames = {
            studio: 'STUDIO',
            market: 'MARKET',
            social: 'SOCIAL',
            battle: 'BATTLE'
        };

        const modeName = modeNames[mode] || mode.toUpperCase();
        const emoji = this.random(this.emojis[mode] || ['🎯']);

        const templates = [
            `${emoji} ${modeName} is leading with ${voteCount} votes!`,
            `${emoji} ${modeName} MODE is in the lead right now!`,
            `${emoji} ${modeName} is winning - ${voteCount} votes and counting!`,
            `${emoji} Current leader: ${modeName} MODE!`,
            `${emoji} ${modeName} is ahead with ${voteCount} votes!`
        ];

        const ctas = [
            'Add your vote before Monday 5pm ET!',
            'Cast your vote now!',
            'What\'s your pick?',
            'Join the vote!',
            'Make your voice heard!'
        ];

        return `${this.random(templates)}\n\n${this.random(ctas)} 👇`;
    }

    /**
     * Generate a streak milestone message
     * @param {number} streak - Current streak
     * @returns {string} Celebration message
     */
    generateStreakMessage(streak) {
        if (streak === 1) {
            return '🎉 Started my voting streak!';
        } else if (streak === 5) {
            return '🔥 5 week voting streak! Consistency pays off!';
        } else if (streak === 10) {
            return '⚡ 10 WEEK STREAK! Committed to the community!';
        } else if (streak >= 20) {
            return `💎 ${streak} WEEK STREAK! Diamond hands voter! 💎`;
        } else if (streak % 5 === 0) {
            return `🎯 ${streak} week streak and going strong!`;
        }
        return `🔥 ${streak} week voting streak!`;
    }
}

// Export for use in main app
if (typeof window !== 'undefined') {
    window.ShareMessageGenerator = ShareMessageGenerator;
}
