# inline-svg-unique-id

Efficient and SSR friendly ID generator at the runtime for inline SVG components definitions.

## Installation

```shell
$ npm install @inline-svg-unique-id/react
$ npm install --save-dev babel-plugin-react-inline-svg-unique-id
```

## Why?

Inline SVG components have a duplicated definitions issue. Let's say you want to import such an icon twice in your page:

```jsx
const Icon = () => (
  <svg height="150" width="400">
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
        <stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
      </linearGradient>
    </defs>
    <ellipse cx="200" cy="70" rx="85" ry="55" fill="url(#grad1)" />
  </svg>
);
```

The ellipse element gets linear gradient fill which is referenced by id. Inlining two or more such icons in the same page
will cause id duplications issues, and the browser might fail to paint the gradient. This library will transform inline SVG components at
the build-time and add code that generates ids at the runtime. For example, the previous icon is transformed to:

```jsx
import { useUniqueInlineId } from '@inline-svg-unique-id/react';

const Icon = () => {
  const gradientId = useUniqueInlineId();
  
  return (
    <svg height="150" width="400">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
        </linearGradient>
      </defs>
      <ellipse cx="200" cy="70" rx="85" ry="55" fill={`url(#${gradientId})`}/>
    </svg>
  );
};
```

## Usage

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
import { Provider as UniqueIdGeneratorProvider } from '@inline-svg-unique-id/react';

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
import { Provider as UniqueIdGeneratorProvider } from '@inline-svg-unique-id/react';

const YourApp = () => (
  <UniqueIdGeneratorProvider idPrefix="custom-prefix">
    ...your app stuff...
  </UniqueIdGeneratorProvider>
);
```

It is also possible to nest providers and have different prefixes for separate branches.

```jsx
import { Provider as UniqueIdGeneratorProvider } from '@inline-svg-unique-id/react';

const YourApp = () => (
  <UniqueIdGeneratorProvider idPrefix="id">
    <UniqueIdGeneratorProvider idPrefix="other-id">
      // prefix is "other-id"
    </UniqueIdGeneratorProvider>
    // prefix is "id"
  </UniqueIdGeneratorProvider>
);
```
