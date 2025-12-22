# Contributing to ZABAL Live Hub

Thank you for your interest in contributing to ZABAL Live Hub! 🎨

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style](#code-style)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

## 🤝 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Respect different viewpoints
- Report unacceptable behavior

## 🚀 Getting Started

1. **Fork the repository**
```bash
git clone https://github.com/yourusername/zabalartsubmission.git
cd zabalartsubmission
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment**
```bash
cp .env.example .env
# Edit .env with your credentials
```

4. **Run locally**
```bash
npm run dev
```

## 💻 Development Workflow

### Creating a Feature

1. **Create a branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**
- Write code
- Add tests (if applicable)
- Update documentation

3. **Test your changes**
```bash
npm run validate
```

4. **Commit your changes**
```bash
git add .
git commit -m "feat: add your feature"
```

5. **Push to your fork**
```bash
git push origin feature/your-feature-name
```

6. **Create Pull Request**
- Go to GitHub
- Click "New Pull Request"
- Fill out the template

## 🎨 Code Style

### JavaScript

- Use ES6+ features
- Use `const` and `let`, not `var`
- Use arrow functions where appropriate
- Use template literals for strings
- Add JSDoc comments for functions
- Follow existing patterns

**Example**:
```javascript
/**
 * Validates a voting mode
 * @param {string} mode - The mode to validate
 * @returns {string} The validated mode
 * @throws {Error} If mode is invalid
 */
function validateMode(mode) {
    const validModes = ['studio', 'market', 'social', 'battle'];
    
    if (!validModes.includes(mode)) {
        throw new Error(`Invalid mode: ${mode}`);
    }
    
    return mode;
}
```

### CSS

- Use CSS custom properties (variables)
- Mobile-first approach
- Use BEM naming convention
- Group related properties

**Example**:
```css
.vote-card {
    /* Layout */
    display: flex;
    flex-direction: column;
    
    /* Spacing */
    padding: 1rem;
    margin-bottom: 1rem;
    
    /* Visual */
    background: var(--bg-secondary);
    border-radius: 8px;
    
    /* Animation */
    transition: transform 0.2s ease;
}
```

### HTML

- Semantic HTML5 elements
- Accessibility attributes (ARIA)
- Proper indentation
- Meaningful IDs and classes

## 📝 Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding tests
- `chore`: Build process or auxiliary tool changes

### Examples

```bash
feat(voting): add multi-mode voting support

- Users can now select multiple modes
- Updated UI to show checkboxes
- Added validation for mode arrays

Closes #123
```

```bash
fix(database): handle connection timeout errors

- Added retry logic with exponential backoff
- Improved error messages
- Added connection health checks

Fixes #456
```

## 🔄 Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No console errors
- [ ] Tested in Warpcast (if UI changes)

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
How to test these changes

## Screenshots (if applicable)
Add screenshots

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed
- [ ] Documentation updated
- [ ] No breaking changes
```

### Review Process

1. Maintainer reviews code
2. Feedback provided
3. Changes requested (if needed)
4. Approval given
5. Merge to main

## 🧪 Testing

### Manual Testing

1. **Vote Submission**
```
1. Select a mode
2. Click "Submit Votes"
3. Verify vote recorded
4. Check database
```

2. **Friend Tagging**
```
1. Click "Tag Friends"
2. Select friends
3. Share to Farcaster
4. Verify mentions
```

3. **Error Handling**
```
1. Disconnect internet
2. Try to vote
3. Verify error message
4. Reconnect
5. Retry vote
```

### Browser Testing

Test in:
- Chrome (latest)
- Safari (latest)
- Firefox (latest)
- Mobile browsers

### Accessibility Testing

- Keyboard navigation
- Screen reader compatibility
- Color contrast
- Focus indicators

## 📚 Documentation

### What to Document

- New features
- API changes
- Configuration changes
- Breaking changes
- Migration guides

### Where to Document

- **README.md**: Overview and quick start
- **ARCHITECTURE.md**: System design
- **API.md**: API documentation
- **DEPLOYMENT.md**: Deployment guide
- **Inline comments**: Complex logic

### Documentation Style

- Clear and concise
- Include examples
- Use proper formatting
- Keep up to date

## 🐛 Reporting Bugs

### Bug Report Template

```markdown
**Describe the bug**
Clear description

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen

**Screenshots**
If applicable

**Environment**
- Browser: [e.g. Chrome 120]
- OS: [e.g. macOS 14]
- Version: [e.g. 2.0.0]

**Additional context**
Any other information
```

## 💡 Feature Requests

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
Description

**Describe the solution**
What you want to happen

**Describe alternatives**
Other solutions considered

**Additional context**
Mockups, examples, etc.
```

## 🏆 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Thanked in the community

## 📞 Questions?

- GitHub Discussions
- Twitter: [@zabal](https://twitter.com/zabal)
- Farcaster: [@zaal](https://warpcast.com/zaal)

---

**Thank you for contributing!** 🙏
