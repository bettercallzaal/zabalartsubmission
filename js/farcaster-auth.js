/**
 * Centralized Farcaster Authentication Module
 * Handles SDK initialization, user authentication, and profile badge rendering
 * Used across all pages: Vote, Submit, Research, Chat
 */

export async function initFarcasterAuth() {
    console.log('🔐 Initializing Farcaster auth...');
    
    let userFID = null;
    let username = null;
    let isAuthenticated = false;
    
    // Wait for SDK to be available (loaded in page head)
    let sdkReady = false;
    for (let i = 0; i < 30; i++) {
        if (window.farcasterSDK && window.farcasterSDK.actions) {
            sdkReady = true;
            break;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    try {
        if (sdkReady && window.farcasterSDK) {
            const context = await window.farcasterSDK.context;
            
            if (context && context.user) {
                userFID = context.user.fid;
                username = context.user.username;
                isAuthenticated = true;
                
                console.log('✅ Farcaster user authenticated:', { fid: userFID, username, user: context.user });
                
                // Show enhanced user profile in header
                const userProfileEl = document.getElementById('userProfile');
                const userNameEl = document.getElementById('userName');
                const userPfpEl = document.getElementById('userPfp');
                const userFidEl = document.getElementById('userFidDisplay');
                const verifiedBadgeEl = document.getElementById('verifiedBadge');
                
                if (userProfileEl) {
                    // Only populate if elements exist (Vote page has full profile)
                    if (userNameEl) {
                        userNameEl.textContent = `@${username}`;
                    }
                    if (userFidEl) {
                        userFidEl.textContent = `FID: ${userFID}`;
                    }
                    
                    // Set profile picture if available
                    if (context.user.pfpUrl && userPfpEl) {
                        userPfpEl.src = context.user.pfpUrl;
                        userPfpEl.style.display = 'block';
                    }
                    
                    // Show verification badge if user has it
                    if ((context.user.verified || context.user.verifications?.length > 0) && verifiedBadgeEl) {
                        verifiedBadgeEl.style.display = 'inline';
                    }
                    
                    // Show the profile badge
                    userProfileEl.classList.remove('hidden');
                    console.log('✅ Profile badge displayed');
                }
                
                // Call page-specific user data loaders if they exist
                if (typeof window.loadPersonalStats === 'function') {
                    window.loadPersonalStats();
                }
                if (typeof window.loadBestFriends === 'function') {
                    window.loadBestFriends(userFID);
                }
            } else {
                console.warn('⚠️ No Farcaster user context found');
                throw new Error('Not in Farcaster context');
            }
            
            // CRITICAL: Always call ready() to hide splash screen
            await window.farcasterSDK.actions.ready();
            console.log('✅ Splash screen hidden, app ready');
        } else {
            console.warn('⚠️ Farcaster SDK not loaded after 3s timeout');
            throw new Error('Farcaster SDK not available');
        }
    } catch (err) {
        console.log('ℹ️ Not running in Farcaster, using fallback mode');
        // Fallback for testing outside Farcaster
        userFID = localStorage.getItem('userFID') || Math.floor(Math.random() * 1000000);
        localStorage.setItem('userFID', userFID);
        username = 'Test User';
        isAuthenticated = false;
        
        // Try to call ready() even in fallback mode
        try {
            if (window.farcasterSDK && window.farcasterSDK.actions) {
                await window.farcasterSDK.actions.ready();
                console.log('✅ Splash screen hidden (fallback mode)');
            } else {
                console.log('⚠️ SDK not available, manually hiding splash screen');
                // Manually hide splash screen when testing outside Farcaster
                const splashScreen = document.querySelector('.fc-splash-screen');
                if (splashScreen) {
                    splashScreen.style.display = 'none';
                }
            }
        } catch (readyErr) {
            console.log('⚠️ ready() failed in fallback:', readyErr);
        }
    }
    
    // Store auth state globally for other scripts
    window.farcasterAuth = {
        userFID,
        username,
        isAuthenticated
    };
    
    return { userFID, username, isAuthenticated };
}

// Settings dropdown toggle (Vote page only)
window.toggleSettingsDropdown = function() {
    const dropdown = document.getElementById('settingsDropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

// Close dropdown when clicking outside (Vote page only)
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('settingsDropdown');
    const profileBadge = document.getElementById('userProfile');
    if (dropdown && profileBadge && !profileBadge.contains(event.target)) {
        dropdown.classList.remove('active');
    }
});
