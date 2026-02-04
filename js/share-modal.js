// Share Modal Logic - Conditional messages based on vote context

// Open share modal and populate with conditional message
function openShareModal() {
    const modal = document.getElementById('shareModal');
    if (!modal) return;
    
    const context = window.shareContext || {};
    const { actionType, value, streamVote, socialVote } = context;
    
    // Build conditional message
    let message = '';
    
    // Scenario 1: No votes yet - generic invite
    if (!streamVote && !socialVote) {
        message = 'Come vote on the ZABAL stream! 🎨';
    }
    // Scenario 2: Stream vote only
    else if (streamVote && !socialVote) {
        const modeEmojis = { studio: '🎬', market: '🛒', social: '🌐', battle: '⚔️' };
        const emoji = modeEmojis[streamVote] || '🎨';
        message = `I voted for a ${emoji} ${streamVote} stream!`;
    }
    // Scenario 3: Stream vote + social platform vote
    else if (streamVote && socialVote) {
        const modeEmojis = { studio: '🎬', market: '🛒', social: '🌐', battle: '⚔️' };
        const platformEmojis = {
            'X (Twitter)': '🐦',
            'Farcaster': '🟣',
            'TikTok': '🎵',
            'YouTube': '📺',
            'Instagram': '📸'
        };
        const modeEmoji = modeEmojis[streamVote] || '🎨';
        const platformEmoji = platformEmojis[socialVote] || '📱';
        message = `I voted for a ${modeEmoji} ${streamVote} stream and I think this week's social focus should be on ${platformEmoji} ${socialVote}!`;
    }
    
    // Update preview
    const preview = document.getElementById('shareMessagePreview');
    if (preview) {
        preview.textContent = message;
    }
    
    // Load friends for tagging
    loadFriendsForTagging();
    
    // Show modal
    modal.style.display = 'flex';
}

// Load friends for tagging
async function loadFriendsForTagging() {
    const grid = document.getElementById('friendSelectionGrid');
    if (!grid) return;
    
    const userFID = window.StateManager?.get('auth.fid');
    if (!userFID) {
        grid.innerHTML = '<p style="text-align: center; color: var(--text-gray);">Sign in to tag friends</p>';
        return;
    }
    
    try {
        // Use existing loadBestFriends function
        await loadBestFriends(userFID);
        
        // Get friends from window.bestFriends (populated by loadBestFriends)
        const friends = window.bestFriends || [];
        
        if (friends.length === 0) {
            grid.innerHTML = '<p style="text-align: center; color: var(--text-gray);">No friends found</p>';
            return;
        }
        
        // Render friend selection checkboxes
        grid.innerHTML = friends.slice(0, 10).map(friend => `
            <label class="friend-checkbox">
                <input type="checkbox" value="${friend.username}" onchange="toggleFriendTag('${friend.username}')">
                <img src="${friend.pfp_url || '/icon.png'}" alt="${friend.display_name}" class="friend-avatar">
                <span class="friend-name">${friend.display_name || friend.username}</span>
            </label>
        `).join('');
        
    } catch (error) {
        console.error('Error loading friends:', error);
        grid.innerHTML = '<p style="text-align: center; color: var(--text-gray);">Could not load friends</p>';
    }
}

// Toggle friend tag selection
window.toggleFriendTag = function(username) {
    if (!window.selectedFriends) {
        window.selectedFriends = [];
    }
    
    const index = window.selectedFriends.indexOf(username);
    if (index > -1) {
        window.selectedFriends.splice(index, 1);
    } else {
        window.selectedFriends.push(username);
    }
    
    console.log('Selected friends:', window.selectedFriends);
};

// Execute share with conditional message and friend tags
window.executeShare = async function() {
    const context = window.shareContext || {};
    const { streamVote, socialVote } = context;
    
    // Build message
    let castText = '';
    
    if (!streamVote && !socialVote) {
        castText = 'Come vote on the ZABAL stream! 🎨';
    } else if (streamVote && !socialVote) {
        const modeEmojis = { studio: '🎬', market: '🛒', social: '🌐', battle: '⚔️' };
        const emoji = modeEmojis[streamVote] || '🎨';
        castText = `I voted for a ${emoji} ${streamVote} stream!`;
    } else if (streamVote && socialVote) {
        const modeEmojis = { studio: '🎬', market: '🛒', social: '🌐', battle: '⚔️' };
        const platformEmojis = {
            'X (Twitter)': '🐦',
            'Farcaster': '🟣',
            'TikTok': '🎵',
            'YouTube': '📺',
            'Instagram': '📸'
        };
        const modeEmoji = modeEmojis[streamVote] || '🎨';
        const platformEmoji = platformEmojis[socialVote] || '📱';
        castText = `I voted for a ${modeEmoji} ${streamVote} stream and I think this week's social focus should be on ${platformEmoji} ${socialVote}!`;
    }
    
    // Add friend tags
    const selectedFriends = window.selectedFriends || [];
    if (selectedFriends.length > 0) {
        castText += '\n\n' + selectedFriends.map(u => `@${u}`).join(' ');
    }
    
    // Add link
    castText += '\n\nhttps://zabal.art';
    
    // Share to Farcaster
    try {
        await window.farcasterSDK.actions.composeCast({
            text: castText,
            embeds: ['https://zabal.art'],
            channelKey: 'zao'
        });
        
        closeShareModal();
        showToast('success', 'Shared!', 'Your vote has been shared to Farcaster');
        
        // Clear selections
        window.selectedFriends = [];
        window.shareContext = null;
    } catch (error) {
        console.error('❌ Failed to share:', error);
        showToast('error', 'Share Failed', 'Could not share. Please try again.');
    }
};

// Close share modal
function closeShareModal() {
    const modal = document.getElementById('shareModal');
    if (modal) {
        modal.style.display = 'none';
    }
    
    // Clear selections
    window.selectedFriends = [];
    window.shareContext = null;
}
