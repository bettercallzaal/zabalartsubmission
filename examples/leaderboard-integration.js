// Example: Integrating Leaderboard into Main Voting App
// This shows how to display user rank and leaderboard preview

import leaderboardManager from '../js/leaderboard.js';

// Example 1: Display user's current rank after voting
async function displayUserRankAfterVote(fid) {
  try {
    const rankData = await leaderboardManager.getUserRank(fid);
    
    if (rankData) {
      console.log(`Your rank: #${rankData.rank} out of ${rankData.total_users}`);
      console.log(`Your score: ${rankData.score} votes`);
      console.log(`Your streak: ${rankData.streak} days`);
      
      // Display in UI
      const rankElement = document.getElementById('user-rank');
      if (rankElement) {
        rankElement.innerHTML = `
          <div class="rank-display">
            <h3>Your Leaderboard Position</h3>
            <p class="rank-number">#${rankData.rank}</p>
            <p class="rank-details">
              ${rankData.score} votes • ${rankData.streak} day streak
            </p>
            <a href="/leaderboard.html" class="view-leaderboard-btn">
              View Full Leaderboard
            </a>
          </div>
        `;
      }
    }
  } catch (error) {
    console.error('Error fetching user rank:', error);
  }
}

// Example 2: Display top 5 leaderboard preview
async function displayLeaderboardPreview() {
  try {
    const leaderboard = await leaderboardManager.getLeaderboard(5);
    
    const previewElement = document.getElementById('leaderboard-preview');
    if (previewElement && leaderboard.length > 0) {
      const html = `
        <div class="leaderboard-preview">
          <h3>🏆 Top Voters</h3>
          <ul class="top-voters-list">
            ${leaderboard.map(entry => {
              const formatted = leaderboardManager.formatLeaderboardEntry(entry);
              return `
                <li>
                  <span class="rank">${leaderboardManager.getRankEmoji(entry.rank)}</span>
                  <span class="username">${formatted.displayName}</span>
                  <span class="score">${formatted.displayScore}</span>
                </li>
              `;
            }).join('')}
          </ul>
          <a href="/leaderboard.html" class="view-full-btn">View Full Leaderboard →</a>
        </div>
      `;
      previewElement.innerHTML = html;
    }
  } catch (error) {
    console.error('Error fetching leaderboard preview:', error);
  }
}

// Example 3: Add leaderboard link to navigation
function addLeaderboardNavLink() {
  const nav = document.querySelector('nav');
  if (nav) {
    const leaderboardLink = document.createElement('a');
    leaderboardLink.href = '/leaderboard.html';
    leaderboardLink.textContent = '🏆 Leaderboard';
    leaderboardLink.className = 'nav-link leaderboard-link';
    nav.appendChild(leaderboardLink);
  }
}

// Example 4: Show rank improvement notification
async function showRankImprovement(fid, previousRank) {
  try {
    const currentRank = await leaderboardManager.getUserRank(fid);
    
    if (currentRank && previousRank && currentRank.rank < previousRank) {
      const improvement = previousRank - currentRank.rank;
      
      // Show notification
      const notification = document.createElement('div');
      notification.className = 'rank-improvement-notification';
      notification.innerHTML = `
        <div class="notification-content">
          <span class="emoji">📈</span>
          <span class="message">
            You moved up ${improvement} ${improvement === 1 ? 'spot' : 'spots'}!
            Now ranked #${currentRank.rank}
          </span>
        </div>
      `;
      
      document.body.appendChild(notification);
      
      // Auto-remove after 5 seconds
      setTimeout(() => {
        notification.remove();
      }, 5000);
    }
  } catch (error) {
    console.error('Error checking rank improvement:', error);
  }
}

// Example 5: Leaderboard widget for sidebar
async function createLeaderboardWidget(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  try {
    const leaderboard = await leaderboardManager.getLeaderboard(10);
    
    container.innerHTML = `
      <div class="leaderboard-widget">
        <div class="widget-header">
          <h4>🏆 Leaderboard</h4>
          <button class="refresh-btn" onclick="refreshLeaderboard()">↻</button>
        </div>
        <div class="widget-content">
          ${leaderboard.map((entry, index) => `
            <div class="leaderboard-entry ${index < 3 ? 'top-three' : ''}">
              <span class="rank">${leaderboardManager.getRankEmoji(entry.rank)}</span>
              <span class="username">${entry.username || `User ${entry.fid}`}</span>
              <span class="score">${entry.score}</span>
            </div>
          `).join('')}
        </div>
        <a href="/leaderboard.html" class="widget-footer">
          View All →
        </a>
      </div>
    `;
    
    // Auto-refresh every 30 seconds
    setInterval(() => createLeaderboardWidget(containerId), 30000);
  } catch (error) {
    console.error('Error creating leaderboard widget:', error);
    container.innerHTML = `
      <div class="leaderboard-widget error">
        <p>Failed to load leaderboard</p>
      </div>
    `;
  }
}

// Example 6: Check if user can improve rank
async function suggestVotingToImproveRank(fid) {
  try {
    const rankData = await leaderboardManager.getUserRank(fid);
    const leaderboard = await leaderboardManager.getLeaderboard(100);
    
    if (rankData && leaderboard.length > 0) {
      // Find user ahead
      const userAhead = leaderboard.find(entry => entry.rank === rankData.rank - 1);
      
      if (userAhead) {
        const votesNeeded = userAhead.score - rankData.score + 1;
        
        if (votesNeeded <= 7) { // Within a week of catching up
          return {
            canImprove: true,
            votesNeeded,
            daysNeeded: votesNeeded, // 1 vote per day
            targetRank: rankData.rank - 1,
            message: `Vote daily for ${votesNeeded} more ${votesNeeded === 1 ? 'day' : 'days'} to reach rank #${rankData.rank - 1}!`
          };
        }
      }
    }
    
    return { canImprove: false };
  } catch (error) {
    console.error('Error checking rank improvement potential:', error);
    return { canImprove: false };
  }
}

// Example usage in main app
document.addEventListener('DOMContentLoaded', async () => {
  // Add leaderboard link to navigation
  addLeaderboardNavLink();
  
  // Display leaderboard preview
  await displayLeaderboardPreview();
  
  // If user is logged in, show their rank
  const userFid = getUserFid(); // Your function to get user FID
  if (userFid) {
    await displayUserRankAfterVote(userFid);
  }
  
  // Create sidebar widget
  await createLeaderboardWidget('leaderboard-widget-container');
});

// After successful vote submission
async function onVoteSuccess(fid) {
  // Store previous rank
  const previousRankData = await leaderboardManager.getUserRank(fid);
  const previousRank = previousRankData?.rank;
  
  // Wait a moment for database to update
  setTimeout(async () => {
    // Show updated rank
    await displayUserRankAfterVote(fid);
    
    // Show improvement notification if applicable
    if (previousRank) {
      await showRankImprovement(fid, previousRank);
    }
    
    // Suggest improvement path
    const suggestion = await suggestVotingToImproveRank(fid);
    if (suggestion.canImprove) {
      console.log(suggestion.message);
    }
    
    // Refresh leaderboard preview
    await displayLeaderboardPreview();
  }, 1000);
}

// Export functions for use in main app
export {
  displayUserRankAfterVote,
  displayLeaderboardPreview,
  addLeaderboardNavLink,
  showRankImprovement,
  createLeaderboardWidget,
  suggestVotingToImproveRank,
  onVoteSuccess
};
