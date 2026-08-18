# Contributing to Engineered.dev

Thanks for your interest in contributing! This guide will help you get started.

## Getting Started

1. **Fork** the repository
2. **Clone** your fork locally
3. **Install** dependencies with `npm install`
4. **Copy** `.env.example` to `.env.local`
5. **Start** the dev server with `npm run dev`

> The site runs fully without Firebase credentials. To test CMS features, configure your own Firebase project.

## Development Workflow

```bash
# Start development server
npm run dev

# Run linter before committing
npm run lint

# Verify production build
npm run build
```

## Making Changes

1. Create a feature branch from `main`
2. Make your changes
3. Run `npm run lint` and `npm run build` to verify
4. Commit with a clear, descriptive message
5. Open a pull request against `main`

## Code Style

- **TypeScript** is required for all new files
- **ESLint** must pass with zero errors
- Follow existing patterns in the codebase
- Keep components focused and reusable

## What to Contribute

- Bug fixes
- Performance improvements
- Documentation improvements
- Accessibility improvements
- New features (please open an issue first to discuss)

## What to Avoid

- Breaking changes to the data layer without discussion
- Removing existing features without an issue
- Large refactors without prior approval
- Adding dependencies without justification

## Reporting Issues

When reporting a bug, include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser/environment details

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
