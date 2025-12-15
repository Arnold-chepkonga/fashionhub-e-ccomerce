# Contributing to FashionHub

Thank you for your interest in contributing to FashionHub! This document provides guidelines for contributing to the project.

## Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/fashionhub-e-ccomerce.git`
3. Install dependencies: `npm install`
4. Create a new branch: `git checkout -b feature/your-feature-name`

## Code Style

### TypeScript
- Use TypeScript for all new files
- Avoid using `any` types
- Define interfaces for all data structures
- Use shared types from `app/types/index.ts`

### React Native
- Use functional components with hooks
- Avoid inline styles when possible
- Use the theme context for colors
- Follow React Native best practices

### File Organization
```
app/
├── (tabs)/          # Main navigation tabs
├── auth/            # Authentication screens
├── components/      # Reusable components
├── context/         # Context providers
├── data/            # Static data files
├── product/         # Product-related screens
└── types/           # TypeScript type definitions
```

## Adding New Features

### Adding a New Screen
1. Create the screen file in the appropriate directory
2. Use Expo Router file-based routing
3. Import and use theme context for styling
4. Add proper TypeScript types

### Adding a New Component
1. Create component in `app/components/`
2. Export as named export
3. Add TypeScript props interface
4. Use theme context for colors
5. Make it responsive

### Adding a New Context
1. Create context in `app/context/`
2. Define TypeScript interface
3. Create provider component
4. Export custom hook
5. Add to root layout providers

## Testing

Currently, the project uses the default Expo testing setup:

```bash
npm test
```

Before submitting a PR:
1. Ensure TypeScript compiles: `npx tsc --noEmit`
2. Test on web: `npm run web`
3. Test the new feature thoroughly
4. Check for console errors

## Pull Request Process

1. Update documentation if needed
2. Ensure your code follows the style guidelines
3. Test your changes on multiple platforms if possible
4. Update the README.md if you add new features
5. Create a pull request with a clear description

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
- [ ] Tested on web
- [ ] Tested on iOS (if applicable)
- [ ] Tested on Android (if applicable)
- [ ] TypeScript compilation passes

## Screenshots (if applicable)
Add screenshots here
```

## Commit Messages

Use clear, descriptive commit messages:

```
feat: Add product filtering by price range
fix: Resolve cart total calculation issue
docs: Update README with deployment instructions
style: Improve dark mode contrast
refactor: Extract validation logic to utilities
```

## Code Review Guidelines

When reviewing PRs:
- Check for TypeScript errors
- Verify responsive design
- Test functionality
- Review code style
- Ensure documentation is updated

## Questions?

If you have questions about contributing:
1. Check existing issues and PRs
2. Read the USER_GUIDE.md
3. Create a new issue for discussion

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Code of Conduct

### Our Pledge
We pledge to make participation in our project a harassment-free experience for everyone.

### Our Standards
- Be respectful and inclusive
- Accept constructive criticism
- Focus on what's best for the community
- Show empathy towards others

### Enforcement
Instances of abusive behavior may be reported to the project maintainers.

Thank you for contributing to FashionHub! 🎉
