class LeaderboardManager {
  constructor() {
    if (LeaderboardManager.instance) {
      return LeaderboardManager.instance;
    }
    
    this.apiEndpoint = '/api/leaderboard';
    this.cache = null;
    this.cacheExpiry = null;
    this.cacheDuration = 30000;
    
    LeaderboardManager.instance = this;
  }

  async getLeaderboard(limit = 100, forceRefresh = false) {
    if (!forceRefresh && this.cache && this.cacheExpiry && Date.now() < this.cacheExpiry) {
      return this.cache;
    }

    try {
      const response = await fetch(`${this.apiEndpoint}?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        this.cache = result.data;
        this.cacheExpiry = Date.now() + this.cacheDuration;
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to fetch leaderboard');
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw error;
    }
  }

  async getUserRank(fid) {
    if (!fid) {
      throw new Error('FID is required');
    }

    try {
      const response = await fetch(`${this.apiEndpoint}?fid=${fid}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to fetch user rank');
      }
    } catch (error) {
      console.error('Error fetching user rank:', error);
      throw error;
    }
  }

  async updateConfig(config) {
    const { name, description, icon_url } = config;

    if (!name || !description) {
      throw new Error('Name and description are required');
    }

    if (name.length > 20) {
      throw new Error('Name must be 20 characters or less');
    }

    if (description.length > 80) {
      throw new Error('Description must be 80 characters or less');
    }

    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          icon_url
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to update configuration');
      }
    } catch (error) {
      console.error('Error updating configuration:', error);
      throw error;
    }
  }

  clearCache() {
    this.cache = null;
    this.cacheExpiry = null;
  }

  formatLeaderboardEntry(entry) {
    return {
      rank: entry.rank,
      fid: entry.fid,
      username: entry.username || `User ${entry.fid}`,
      score: entry.score,
      streak: entry.streak || 0,
      lastVote: entry.lastVote,
      displayName: entry.username || `User ${entry.fid}`,
      displayScore: `${entry.score} ${entry.score === 1 ? 'vote' : 'votes'}`,
      displayStreak: entry.streak > 0 ? `${entry.streak} day${entry.streak === 1 ? '' : 's'}` : 'No streak'
    };
  }

  getRankEmoji(rank) {
    switch(rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return rank.toString();
    }
  }

  getRankClass(rank) {
    if (rank <= 3) {
      return `top-${rank}`;
    }
    return '';
  }
}

const leaderboardManager = new LeaderboardManager();

if (typeof window !== 'undefined') {
  window.LeaderboardManager = LeaderboardManager;
  window.leaderboardManager = leaderboardManager;
}

export { LeaderboardManager, leaderboardManager };
export default leaderboardManager;
