// Simplified Share Logic - Direct SDK composeCast for fluid UX
// Based on Farcaster best practices: instant composer, no modal friction

// All ZABAL votes are posted to /zao channel
// The Farcaster client choice (CURA, SOPHA, BASE, etc.) is only used in the message text
const ZABAL_CHANNEL = 'zao';

// Extensive message templates with personality archetypes for monthly variety
// 30+ variants per scenario = ~90 total unique messages
const MESSAGE_VARIANTS = {
    streamOnly: [
        // Direct & Personal (12 variants)
        (emoji, mode) => `I think @zaal should do ${emoji} ${mode} stream`,
        (emoji, mode) => `I want @zaal to do ${emoji} ${mode} stream`,
        (emoji, mode) => `@zaal should do ${emoji} ${mode} stream`,
        (emoji, mode) => `I'm voting for @zaal to do ${emoji} ${mode} stream`,
        (emoji, mode) => `I think @zaal should do ${emoji} ${mode} stream today`,
        (emoji, mode) => `@zaal should definitely do ${emoji} ${mode} stream`,
        (emoji, mode) => `I want @zaal to do ${emoji} ${mode} stream. That's my vote`,
        (emoji, mode) => `I think @zaal should do ${emoji} ${mode} stream. Let's go`,
        (emoji, mode) => `@zaal should do ${emoji} ${mode} stream. My vote is in`,
        (emoji, mode) => `I'm voting for @zaal to do ${emoji} ${mode} stream today`,
        (emoji, mode) => `I think @zaal should do ${emoji} ${mode} stream 🎨`,
        (emoji, mode) => `@zaal should do ${emoji} ${mode} stream. That's what I'm voting for`,
        
        // Casual & Enthusiastic (12 variants)
        (emoji, mode) => `I think @zaal should do ${emoji} ${mode} stream! Who's with me?`,
        (emoji, mode) => `I want @zaal to do ${emoji} ${mode} stream. It'd be fire 🔥`,
        (emoji, mode) => `@zaal should totally do ${emoji} ${mode} stream`,
        (emoji, mode) => `I'm voting for @zaal to do ${emoji} ${mode} stream. Let's make it happen`,
        (emoji, mode) => `I think @zaal should do ${emoji} ${mode} stream. No cap`,
        (emoji, mode) => `@zaal should do ${emoji} ${mode} stream. That's the move`,
        (emoji, mode) => `I want @zaal to do ${emoji} ${mode} stream. Hits different`,
        (emoji, mode) => `I think @zaal should do ${emoji} ${mode} stream. This is it`,
        (emoji, mode) => `@zaal should do ${emoji} ${mode} stream. I'm all in on this`,
        (emoji, mode) => `I'm voting for @zaal to do ${emoji} ${mode} stream. LFG`,
        (emoji, mode) => `I think @zaal should do ${emoji} ${mode} stream. That's the vibe`,
        (emoji, mode) => `@zaal should do ${emoji} ${mode} stream. My pick for sure`,
        
        // Explanatory & Thoughtful (12 variants)
        (emoji, mode) => `I think @zaal should do ${emoji} ${mode} stream. Makes the most sense`,
        (emoji, mode) => `I want @zaal to do ${emoji} ${mode} stream. It's the right call`,
        (emoji, mode) => `@zaal should do ${emoji} ${mode} stream. Best option imo`,
        (emoji, mode) => `I'm voting for @zaal to do ${emoji} ${mode} stream. Smart play`,
        (emoji, mode) => `I think @zaal should do ${emoji} ${mode} stream. Feels right`,
        (emoji, mode) => `@zaal should do ${emoji} ${mode} stream. That's my take`,
        (emoji, mode) => `I want @zaal to do ${emoji} ${mode} stream. Good timing for it`,
        (emoji, mode) => `I think @zaal should do ${emoji} ${mode} stream. Clear choice`,
        (emoji, mode) => `@zaal should do ${emoji} ${mode} stream. I'm confident in this`,
        (emoji, mode) => `I'm voting for @zaal to do ${emoji} ${mode} stream. Here's why`,
        (emoji, mode) => `I think @zaal should do ${emoji} ${mode} stream. Solid move`,
        (emoji, mode) => `@zaal should do ${emoji} ${mode} stream. That's what I'm thinking`
    ],
    streamAndSocial: [
        // Direct & Personal (12 variants)
        (modeEmoji, mode, platformEmoji, platform) => `I think @zaal should do ${modeEmoji} ${mode} stream and focus on ${platformEmoji} ${platform}`,
        (modeEmoji, mode, platformEmoji, platform) => `I want @zaal to do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform}`,
        (modeEmoji, mode, platformEmoji, platform) => `@zaal should do ${modeEmoji} ${mode} stream and push ${platformEmoji} ${platform}`,
        (modeEmoji, mode, platformEmoji, platform) => `I'm voting for @zaal to do ${modeEmoji} ${mode} stream + focus on ${platformEmoji} ${platform}`,
        (modeEmoji, mode, platformEmoji, platform) => `I think @zaal should do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} this week`,
        (modeEmoji, mode, platformEmoji, platform) => `@zaal should do ${modeEmoji} ${mode} stream and ${platformEmoji} ${platform}. That's my vote`,
        (modeEmoji, mode, platformEmoji, platform) => `I want @zaal to do ${modeEmoji} ${mode} stream with ${platformEmoji} ${platform} focus`,
        (modeEmoji, mode, platformEmoji, platform) => `I think @zaal should do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform}. Let's go`,
        (modeEmoji, mode, platformEmoji, platform) => `@zaal should do ${modeEmoji} ${mode} stream and focus on ${platformEmoji} ${platform}`,
        (modeEmoji, mode, platformEmoji, platform) => `I'm voting for @zaal to do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} today`,
        (modeEmoji, mode, platformEmoji, platform) => `I think @zaal should do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} 🎨`,
        (modeEmoji, mode, platformEmoji, platform) => `@zaal should do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform}. My votes`,
        
        // Casual & Enthusiastic (12 variants)
        (modeEmoji, mode, platformEmoji, platform) => `I think @zaal should do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform}! Who's with me?`,
        (modeEmoji, mode, platformEmoji, platform) => `I want @zaal to do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform}. It'd be fire 🔥`,
        (modeEmoji, mode, platformEmoji, platform) => `@zaal should totally do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform}`,
        (modeEmoji, mode, platformEmoji, platform) => `I'm voting for @zaal to do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform}. Let's make it happen`,
        (modeEmoji, mode, platformEmoji, platform) => `I think @zaal should do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform}. No cap`,
        (modeEmoji, mode, platformEmoji, platform) => `@zaal should do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform}. That's the move`,
        (modeEmoji, mode, platformEmoji, platform) => `I want @zaal to do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform}. Hits different`,
        (modeEmoji, mode, platformEmoji, platform) => `I think @zaal should do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform}. This is it`,
        (modeEmoji, mode, platformEmoji, platform) => `@zaal should do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform}. I'm all in`,
        (modeEmoji, mode, platformEmoji, platform) => `I'm voting for @zaal to do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform}. LFG`,
        (modeEmoji, mode, platformEmoji, platform) => `I think @zaal should do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform}. That's the vibe`,
        (modeEmoji, mode, platformEmoji, platform) => `@zaal should do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform}. My picks for sure`,
        
        // Explanatory & Thoughtful (12 variants)
        (modeEmoji, mode, platformEmoji, platform) => `I think @zaal should do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform}. Makes the most sense`,
        (modeEmoji, mode, platformEmoji, platform) => `I want @zaal to do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform}. It's the right call`,
        (modeEmoji, mode, platformEmoji, platform) => `@zaal should do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform}. Best combo imo`,
        (modeEmoji, mode, platformEmoji, platform) => `I'm voting for @zaal to do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform}. Smart play`,
        (modeEmoji, mode, platformEmoji, platform) => `I think @zaal should do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform}. Feels right`,
        (modeEmoji, mode, platformEmoji, platform) => `@zaal should do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform}. That's my take`,
        (modeEmoji, mode, platformEmoji, platform) => `I want @zaal to do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform}. Good timing`,
        (modeEmoji, mode, platformEmoji, platform) => `I think @zaal should do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform}. Clear choice`,
        (modeEmoji, mode, platformEmoji, platform) => `@zaal should do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform}. I'm confident`,
        (modeEmoji, mode, platformEmoji, platform) => `I'm voting for @zaal to do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform}. Here's why`,
        (modeEmoji, mode, platformEmoji, platform) => `I think @zaal should do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform}. Solid move`,
        (modeEmoji, mode, platformEmoji, platform) => `@zaal should do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform}. That's what I'm thinking`
    ],
    streamAndClient: [
        // Direct & Personal (12 variants)
        (modeEmoji, mode, platformEmoji, platform, client) => `I think @zaal should do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} on ${client}`,
        (modeEmoji, mode, platformEmoji, platform, client) => `I want @zaal to do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} via ${client}`,
        (modeEmoji, mode, platformEmoji, platform, client) => `@zaal should do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} on ${client}`,
        (modeEmoji, mode, platformEmoji, platform, client) => `I'm voting for @zaal to do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} on ${client}`,
        (modeEmoji, mode, platformEmoji, platform, client) => `I think @zaal should do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} via ${client} this week`,
        (modeEmoji, mode, platformEmoji, platform, client) => `@zaal should do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} on ${client}. That's my vote`,
        (modeEmoji, mode, platformEmoji, platform, client) => `I want @zaal to do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} on ${client}`,
        (modeEmoji, mode, platformEmoji, platform, client) => `I think @zaal should do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} via ${client}. Let's go`,
        (modeEmoji, mode, platformEmoji, platform, client) => `@zaal should do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} on ${client}`,
        (modeEmoji, mode, platformEmoji, platform, client) => `I'm voting for @zaal to do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} via ${client} today`,
        (modeEmoji, mode, platformEmoji, platform, client) => `I think @zaal should do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} on ${client} 🎨`,
        (modeEmoji, mode, platformEmoji, platform, client) => `@zaal should do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} via ${client}. My votes`,
        
        // Casual & Enthusiastic (12 variants)
        (modeEmoji, mode, platformEmoji, platform, client) => `I think @zaal should do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} on ${client}! Who's with me?`,
        (modeEmoji, mode, platformEmoji, platform, client) => `I want @zaal to do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} via ${client}. It'd be fire 🔥`,
        (modeEmoji, mode, platformEmoji, platform, client) => `@zaal should totally do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} on ${client}`,
        (modeEmoji, mode, platformEmoji, platform, client) => `I'm voting for @zaal to do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} via ${client}. Let's make it happen`,
        (modeEmoji, mode, platformEmoji, platform, client) => `I think @zaal should do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} on ${client}. No cap`,
        (modeEmoji, mode, platformEmoji, platform, client) => `@zaal should do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} via ${client}. That's the move`,
        (modeEmoji, mode, platformEmoji, platform, client) => `I want @zaal to do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} on ${client}. Hits different`,
        (modeEmoji, mode, platformEmoji, platform, client) => `I think @zaal should do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} via ${client}. This is it`,
        (modeEmoji, mode, platformEmoji, platform, client) => `@zaal should do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} on ${client}. I'm all in`,
        (modeEmoji, mode, platformEmoji, platform, client) => `I'm voting for @zaal to do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} via ${client}. LFG`,
        (modeEmoji, mode, platformEmoji, platform, client) => `I think @zaal should do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} on ${client}. That's the vibe`,
        (modeEmoji, mode, platformEmoji, platform, client) => `@zaal should do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} via ${client}. My picks for sure`,
        
        // Explanatory & Thoughtful (12 variants)
        (modeEmoji, mode, platformEmoji, platform, client) => `I think @zaal should do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} on ${client}. Makes the most sense`,
        (modeEmoji, mode, platformEmoji, platform, client) => `I want @zaal to do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} via ${client}. It's the right call`,
        (modeEmoji, mode, platformEmoji, platform, client) => `@zaal should do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} on ${client}. Best combo imo`,
        (modeEmoji, mode, platformEmoji, platform, client) => `I'm voting for @zaal to do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} via ${client}. Smart play`,
        (modeEmoji, mode, platformEmoji, platform, client) => `I think @zaal should do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} on ${client}. Feels right`,
        (modeEmoji, mode, platformEmoji, platform, client) => `@zaal should do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} via ${client}. That's my take`,
        (modeEmoji, mode, platformEmoji, platform, client) => `I want @zaal to do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} on ${client}. Good timing`,
        (modeEmoji, mode, platformEmoji, platform, client) => `I think @zaal should do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} via ${client}. Clear choice`,
        (modeEmoji, mode, platformEmoji, platform, client) => `@zaal should do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} on ${client}. I'm confident`,
        (modeEmoji, mode, platformEmoji, platform, client) => `I'm voting for @zaal to do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} via ${client}. Here's why`,
        (modeEmoji, mode, platformEmoji, platform, client) => `I think @zaal should do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} on ${client}. Solid move`,
        (modeEmoji, mode, platformEmoji, platform, client) => `@zaal should do ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} via ${client}. That's what I'm thinking`
    ],
    generic: [
        'Come vote on what @zaal should do for the stream! 🎨',
        'Help decide what @zaal should stream 🎨',
        'Vote on what @zaal should do today 🗳️',
        'What should @zaal stream? Cast your vote 🎨',
        'I\'m voting on what @zaal should do. Join me 🎨',
        'Help @zaal decide what to stream - vote now 🎨'
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
    
    // Scenario 1: No votes yet - generic invite
    if (!streamVote && !socialVote) {
        const randomIndex = Math.floor(Math.random() * MESSAGE_VARIANTS.generic.length);
        castText = MESSAGE_VARIANTS.generic[randomIndex];
    }
    // Scenario 2: Stream vote only
    else if (streamVote && !socialVote) {
        const emoji = modeEmojis[streamVote] || '🎨';
        const randomIndex = Math.floor(Math.random() * MESSAGE_VARIANTS.streamOnly.length);
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
                const randomIndex = Math.floor(Math.random() * MESSAGE_VARIANTS.streamAndClient.length);
                const template = MESSAGE_VARIANTS.streamAndClient[randomIndex];
                castText = template(modeEmoji, streamVote, platformEmoji, socialVote, farcasterClient);
            } else {
                const randomIndex = Math.floor(Math.random() * MESSAGE_VARIANTS.streamAndSocial.length);
                const template = MESSAGE_VARIANTS.streamAndSocial[randomIndex];
                castText = template(modeEmoji, streamVote, platformEmoji, socialVote);
            }
        } else {
            const randomIndex = Math.floor(Math.random() * MESSAGE_VARIANTS.streamAndSocial.length);
            const template = MESSAGE_VARIANTS.streamAndSocial[randomIndex];
            castText = template(modeEmoji, streamVote, platformEmoji, socialVote);
        }
    }
    
    // IMPORTANT: Only add comment if it was set in THIS session
    // Check if comment exists AND if it's from current voting session
    const currentVoteTimestamp = localStorage.getItem('current_vote_timestamp');
    const commentTimestamp = localStorage.getItem('comment_timestamp');
    
    if (userComment && userComment.trim() && commentTimestamp === currentVoteTimestamp) {
        castText = `${userComment}\n\n${castText}`;
    }
    
    return castText;
}

// Show friend tagging popup before sharing
window.shareToFarcaster = async function() {
    console.log('🎯 [FRIEND TAG] shareToFarcaster() called');
    
    const popup = document.getElementById('friendTagPopup');
    if (!popup) {
        console.warn('⚠️ [FRIEND TAG] Popup element not found, falling back to direct share');
        await shareWithTags();
        return;
    }
    
    console.log('✅ [FRIEND TAG] Popup element found, showing popup');
    popup.style.display = 'flex';
    
    // Load friends after showing popup so user sees loading state
    console.log('🔄 [FRIEND TAG] Starting to load friends...');
    await loadRandomizedFriends();
    console.log('✅ [FRIEND TAG] Friends loaded and displayed');
};

// Current sort mode for friends
let currentSortMode = 'random'; // 'random', 'recent', 'oldest'

// Load friend list with sorting options
window.loadRandomizedFriends = async function(sortMode = 'random') {
    console.log('� [FRIEND TAG] ========================================');
    console.log('🟢 [FRIEND TAG] loadRandomizedFriends() START');
    console.log('🟢 [FRIEND TAG] sortMode:', sortMode);
    console.log('🟢 [FRIEND TAG] ========================================');
    
    const grid = document.getElementById('friendTagGrid');
    console.log('🔍 [FRIEND TAG] Looking for friendTagGrid element...');
    
    if (!grid) {
        console.error('❌ [FRIEND TAG] friendTagGrid element not found!');
        console.error('❌ [FRIEND TAG] Available elements with "friend":', 
            Array.from(document.querySelectorAll('[id*="friend"]')).map(el => el.id));
        return;
    }
    
    console.log('✅ [FRIEND TAG] Grid element found');
    console.log('✅ [FRIEND TAG] Grid ID:', grid.id);
    console.log('✅ [FRIEND TAG] Grid classes:', grid.className);
    console.log('✅ [FRIEND TAG] Grid parent:', grid.parentElement?.id);
    currentSortMode = sortMode;
    
    // Show loading state
    grid.innerHTML = '<p style="text-align: center; color: var(--text-gray); padding: 20px;">Loading friends...</p>';
    console.log('📝 [FRIEND TAG] Set loading state in grid');
    
    // Get user FID from StateManager or fallback to global variable
    const userFID = window.StateManager?.get('auth.fid') || window.userFID;
    const isAuth = window.StateManager?.get('auth.isAuthenticated') || window.isAuthenticated;
    
    console.log('👤 [FRIEND TAG] User FID:', userFID, '| Authenticated:', isAuth);
    
    if (!userFID || !isAuth) {
        console.warn('⚠️ [FRIEND TAG] User not authenticated or no FID');
        grid.innerHTML = '<p style="text-align: center; color: var(--text-gray); padding: 20px;">Please sign in to tag friends</p>';
        return;
    }
    
    try {
        // Check if friends are already loaded
        console.log('🔍 [FRIEND TAG] Checking window.bestFriends...');
        console.log('🔍 [FRIEND TAG] window.bestFriends exists?', !!window.bestFriends);
        console.log('🔍 [FRIEND TAG] window.bestFriends length:', window.bestFriends?.length || 0);
        
        if (window.bestFriends && window.bestFriends.length > 0) {
            console.log('✅ [FRIEND TAG] Friends already loaded, using cached data');
        } else {
            console.log('🔄 [FRIEND TAG] No cached friends, calling window.loadBestFriends()...');
            console.log('🔄 [FRIEND TAG] window.loadBestFriends exists?', typeof window.loadBestFriends);
            
            if (window.loadBestFriends) {
                await window.loadBestFriends(userFID);
                console.log('✅ [FRIEND TAG] window.loadBestFriends() completed');
            } else {
                console.error('❌ [FRIEND TAG] window.loadBestFriends function not found!');
                console.error('❌ [FRIEND TAG] Available window functions:', Object.keys(window).filter(k => k.includes('friend')));
            }
        }
        
        // Wait a moment for friends to be stored
        await new Promise(resolve => setTimeout(resolve, 200));
        console.log('⏱️ [FRIEND TAG] Waited 200ms for data to populate');
        
        let friends = window.bestFriends || [];
        
        console.log('👥 [FRIEND TAG] Friends available for tagging:', friends.length);
        console.log('📊 [FRIEND TAG] First 3 friends:', friends.slice(0, 3).map(f => ({ username: f.username, display_name: f.display_name, pfp_url: f.pfp_url })));
        
        if (friends.length === 0) {
            console.warn('⚠️ [FRIEND TAG] No friends found after loading');
            grid.innerHTML = '<p style="text-align: center; color: var(--text-gray); padding: 20px;">No friends found. Follow more people!</p>';
            return;
        }
        
        // Sort friends based on selected mode
        let sortedFriends;
        if (sortMode === 'random') {
            sortedFriends = [...friends].sort(() => Math.random() - 0.5);
            console.log('🎲 [FRIEND TAG] Randomized friend order');
        } else if (sortMode === 'recent') {
            sortedFriends = [...friends];
            console.log('🕐 [FRIEND TAG] Showing recent friends');
        } else if (sortMode === 'oldest') {
            sortedFriends = [...friends].reverse();
            console.log('⏳ [FRIEND TAG] Showing oldest friends');
        }
        
        const displayFriends = sortedFriends.slice(0, 10);
        
        console.log('✅ [FRIEND TAG] Preparing to display', displayFriends.length, 'friends');
        console.log('📋 [FRIEND TAG] Display friends:', displayFriends.map(f => f.username));
        
        // Render friend tags with better UI
        console.log('🎨 [FRIEND TAG] Generating HTML for', displayFriends.length, 'friends...');
        
        const html = displayFriends.map((friend, index) => {
            console.log(`  ${index + 1}. ${friend.username} (${friend.display_name || 'no display name'})`);
            return `
            <div class="friend-tag-item" data-username="${friend.username}" onclick="toggleFriendSelection(this)">
                <img src="${friend.pfp_url || '/icon.png'}" alt="${friend.display_name || friend.username}" class="friend-tag-avatar" onerror="this.src='/icon.png'">
                <div class="friend-tag-info">
                    <span class="friend-tag-name">${friend.display_name || friend.username}</span>
                    <span class="friend-tag-username">@${friend.username}</span>
                </div>
            </div>
        `;
        }).join('');
        
        console.log('📝 [FRIEND TAG] Generated HTML length:', html.length, 'characters');
        console.log('📝 [FRIEND TAG] HTML preview (first 300 chars):', html.substring(0, 300));
        console.log('📝 [FRIEND TAG] Setting grid.innerHTML...');
        
        grid.innerHTML = html;
        
        console.log('✅ [FRIEND TAG] Grid innerHTML updated');
        console.log('🔍 [FRIEND TAG] Grid children count:', grid.children.length);
        console.log('🔍 [FRIEND TAG] Grid children:', Array.from(grid.children).map(c => c.dataset.username));
        
        // Update sort button states
        updateSortButtonStates(sortMode);
        console.log('✅ [FRIEND TAG] Sort button states updated');
        
    } catch (error) {
        console.error('❌ [FRIEND TAG] Error loading friends:', error);
        console.error('❌ [FRIEND TAG] Error message:', error.message);
        console.error('❌ [FRIEND TAG] Error stack:', error.stack);
        grid.innerHTML = '<p style="text-align: center; color: var(--text-gray); padding: 20px;">Could not load friends. Try again.</p>';
    }
    
    console.log('🟢 [FRIEND TAG] ========================================');
    console.log('🟢 [FRIEND TAG] loadRandomizedFriends() END');
    console.log('🟢 [FRIEND TAG] ========================================');
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
    console.log('🔄 [FRIEND TAG] changeFriendSort() called with:', sortMode);
    loadRandomizedFriends(sortMode);
};

// Select 5 random friends automatically
window.selectRandom5Friends = function() {
    console.log('⚡ [FRIEND TAG] selectRandom5Friends() called');
    
    // Clear all current selections
    const allItems = document.querySelectorAll('.friend-tag-item');
    allItems.forEach(item => item.classList.remove('selected'));
    
    // Get all available friend items
    const friendItems = Array.from(allItems);
    
    if (friendItems.length === 0) {
        console.warn('⚠️ [FRIEND TAG] No friends available to select');
        return;
    }
    
    // Shuffle and select up to 5
    const shuffled = friendItems.sort(() => Math.random() - 0.5);
    const toSelect = shuffled.slice(0, Math.min(5, friendItems.length));
    
    // Apply selection
    toSelect.forEach(item => {
        item.classList.add('selected');
        console.log('✅ [FRIEND TAG] Auto-selected:', item.dataset.username);
    });
    
    console.log(`⚡ [FRIEND TAG] Selected ${toSelect.length} random friends`);
    
    if (window.showToast) {
        window.showToast('success', 'Friends Selected', `${toSelect.length} random friends selected`);
    }
};

// Toggle friend selection (max 10)
window.toggleFriendSelection = function(element) {
    console.log('👆 [FRIEND TAG] toggleFriendSelection() called for:', element.dataset.username);
    
    const selectedCount = document.querySelectorAll('.friend-tag-item.selected').length;
    const isCurrentlySelected = element.classList.contains('selected');
    
    console.log('📊 [FRIEND TAG] Currently selected:', selectedCount, '| This item selected:', isCurrentlySelected);
    
    // Allow deselection or selection if under limit
    if (isCurrentlySelected || selectedCount < 10) {
        element.classList.toggle('selected');
        console.log('✅ [FRIEND TAG] Toggled selection for:', element.dataset.username);
    } else {
        console.log('⚠️ [FRIEND TAG] Selection limit reached (10 friends)');
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
        
        // Clear comment after building message so it doesn't persist to next session
        localStorage.removeItem('completed_comment');
        localStorage.removeItem('comment_timestamp');
        
        // Get selected friends
        const selectedElements = document.querySelectorAll('.friend-tag-item.selected');
        const selectedUsernames = Array.from(selectedElements).map(el => el.dataset.username);
        
        console.log('👥 Selected friends to tag:', selectedUsernames);
        
        // Add friend tags if any selected
        // Per Farcaster docs: mentions can be included using @username format
        // The SDK will handle converting these to proper mention objects
        let finalText = castText;
        if (selectedUsernames.length > 0) {
            const mentions = selectedUsernames.map(u => `@${u}`).join(' ');
            finalText += '\n\n' + mentions;
            console.log('✅ Added mentions:', mentions);
        }
        
        // Always post to /zao channel
        const channelKey = ZABAL_CHANNEL;
        
        console.log('🚀 Opening Farcaster composer');
        console.log('📝 Text:', finalText);
        console.log('🔗 Embed:', 'https://zabal.art');
        console.log('📺 Channel:', channelKey, '(/zao)');
        
        // Direct SDK call - opens Farcaster composer with client-specific channel
        // Mentions in @username format are automatically handled by the SDK
        const result = await window.farcasterSDK.actions.composeCast({
            text: finalText,
            embeds: ['https://zabal.art'],
            channelKey: channelKey
        });
        
        // Result can be null if user cancels
        if (result && result.cast) {
            console.log('✅ Cast shared successfully');
            if (window.showToast) {
                showToast('success', 'Shared!', 'Your vote has been shared to Farcaster');
            }
            
            // Track share with analytics
            if (window.analytics) {
                window.analytics.track('share_completed', {
                    friends_tagged: selectedUsernames.length,
                    channel: channelKey
                });
            }
        } else {
            console.log('ℹ️ User cancelled share');
        }
        
    } catch (error) {
        console.error('❌ Failed to share:', error);
        if (window.showToast) {
            showToast('error', 'Share Failed', 'Could not open Farcaster composer');
        }
        
        // Track error
        if (window.analytics) {
            window.analytics.trackError(error, { context: 'share_with_tags' });
        }
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
