# `babel-plugin-react-inline-svg-unique-id`

### Installation

_npm install @inline-svg-unique-id/react_\
_npm install --save-dev babel-plugin-react-inline-svg-unique-id_

### Usage

**With SVGR:**

Create .svgrrc.js file in the project root:
```js
module.exports = {
  jsx: {
    babelConfig: {
      plugins: ['react-inline-svg-unique-id']
    }
  }
};
```
For more information refer to SVGR transforms [documentation](https://react-svgr.com/docs/custom-transformations/).

**With SSR:**

Wrap your application in the generation context provider:

```jsx
import { Provider as UniqueSvgIdProvider } from '@inline-svg-unique-id/react';

const YourApp = () => (
  <UniqueIdGeneratorProvider>
    ...your app stuff...
  </UniqueIdGeneratorProvider>
);
```

**Customizing generated ID prefix:**

Wrap your application in the generation context provider and specify _idPrefix_ property. **Note:** Prefix property
is evaluated once and will not change during sequential rerenders.

```jsx
import { Provider as UniqueSvgIdProvider } from '@inline-svg-unique-id/react';

const YourApp = () => (
  <UniqueIdGeneratorProvider idPrefix="custom-prefix">
    ...your app stuff...
  </UniqueIdGeneratorProvider>
);
```

It is also possible to nest providers and have different prefixes for separate branches.

```jsx
import { Provider as UniqueSvgIdProvider } from '@inline-svg-unique-id/react';

const YourApp = () => (
  <UniqueIdGeneratorProvider idPrefix="id">
    <UniqueIdGeneratorProvider idPrefix="other-id">
      // prefix is "other-id"
    </UniqueIdGeneratorProvider>
    // prefix is "id"
  </UniqueIdGeneratorProvider>
);
```
