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

// Direct share to Farcaster - instant, no modal
window.shareToFarcaster = async function() {
    try {
        const castText = buildShareMessage();
        
        console.log('🚀 Opening Farcaster composer with:', castText);
        
        // Direct SDK call - opens Farcaster composer instantly
        const result = await window.farcasterSDK.actions.composeCast({
            text: castText,
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

// Legacy support - redirect old modal calls to new direct share
window.openShareModal = window.shareToFarcaster;
window.executeShare = window.shareToFarcaster;

// No-op for backwards compatibility
function closeShareModal() {
    // Modal no longer used - direct SDK calls instead
}
