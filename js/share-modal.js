// Simplified Share Logic - Direct SDK composeCast for fluid UX
// Based on Farcaster best practices: instant composer, no modal friction

// Build conditional share message based on vote context
function buildShareMessage() {
    const streamVote = localStorage.getItem('userVoteMode');
    const socialVote = localStorage.getItem('completed_social_vote');
    
    const modeEmojis = { studio: '🎬', market: '🛒', social: '🌐', battle: '⚔️' };
    const platformEmojis = {
        'X (Twitter)': '🐦',
        'Farcaster': '🟣',
        'TikTok': '🎵',
        'YouTube': '📺',
        'Instagram': '📸'
    };
    
    let castText = '';
    
    // Scenario 1: No votes yet - generic invite
    if (!streamVote && !socialVote) {
        castText = 'Come vote on the ZABAL stream! 🎨';
    }
    // Scenario 2: Stream vote only
    else if (streamVote && !socialVote) {
        const emoji = modeEmojis[streamVote] || '🎨';
        castText = `I voted for a ${emoji} ${streamVote} stream!`;
    }
    // Scenario 3: Stream vote + social platform vote
    else if (streamVote && socialVote) {
        const modeEmoji = modeEmojis[streamVote] || '🎨';
        const platformEmoji = platformEmojis[socialVote] || '📱';
        castText = `I voted for a ${modeEmoji} ${streamVote} stream and I think this week's social focus should be on ${platformEmoji} ${socialVote}!`;
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

// Load randomized friend list
async function loadRandomizedFriends() {
    const grid = document.getElementById('friendTagGrid');
    if (!grid) return;
    
    const userFID = window.StateManager?.get('auth.fid');
    if (!userFID) {
        grid.innerHTML = '<p style="text-align: center; color: var(--text-gray); padding: 20px;">Sign in to tag friends</p>';
        return;
    }
    
    try {
        // Use existing loadBestFriends if not already loaded
        if (!window.bestFriends || window.bestFriends.length === 0) {
            await loadBestFriends(userFID);
        }
        
        const friends = window.bestFriends || [];
        
        if (friends.length === 0) {
            grid.innerHTML = '<p style="text-align: center; color: var(--text-gray); padding: 20px;">No friends found</p>';
            return;
        }
        
        // Randomize friend order (shuffle)
        const shuffled = [...friends].sort(() => Math.random() - 0.5);
        const displayFriends = shuffled.slice(0, 6); // Show 6 random friends
        
        // Render friend tags
        grid.innerHTML = displayFriends.map(friend => `
            <div class="friend-tag-item" data-username="${friend.username}" onclick="toggleFriendSelection(this)">
                <img src="${friend.pfp_url || '/icon.png'}" alt="${friend.display_name}" class="friend-tag-avatar">
                <span class="friend-tag-name">${friend.display_name || friend.username}</span>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading friends:', error);
        grid.innerHTML = '<p style="text-align: center; color: var(--text-gray); padding: 20px;">Could not load friends</p>';
    }
}

// Toggle friend selection
window.toggleFriendSelection = function(element) {
    element.classList.toggle('selected');
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
        
        console.log('🚀 Opening Farcaster composer with:', finalText);
        
        // Direct SDK call - opens Farcaster composer
        const result = await window.farcasterSDK.actions.composeCast({
            text: finalText,
            embeds: ['https://zabal.art'],
            channelKey: 'zao'
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
