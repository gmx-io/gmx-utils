# GMX Utils

Pure domain utilities and reusable components for GMX Typescript projects.

## Get Started

### Installation

#### from GitHub

```json
{
  "dependencies": {
    "@gmx-io/utils": "github:gmx-io/gmx-utils#main"
  }
}
```

#### For local development

1. Add dependency to main project

```json
{
  "dependencies": {
    "@gmx-io/utils": "file:../gmx-utils"
  }
}
```

2. Run `yarn install` in main project

---

### Polyfills

The library includes global patches and polyfills
If you're using tree-shaking and importing only specific functions from other modules, you may need to explicitly import the patch:

```typescript
// At the top of your entry point file
import "@gmx-io/utils/src/lib/types/polyfills";
```

---

### Setup

```bash
# Install dependencies
yarn install
```

### Scripts

#### Prebuild

```bash
# Build all types and codegen artifacts
yarn prebuild:all

# Prebuild static data (hashed markets keys)
yarn prebuild

# Apply yarn patches
yarn patch

# Build types
yarn build-types

# Codegen Subsquid types
yarn subsquid-codegen
```

#### Linting

```bash
yarn lint               # Run ESLint with auto-fix
yarn lint:ci            # Run ESLint (strict, no warnings allowed)
yarn tscheck            # Type check with incremental builds
yarn tscheck:ci         # Type check without incremental (for CI)
yarn check:parallel     # Run lint and tscheck in parallel
yarn check:ci           # Run lint:ci and tscheck:ci sequentially
yarn clean:cache        # Clean all caches (ESLint, TypeScript)
yarn clean:lint         # Clean ESLint cache only
yarn clean:ts           # Clean TypeScript build info only
```

#### Tests

```bash
yarn test               # Run tests once
yarn test:watch         # Run tests in watch mode
yarn test:coverage      # Run tests with coverage report
yarn coverage:baseline  # Generate coverage and create/update baseline
yarn coverage:check     # Check coverage against baseline
```

## Structure

- `src/domain/` - Domain-specific platform agnostic modules (pricing, swap, positions, orders, etc.)
- `src/lib/` - Low-level utilities and helpers
- `src/configs/` - Configuration files (chains, contracts, tokens, markets)
- `src/abis/` - Contract ABIs
- `src/transactions/` - Transaction building utilities
- `src/codegen/` - Generated code and hashed keys
- `src/types/` - Shared type definitions

## Usage

```typescript
import type { MarketInfo } from "@gmx-io/utils/src/domain/markets/types";
import { applySlippageToPrice } from "@gmx-io/utils/src/domain/pricing/slippage";
import { abis } from "@gmx-io/utils/src/abis";
import { bigMath } from "@gmx-io/utils/src/lib/bigmath";
```
