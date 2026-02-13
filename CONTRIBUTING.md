# Contributing to ZABAL Live Hub

Thank you for your interest in contributing to ZABAL Live Hub! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Project Structure](#project-structure)

## 🤝 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Git installed
- Farcaster account for testing
- Basic knowledge of JavaScript, HTML, CSS

### Setup Development Environment

1. **Fork and clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/zabalartsubmission.git
cd zabalartsubmission
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your credentials
```

4. **Start development server**
```bash
npm run dev
```

## 🔄 Development Workflow

### Branch Naming Convention

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test additions/updates

### Commit Message Format

Follow conventional commits:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Test additions or updates
- `chore`: Build process or auxiliary tool changes

**Examples:**
```bash
feat(voting): add multi-mode voting support
fix(friend-tag): resolve friend loading issue
docs(readme): update installation instructions
```

## 📝 Code Style Guidelines

### JavaScript

- Use ES6+ features (const/let, arrow functions, async/await)
- Use meaningful variable and function names
- Add JSDoc comments for functions
- Keep functions small and focused
- Handle all errors appropriately
- Validate all user inputs

**Example:**
```javascript
/**
 * Submits a vote to the database
 * @param {number} fid - Farcaster ID of the voter
 * @param {string} mode - Vote mode (studio/market/social/battle)
 * @returns {Promise<Object>} Vote submission result
 */
async function submitVote(fid, mode) {
    // Validate inputs
    if (!fid || !mode) {
        throw new Error('FID and mode are required');
    }
    
    // Implementation
    try {
        const result = await database.insertVote(fid, mode);
        return result;
    } catch (error) {
        console.error('Vote submission failed:', error);
        throw error;
    }
}
```

### HTML

- Use semantic HTML5 elements
- Add ARIA labels for accessibility
- Keep markup clean and organized
- Use meaningful class names

### CSS

- Use CSS variables for theming
- Follow mobile-first approach
- Use flexbox/grid for layouts
- Keep selectors specific but not overly complex
- Add comments for complex styles

## 🧪 Testing

### Manual Testing Checklist

Before submitting a PR, test:

- [ ] Voting functionality (single and multi-mode)
- [ ] Friend tagging and selection
- [ ] Share to Farcaster
- [ ] Mobile responsiveness
- [ ] Keyboard navigation
- [ ] Error states and recovery
- [ ] Loading states
- [ ] Offline behavior

### Testing in Farcaster

1. Deploy to a test environment (Vercel preview)
2. Update manifest with test domain
3. Test in Warpcast mobile app
4. Verify all features work in miniapp context

## 📤 Submitting Changes

### Pull Request Process

1. **Create a feature branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**
- Write clean, documented code
- Follow code style guidelines
- Test thoroughly

3. **Commit your changes**
```bash
git add .
git commit -m "feat(scope): description"
```

4. **Push to your fork**
```bash
git push origin feature/your-feature-name
```

5. **Open a Pull Request**
- Use a clear, descriptive title
- Describe what changes you made and why
- Reference any related issues
- Add screenshots for UI changes
- Ensure CI checks pass

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How has this been tested?

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tested in Farcaster miniapp
```

## 📁 Project Structure

```
zabalartsubmission/
├── .well-known/          # Farcaster manifest
├── api/                  # Serverless functions
├── assets/               # Images, icons, splash screens
├── css/                  # Stylesheets
├── database/             # Database schemas and migrations
├── docs/                 # Documentation
├── js/                   # JavaScript modules
│   ├── config.js         # Configuration management
│   ├── state-manager.js  # State management
│   ├── database.js       # Database operations
│   ├── validation.js     # Input validation
│   ├── error-handler.js  # Error handling
│   └── share-modal.js    # Friend tagging logic
├── scripts/              # Utility scripts
├── index.html            # Landing page
├── vote.html             # Voting interface
├── chat.html             # Chat page
├── gallery.html          # Gallery/research page
├── submissions.html      # Submission page
├── leaderboard.html      # Leaderboard page
└── README.md             # Main documentation
```

## 🎯 Areas for Contribution

### High Priority
- Performance optimizations
- Accessibility improvements
- Mobile UX enhancements
- Error handling improvements
- Test coverage

### Medium Priority
- UI/UX refinements
- Documentation improvements
- Code refactoring
- New features (discuss first)

### Good First Issues
- Documentation updates
- CSS improvements
- Bug fixes
- Adding comments to code

## 💡 Development Tips

### Debugging

- Use browser DevTools console
- Check Network tab for API calls
- Use Farcaster SDK debug mode
- Add console.log statements strategically
- Use browser's React DevTools if applicable

### Common Pitfalls

- **Not calling `sdk.actions.ready()`** - Causes infinite loading
- **Missing error handling** - Always wrap async calls in try/catch
- **Not validating inputs** - Always validate user inputs
- **Forgetting mobile testing** - Test on actual mobile devices
- **Hardcoding values** - Use config.js for configuration

## 📞 Getting Help

- Open an issue for bugs or feature requests
- Join discussions in GitHub Discussions
- Reach out on Farcaster: [@zaal](https://warpcast.com/zaal)
- Check existing documentation in `/docs`

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to ZABAL Live Hub! 🎨
