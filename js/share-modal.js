// Simplified Share Logic - Direct SDK composeCast for fluid UX
// Based on Farcaster best practices: instant composer, no modal friction

// Client to channel mapping for Farcaster posts
const CLIENT_CHANNELS = {
    'CURA': 'cura',
    'SOPHA': 'https://farcaster.xyz/sopha',
    'DEGEN': 'degen',
    'BASE': 'basenft',
    'FARCASTER CLIENT': 'farcaster'
};

// Varied message templates to avoid bot detection
const MESSAGE_VARIANTS = {
    streamOnly: [
        (emoji, mode) => `Just voted ${emoji} ${mode} stream!`,
        (emoji, mode) => `${emoji} ${mode} stream gets my vote today`,
        (emoji, mode) => `Backing ${emoji} ${mode} for the next stream`,
        (emoji, mode) => `My pick: ${emoji} ${mode} stream 🎨`
    ],
    streamAndSocial: [
        (modeEmoji, mode, platformEmoji, platform) => `Voted ${modeEmoji} ${mode} stream + pushing for ${platformEmoji} ${platform} this week`,
        (modeEmoji, mode, platformEmoji, platform) => `${modeEmoji} ${mode} stream is my choice, and ${platformEmoji} ${platform} should be our focus`,
        (modeEmoji, mode, platformEmoji, platform) => `Going with ${modeEmoji} ${mode} for the stream. Think we should prioritize ${platformEmoji} ${platform}`,
        (modeEmoji, mode, platformEmoji, platform) => `My vote: ${modeEmoji} ${mode} stream. Weekly focus? ${platformEmoji} ${platform}`
    ],
    streamAndClient: [
        (modeEmoji, mode, platformEmoji, platform, client) => `${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} via ${client} 🎯`,
        (modeEmoji, mode, platformEmoji, platform, client) => `Voted ${modeEmoji} ${mode} stream. Targeting ${client} for ${platformEmoji} ${platform} this week`,
        (modeEmoji, mode, platformEmoji, platform, client) => `My picks: ${modeEmoji} ${mode} stream & ${client} as the ${platformEmoji} ${platform} focus`,
        (modeEmoji, mode, platformEmoji, platform, client) => `${modeEmoji} ${mode} + ${client} on ${platformEmoji} ${platform} - that's the move`
    ],
    generic: [
        'Come vote on the ZABAL stream! 🎨',
        'Help decide the next ZABAL stream 🎨',
        'Your vote matters - join the ZABAL stream decision 🎨',
        'Cast your vote for the ZABAL stream 🎨'
    ]
};

// Build conditional share message based on vote context
function buildShareMessage() {
    const streamVote = localStorage.getItem('userVoteMode');
    const socialVote = localStorage.getItem('completed_social_vote');
    const userComment = localStorage.getItem('completed_comment');
    
    const modeEmojis = { studio: '🎬', market: '🛒', social: '🌐', battle: '⚔️' };
    const platformEmojis = {
        'X (Twitter)': '🐦',
        'Farcaster': '🟣',
        'TikTok': '🎵',
        'YouTube': '📺',
        'Instagram': '📸'
    };
    
    let castText = '';
    
    // Random variant selection to avoid bot detection
    const randomIndex = Math.floor(Math.random() * 4);
    
    // Scenario 1: No votes yet - generic invite
    if (!streamVote && !socialVote) {
        castText = MESSAGE_VARIANTS.generic[randomIndex];
    }
    // Scenario 2: Stream vote only
    else if (streamVote && !socialVote) {
        const emoji = modeEmojis[streamVote] || '🎨';
        const template = MESSAGE_VARIANTS.streamOnly[randomIndex];
        castText = template(emoji, streamVote);
    }
    // Scenario 3: Stream vote + social platform vote
    else if (streamVote && socialVote) {
        const modeEmoji = modeEmojis[streamVote] || '🎨';
        const platformEmoji = platformEmojis[socialVote] || '📱';
        
        // Check if Farcaster was selected and if a client was chosen
        if (socialVote === 'Farcaster') {
            const farcasterClient = localStorage.getItem('farcaster_client_choice');
            if (farcasterClient) {
                const template = MESSAGE_VARIANTS.streamAndClient[randomIndex];
                castText = template(modeEmoji, streamVote, platformEmoji, socialVote, farcasterClient);
            } else {
                const template = MESSAGE_VARIANTS.streamAndSocial[randomIndex];
                castText = template(modeEmoji, streamVote, platformEmoji, socialVote);
            }
        } else {
            const template = MESSAGE_VARIANTS.streamAndSocial[randomIndex];
            castText = template(modeEmoji, streamVote, platformEmoji, socialVote);
        }
    }
    
    // Add user comment if available (prepend to message)
    if (userComment && userComment.trim()) {
        castText = `${userComment}\n\n${castText}`;
    }
    
    return castText;
}

// Show friend tagging popup before sharing
window.shareToFarcaster = async function() {
    const popup = document.getElementById('friendTagPopup');
    if (!popup) {
        // Fallback: direct share if popup doesn't exist
        await shareWithTags();
        return;
    }
    
    // Load and show friend tagging popup
    await loadRandomizedFriends();
    popup.style.display = 'flex';
};

// Current sort mode for friends
let currentSortMode = 'random'; // 'random', 'recent', 'oldest'

// Load friend list with sorting options
async function loadRandomizedFriends(sortMode = 'random') {
    const grid = document.getElementById('friendTagGrid');
    if (!grid) return;
    
    currentSortMode = sortMode;
    
    // Get user FID from StateManager or fallback to global variable
    const userFID = window.StateManager?.get('auth.fid') || window.userFID;
    const isAuth = window.StateManager?.get('auth.isAuthenticated') || window.isAuthenticated;
    
    if (!userFID || !isAuth) {
        grid.innerHTML = '<p style="text-align: center; color: var(--text-gray); padding: 20px;">Loading friends...</p>';
        return;
    }
    
    try {
        // Use existing loadBestFriends if not already loaded
        if (!window.bestFriends || window.bestFriends.length === 0) {
            await loadBestFriends(userFID);
        }
        
        let friends = window.bestFriends || [];
        
        if (friends.length === 0) {
            grid.innerHTML = '<p style="text-align: center; color: var(--text-gray); padding: 20px;">No friends found</p>';
            return;
        }
        
        // Sort friends based on selected mode
        let sortedFriends;
        if (sortMode === 'random') {
            // Randomize friend order (shuffle)
            sortedFriends = [...friends].sort(() => Math.random() - 0.5);
        } else if (sortMode === 'recent') {
            // Sort by most recent (assuming friends array is already sorted by recency from API)
            sortedFriends = [...friends];
        } else if (sortMode === 'oldest') {
            // Reverse order for oldest friends first
            sortedFriends = [...friends].reverse();
        }
        
        const displayFriends = sortedFriends.slice(0, 10); // Show up to 10 friends
        
        // Render friend tags
        grid.innerHTML = displayFriends.map(friend => `
            <div class="friend-tag-item" data-username="${friend.username}" onclick="toggleFriendSelection(this)">
                <img src="${friend.pfp_url || '/icon.png'}" alt="${friend.display_name}" class="friend-tag-avatar">
                <span class="friend-tag-name">${friend.display_name || friend.username}</span>
            </div>
        `).join('');
        
        // Update sort button states
        updateSortButtonStates(sortMode);
        
    } catch (error) {
        console.error('Error loading friends:', error);
        grid.innerHTML = '<p style="text-align: center; color: var(--text-gray); padding: 20px;">Could not load friends</p>';
    }
}

// Update sort button visual states
function updateSortButtonStates(activeMode) {
    const buttons = document.querySelectorAll('.friend-sort-btn');
    buttons.forEach(btn => {
        if (btn.dataset.sort === activeMode) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Change friend sort mode
window.changeFriendSort = function(sortMode) {
    console.log('🔄 Changing friend sort to:', sortMode);
    loadRandomizedFriends(sortMode);
};

// Toggle friend selection (max 10)
window.toggleFriendSelection = function(element) {
    const selectedCount = document.querySelectorAll('.friend-tag-item.selected').length;
    const isCurrentlySelected = element.classList.contains('selected');
    
    // Allow deselection or selection if under limit
    if (isCurrentlySelected || selectedCount < 10) {
        element.classList.toggle('selected');
    } else {
        // Show toast if trying to select more than 10
        if (window.showToast) {
            window.showToast('info', 'Limit Reached', 'You can tag up to 10 friends');
        }
    }
};

// Share with selected tags
window.shareWithTags = async function() {
    // Close popup
    const popup = document.getElementById('friendTagPopup');
    if (popup) popup.style.display = 'none';
    
    try {
        const castText = buildShareMessage();
        
        // Get selected friends
        const selectedElements = document.querySelectorAll('.friend-tag-item.selected');
        const selectedUsernames = Array.from(selectedElements).map(el => el.dataset.username);
        
        // Add friend tags if any selected
        let finalText = castText;
        if (selectedUsernames.length > 0) {
            finalText += '\n\n' + selectedUsernames.map(u => `@${u}`).join(' ');
        }
        
        // Determine channel based on Farcaster client selection
        const farcasterClient = localStorage.getItem('farcaster_client_choice');
        let channelKey = 'zao'; // Default channel
        
        if (farcasterClient && CLIENT_CHANNELS[farcasterClient]) {
            channelKey = CLIENT_CHANNELS[farcasterClient];
            console.log(`🎯 Posting to ${farcasterClient} channel: ${channelKey}`);
        }
        
        console.log('🚀 Opening Farcaster composer with:', finalText);
        
        // Direct SDK call - opens Farcaster composer with client-specific channel
        const result = await window.farcasterSDK.actions.composeCast({
            text: finalText,
            embeds: ['https://zabal.art'],
            channelKey: channelKey
        });
        
        // Result can be null if user cancels
        if (result && result.cast) {
            console.log('✅ Cast shared successfully');
            showToast('success', 'Shared!', 'Your vote has been shared to Farcaster');
        } else {
            console.log('ℹ️ User cancelled share');
        }
        
    } catch (error) {
        console.error('❌ Failed to share:', error);
        showToast('error', 'Share Failed', 'Could not open Farcaster composer');
    }
};

// Close friend tag popup
window.closeFriendTagPopup = function() {
    const popup = document.getElementById('friendTagPopup');
    if (popup) popup.style.display = 'none';
};

// Legacy support - redirect old modal calls to new direct share
window.openShareModal = window.shareToFarcaster;
window.executeShare = window.shareToFarcaster;

// No-op for backwards compatibility
function closeShareModal() {
    // Modal no longer used - direct SDK calls instead
}
