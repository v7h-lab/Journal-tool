# Project Structure

## Root Directory

```
├── src/                    # Source code
├── .git/                   # Git repository
├── .kiro/                  # Kiro configuration and steering
├── .vscode/                # VS Code settings
├── index.html              # HTML entry point
├── package.json            # Dependencies and scripts
└── vite.config.ts          # Vite configuration
```

## Source Directory (`src/`)

```
src/
├── components/             # React components
│   ├── figma/             # Figma-related components
│   │   └── ImageWithFallback.tsx
│   ├── ui/                # Reusable UI components (shadcn/ui style)
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   └── ...            # Other UI primitives
│   ├── floating-toolbar.tsx    # Editor toolbar
│   ├── journal-cover.tsx       # Cover customization
│   ├── page-editor.tsx         # Page editing interface
│   └── preview-mode.tsx        # Journal preview
├── guidelines/            # Project guidelines
│   └── Guidelines.md
├── styles/                # Global styles
│   └── globals.css        # Theme variables and base styles
├── App.tsx                # Main application component
├── main.tsx               # Application entry point
├── index.css              # Tailwind CSS output
└── Attributions.md        # Third-party attributions
```

## Component Organization

### UI Components (`src/components/ui/`)
- Reusable, primitive UI components following shadcn/ui patterns
- Each component is self-contained in its own file
- Use CVA for variant management
- Export both component and variant types

### Feature Components (`src/components/`)
- Higher-level components for specific features
- `journal-cover.tsx`: Cover customization interface
- `page-editor.tsx`: Main editing interface with text, images, and videos
- `preview-mode.tsx`: Read-only journal view
- `floating-toolbar.tsx`: Contextual editing toolbar

## State Management

- Local state with React hooks (useState, useRef)
- Props drilling for component communication
- State lifted to `App.tsx` for global journal data

## Type Definitions

Key interfaces defined in `App.tsx`:
- `JournalPage`: Page content structure
- `CoverCustomization`: Cover appearance settings
- `PageCustomization`: Page appearance settings

## Styling Conventions

- Use Tailwind utility classes for styling
- Custom CSS variables defined in `src/styles/globals.css`
- Responsive design with Tailwind breakpoints
- Color scheme: Amber/orange tones for warm aesthetic

## File Naming

- React components: PascalCase with `.tsx` extension
- Utilities: camelCase with `.ts` extension
- Styles: kebab-case with `.css` extension
- Multi-word components: kebab-case filenames (e.g., `journal-cover.tsx`)
