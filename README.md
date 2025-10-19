# NetKAN Status

Display status information generated from NetKAN-bot.

Source repo for: <https://status.ksp-ckan.space/>

## Development

### Prerequisites

- Node.js (recommend using [nvm](https://github.com/nvm-sh/nvm))
- pnpm (enabled via corepack: `corepack enable`)

### Setup

```sh
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

The development server will be available at <http://localhost:5173>.

### Local Development with Data

To test with real data locally you will need to fetch the status files

```sh
# Use the fetcher
pnpm fetch:status

# Alternatively, create directory and download the status files manually
mkdir -p public/status
wget https://status.ksp-ckan.space/status/netkan.json -O public/status/netkan.json
wget https://status.ksp-ckan.space/status/netkan-ksp2.json -O public/status/netkan-ksp2.json
```

The app fetches two separate JSON files:

- `/status/netkan.json` - KSP mods status
- `/status/netkan-ksp2.json` - KSP2 mods status

Then run the development server:

```sh
pnpm dev
```

Vite will serve the files from the `public/` directory during development.

## Testing

```sh
# Run tests
pnpm test

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage
```

## Building

```sh
# Build for production
pnpm build

# Preview production build
pnpm preview
```

The built files will be in the `dist/` directory.

## Project Structure

```text
src/
├── components/         # React components
│   ├── ui/             # shadcn/ui components
│   ├── App.tsx         # Main app component
│   ├── FilterControls.tsx
│   ├── Highlighted.tsx
│   ├── NetKANTable.tsx
│   └── ThemeToggle.tsx
├── hooks/              # Custom React hooks
│   ├── useNetKANData.ts
│   └── useTheme.ts
├── lib/                # Utility functions
│   ├── data-fetcher.ts
│   ├── data-filter.ts
│   ├── date.ts
│   ├── debounce.ts
│   ├── game-config.ts
│   └── utils.ts
├── types/              # TypeScript type definitions
│   └── netkan.ts
├── styles/             # Global styles
│   └── globals.css
├── test/               # Test utilities
│   └── setup.ts
└── main.tsx            # Application entry point
```

## License

MIT
