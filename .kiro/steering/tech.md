# Technology Stack

## Build System & Tooling

- **Build Tool**: Vite 6.3.5
- **Compiler**: SWC (via @vitejs/plugin-react-swc)
- **Package Manager**: npm

## Core Framework

- **React**: 18.3.1 (with TypeScript)
- **TypeScript**: Configured via Vite

## UI Libraries & Components

- **Component Library**: Radix UI primitives (comprehensive set including dialogs, dropdowns, tooltips, etc.)
- **Styling**: Tailwind CSS v4 (utility-first CSS framework)
- **Icons**: Lucide React
- **Animations**: Motion library
- **Theming**: next-themes for dark/light mode support
- **UI Utilities**: 
  - class-variance-authority (CVA) for component variants
  - clsx & tailwind-merge for className management

## Additional Libraries

- **Forms**: react-hook-form
- **Date Picker**: react-day-picker
- **Carousel**: embla-carousel-react
- **Charts**: recharts
- **Notifications**: sonner
- **Command Palette**: cmdk
- **Resizable Panels**: react-resizable-panels
- **Drawer**: vaul
- **OTP Input**: input-otp

## Styling Approach

- Tailwind CSS with custom design tokens defined in CSS variables
- Custom theme configuration in `src/styles/globals.css`
- Component-specific styles using Tailwind utility classes
- shadcn/ui-style component architecture with variants

## Path Aliases

- `@/*` maps to `src/*` for cleaner imports

## Common Commands

```bash
# Install dependencies
npm i

# Start development server (runs on port 3000)
npm run dev

# Build for production (outputs to ./build)
npm run build
```

## Development Server

- Port: 3000
- Auto-opens browser on start
- Hot module replacement enabled
