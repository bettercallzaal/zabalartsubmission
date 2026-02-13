// Simplified Share Logic - Direct SDK composeCast for fluid UX
// Based on Farcaster best practices: instant composer, no modal friction

// All ZABAL votes are posted to /zao channel
// The Farcaster client choice (CURA, SOPHA, BASE, etc.) is only used in the message text
const ZABAL_CHANNEL = 'zao';

// Extensive message templates with personality archetypes for monthly variety
// 30+ variants per scenario = ~90 total unique messages
const MESSAGE_VARIANTS = {
    streamOnly: [
        // 🔥 Hype Energy (6 variants)
        (emoji, mode) => `LFG! ${emoji} ${mode.toUpperCase()} stream is the move 🚀`,
        (emoji, mode) => `${emoji} ${mode} stream supremacy! Who's with me? 💪`,
        (emoji, mode) => `Throwing my vote at ${emoji} ${mode} stream. This is the way 🎨`,
        (emoji, mode) => `${emoji} ${mode} stream locked in. Let's make it happen 🔥`,
        (emoji, mode) => `Just voted ${emoji} ${mode} stream and I'm hyped! 💯`,
        (emoji, mode) => `${emoji} ${mode} stream energy is unmatched. That's my pick 🌟`,
        
        // 🧠 Strategic (6 variants)
        (emoji, mode) => `After careful consideration: ${emoji} ${mode} stream is the play 🎯`,
        (emoji, mode) => `The data is clear. ${emoji} ${mode} stream. That's my vote 📊`,
        (emoji, mode) => `Strategic vote incoming: ${emoji} ${mode} stream for maximum impact`,
        (emoji, mode) => `${emoji} ${mode} stream makes the most sense right now`,
        (emoji, mode) => `Analyzed the options. ${emoji} ${mode} stream is optimal 🧠`,
        (emoji, mode) => `${emoji} ${mode} stream aligns with the vision. Voted`,
        
        // 😎 Casual Cool (6 variants)
        (emoji, mode) => `${emoji} ${mode} stream. No cap, this is it`,
        (emoji, mode) => `Vibing with ${emoji} ${mode} stream today. Simple as that`,
        (emoji, mode) => `${emoji} ${mode} stream hits different. That's my pick`,
        (emoji, mode) => `Going with ${emoji} ${mode} stream. Clean choice`,
        (emoji, mode) => `${emoji} ${mode} stream feels right. Voted 🎨`,
        (emoji, mode) => `${emoji} ${mode} stream. Easy decision`,
        
        // 🎯 Direct (6 variants)
        (emoji, mode) => `${emoji} ${mode} stream. Done. Next question?`,
        (emoji, mode) => `Voted ${emoji} ${mode} stream. Your turn 👇`,
        (emoji, mode) => `${emoji} ${mode} stream locked in. Let's go`,
        (emoji, mode) => `${emoji} ${mode} stream. That's it. That's the tweet`,
        (emoji, mode) => `My vote: ${emoji} ${mode} stream 🎨`,
        (emoji, mode) => `${emoji} ${mode} stream. Simple`,
        
        // 🎪 Playful (6 variants)
        (emoji, mode) => `Plot twist: I voted ${emoji} ${mode} stream 🎭`,
        (emoji, mode) => `${emoji} ${mode} stream? ${emoji} ${mode} stream. (I said what I said)`,
        (emoji, mode) => `Surprise! It's ${emoji} ${mode} stream o'clock 🕐`,
        (emoji, mode) => `${emoji} ${mode} stream is the main character today ✨`,
        (emoji, mode) => `Manifesting ${emoji} ${mode} stream energy 🔮`,
        (emoji, mode) => `${emoji} ${mode} stream just hits different today 🎨`,
        
        // 💎 Degen (6 variants)
        (emoji, mode) => `Aping into ${emoji} ${mode} stream. WAGMI 🦍`,
        (emoji, mode) => `${emoji} ${mode} stream or ngmi. Choose wisely anon`,
        (emoji, mode) => `Ser, I voted ${emoji} ${mode} stream. This is alpha 📈`,
        (emoji, mode) => `${emoji} ${mode} stream is the meta. Don't fade this 💎`,
        (emoji, mode) => `Bullish on ${emoji} ${mode} stream. NFA 🚀`,
        (emoji, mode) => `${emoji} ${mode} stream. IYKYK 🤝`
    ],
    streamAndSocial: [
        // 🔥 Hype Energy (6 variants)
        (modeEmoji, mode, platformEmoji, platform) => `${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} domination this week! Who's ready? 🔥`,
        (modeEmoji, mode, platformEmoji, platform) => `Double down: ${modeEmoji} ${mode} for the stream, ${platformEmoji} ${platform} for the culture 💯`,
        (modeEmoji, mode, platformEmoji, platform) => `${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} grind = unstoppable combo 🚀`,
        (modeEmoji, mode, platformEmoji, platform) => `LFG! ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} push. This is it 💪`,
        (modeEmoji, mode, platformEmoji, platform) => `${modeEmoji} ${mode} + ${platformEmoji} ${platform} energy is unmatched. Let's go 🌟`,
        (modeEmoji, mode, platformEmoji, platform) => `Voted ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform}. Maximum impact mode 🎯`,
        
        // 🧠 Strategic (6 variants)
        (modeEmoji, mode, platformEmoji, platform) => `My thesis: ${modeEmoji} ${mode} stream paired with ${platformEmoji} ${platform} focus = maximum reach`,
        (modeEmoji, mode, platformEmoji, platform) => `${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} strategy. Let's capture that audience 🎯`,
        (modeEmoji, mode, platformEmoji, platform) => `Coordinated play: ${modeEmoji} ${mode} content on ${platformEmoji} ${platform}. This is how we scale`,
        (modeEmoji, mode, platformEmoji, platform) => `${modeEmoji} ${mode} stream optimized for ${platformEmoji} ${platform}. Smart move 🧠`,
        (modeEmoji, mode, platformEmoji, platform) => `Data-driven vote: ${modeEmoji} ${mode} + ${platformEmoji} ${platform} = growth 📊`,
        (modeEmoji, mode, platformEmoji, platform) => `${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} synergy. This is the path`,
        
        // 😎 Casual Cool (6 variants)
        (modeEmoji, mode, platformEmoji, platform) => `${modeEmoji} ${mode} stream vibes + ${platformEmoji} ${platform} energy. That's the combo`,
        (modeEmoji, mode, platformEmoji, platform) => `Going with ${modeEmoji} ${mode} stream, ${platformEmoji} ${platform} feels right for this week`,
        (modeEmoji, mode, platformEmoji, platform) => `${modeEmoji} ${mode} + ${platformEmoji} ${platform}. Clean and simple`,
        (modeEmoji, mode, platformEmoji, platform) => `${modeEmoji} ${mode} stream + ${platformEmoji} ${platform}. No brainer`,
        (modeEmoji, mode, platformEmoji, platform) => `Vibing with ${modeEmoji} ${mode} + ${platformEmoji} ${platform} this week`,
        (modeEmoji, mode, platformEmoji, platform) => `${modeEmoji} ${mode} stream + ${platformEmoji} ${platform}. That's it`,
        
        // 🎯 Direct (6 variants)
        (modeEmoji, mode, platformEmoji, platform) => `${modeEmoji} ${mode} stream. ${platformEmoji} ${platform} focus. Let's execute`,
        (modeEmoji, mode, platformEmoji, platform) => `Two votes: ${modeEmoji} ${mode} for stream, ${platformEmoji} ${platform} for platform. Done`,
        (modeEmoji, mode, platformEmoji, platform) => `${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} push. That's the plan`,
        (modeEmoji, mode, platformEmoji, platform) => `Voted ${modeEmoji} ${mode} + ${platformEmoji} ${platform}. Your move 👇`,
        (modeEmoji, mode, platformEmoji, platform) => `${modeEmoji} ${mode} stream. ${platformEmoji} ${platform} platform. Simple`,
        (modeEmoji, mode, platformEmoji, platform) => `${modeEmoji} ${mode} + ${platformEmoji} ${platform}. Locked in`,
        
        // 🎪 Playful (6 variants)
        (modeEmoji, mode, platformEmoji, platform) => `Recipe for success: ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} sauce 👨‍🍳`,
        (modeEmoji, mode, platformEmoji, platform) => `${modeEmoji} ${mode} stream meets ${platformEmoji} ${platform}. A love story 💕`,
        (modeEmoji, mode, platformEmoji, platform) => `Manifesting ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} takeover ✨`,
        (modeEmoji, mode, platformEmoji, platform) => `${modeEmoji} ${mode} + ${platformEmoji} ${platform} is the main character arc 🎭`,
        (modeEmoji, mode, platformEmoji, platform) => `Plot twist: ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} supremacy 🔮`,
        (modeEmoji, mode, platformEmoji, platform) => `${modeEmoji} ${mode} stream + ${platformEmoji} ${platform}. Chef's kiss 💋`,
        
        // 💎 Degen (6 variants)
        (modeEmoji, mode, platformEmoji, platform) => `${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} alpha. Anon, you're early 📈`,
        (modeEmoji, mode, platformEmoji, platform) => `Bullish on ${modeEmoji} ${mode} stream + ${platformEmoji} ${platform}. WAGMI 🦍`,
        (modeEmoji, mode, platformEmoji, platform) => `${modeEmoji} ${mode} x ${platformEmoji} ${platform} is the meta. Don't fade this 💎`,
        (modeEmoji, mode, platformEmoji, platform) => `Aping into ${modeEmoji} ${mode} + ${platformEmoji} ${platform}. NFA 🚀`,
        (modeEmoji, mode, platformEmoji, platform) => `${modeEmoji} ${mode} stream + ${platformEmoji} ${platform}. IYKYK 🤝`,
        (modeEmoji, mode, platformEmoji, platform) => `Ser, ${modeEmoji} ${mode} + ${platformEmoji} ${platform} is alpha. DYOR 📊`
    ],
    streamAndClient: [
        // 🔥 Hype Energy (6 variants)
        (modeEmoji, mode, platformEmoji, platform, client) => `${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} on ${client}! Triple threat activated 🔥`,
        (modeEmoji, mode, platformEmoji, platform, client) => `${modeEmoji} ${mode} + ${platformEmoji} ${platform} + ${client} = the ultimate combo. LFG! 🚀`,
        (modeEmoji, mode, platformEmoji, platform, client) => `Stacking votes: ${modeEmoji} ${mode} stream, ${platformEmoji} ${platform} platform, ${client} client. Let's gooo 💪`,
        (modeEmoji, mode, platformEmoji, platform, client) => `${modeEmoji} ${mode} + ${platformEmoji} ${platform} via ${client}. Maximum power 💯`,
        (modeEmoji, mode, platformEmoji, platform, client) => `Triple down: ${modeEmoji} ${mode} / ${platformEmoji} ${platform} / ${client}. This is it 🌟`,
        (modeEmoji, mode, platformEmoji, platform, client) => `${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} + ${client} supremacy 🎯`,
        
        // 🧠 Strategic (6 variants)
        (modeEmoji, mode, platformEmoji, platform, client) => `Full stack vote: ${modeEmoji} ${mode} stream → ${platformEmoji} ${platform} → ${client}. This is the path`,
        (modeEmoji, mode, platformEmoji, platform, client) => `${modeEmoji} ${mode} content, ${platformEmoji} ${platform} distribution, ${client} community. The trifecta 🎯`,
        (modeEmoji, mode, platformEmoji, platform, client) => `${modeEmoji} ${mode} stream optimized for ${platformEmoji} ${platform} via ${client}. Maximum synergy`,
        (modeEmoji, mode, platformEmoji, platform, client) => `Strategic alignment: ${modeEmoji} ${mode} + ${platformEmoji} ${platform} + ${client} 🧠`,
        (modeEmoji, mode, platformEmoji, platform, client) => `${modeEmoji} ${mode} stream → ${platformEmoji} ${platform} → ${client}. Calculated move 📊`,
        (modeEmoji, mode, platformEmoji, platform, client) => `Three-layer strategy: ${modeEmoji} ${mode} / ${platformEmoji} ${platform} / ${client}`,
        
        // 😎 Casual Cool (6 variants)
        (modeEmoji, mode, platformEmoji, platform, client) => `${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} + ${client}. That's the vibe`,
        (modeEmoji, mode, platformEmoji, platform, client) => `Going all in: ${modeEmoji} ${mode}, ${platformEmoji} ${platform}, ${client}. Clean sweep`,
        (modeEmoji, mode, platformEmoji, platform, client) => `${modeEmoji} ${mode} stream on ${platformEmoji} ${platform} through ${client}. Simple`,
        (modeEmoji, mode, platformEmoji, platform, client) => `${modeEmoji} ${mode} + ${platformEmoji} ${platform} + ${client}. No brainer`,
        (modeEmoji, mode, platformEmoji, platform, client) => `Vibing with ${modeEmoji} ${mode} / ${platformEmoji} ${platform} / ${client}`,
        (modeEmoji, mode, platformEmoji, platform, client) => `${modeEmoji} ${mode} + ${platformEmoji} ${platform} via ${client}. That's it`,
        
        // 🎯 Direct (6 variants)
        (modeEmoji, mode, platformEmoji, platform, client) => `${modeEmoji} ${mode} stream. ${platformEmoji} ${platform} platform. ${client} client. Execute`,
        (modeEmoji, mode, platformEmoji, platform, client) => `Three votes locked: ${modeEmoji} ${mode} / ${platformEmoji} ${platform} / ${client}`,
        (modeEmoji, mode, platformEmoji, platform, client) => `${modeEmoji} ${mode} + ${platformEmoji} ${platform} via ${client}. That's it`,
        (modeEmoji, mode, platformEmoji, platform, client) => `Voted ${modeEmoji} ${mode} + ${platformEmoji} ${platform} + ${client}. Done`,
        (modeEmoji, mode, platformEmoji, platform, client) => `${modeEmoji} ${mode} / ${platformEmoji} ${platform} / ${client}. Your turn 👇`,
        (modeEmoji, mode, platformEmoji, platform, client) => `${modeEmoji} ${mode} + ${platformEmoji} ${platform} + ${client}. Simple`,
        
        // 🎪 Playful (6 variants)
        (modeEmoji, mode, platformEmoji, platform, client) => `${modeEmoji} ${mode} stream + ${platformEmoji} ${platform} + ${client} = chaos (the good kind) 🎪`,
        (modeEmoji, mode, platformEmoji, platform, client) => `Mixing ${modeEmoji} ${mode}, ${platformEmoji} ${platform}, and ${client} like a DJ 🎧`,
        (modeEmoji, mode, platformEmoji, platform, client) => `${modeEmoji} ${mode} stream feat. ${platformEmoji} ${platform} (${client} remix) 🎵`,
        (modeEmoji, mode, platformEmoji, platform, client) => `${modeEmoji} ${mode} + ${platformEmoji} ${platform} + ${client}. The holy trinity ✨`,
        (modeEmoji, mode, platformEmoji, platform, client) => `Plot twist: ${modeEmoji} ${mode} / ${platformEmoji} ${platform} / ${client} supremacy 🎭`,
        (modeEmoji, mode, platformEmoji, platform, client) => `${modeEmoji} ${mode} + ${platformEmoji} ${platform} + ${client}. Chef's kiss 💋`,
        
        // 💎 Degen (6 variants)
        (modeEmoji, mode, platformEmoji, platform, client) => `${modeEmoji} ${mode} + ${platformEmoji} ${platform} + ${client} is the alpha play. Ser, this is it 📈`,
        (modeEmoji, mode, platformEmoji, platform, client) => `Aping into ${modeEmoji} ${mode} stream on ${platformEmoji} ${platform} via ${client}. WAGMI 🦍`,
        (modeEmoji, mode, platformEmoji, platform, client) => `${modeEmoji} ${mode} x ${platformEmoji} ${platform} x ${client}. Triple degen mode activated 💎`,
        (modeEmoji, mode, platformEmoji, platform, client) => `Bullish on ${modeEmoji} ${mode} + ${platformEmoji} ${platform} + ${client}. NFA 🚀`,
        (modeEmoji, mode, platformEmoji, platform, client) => `${modeEmoji} ${mode} / ${platformEmoji} ${platform} / ${client}. IYKYK 🤝`,
        (modeEmoji, mode, platformEmoji, platform, client) => `Ser, ${modeEmoji} ${mode} + ${platformEmoji} ${platform} + ${client} is alpha. DYOR 📊`
    ],
    generic: [
        'Come vote on the ZABAL stream! 🎨',
        'Help decide the next ZABAL stream 🎨',
        'Your vote matters - join the ZABAL stream decision 🎨',
        'Cast your vote for the ZABAL stream 🎨',
        'ZABAL voting is live! Make your voice heard 🗳️',
        'Shape the ZABAL stream - vote now 🎨'
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
