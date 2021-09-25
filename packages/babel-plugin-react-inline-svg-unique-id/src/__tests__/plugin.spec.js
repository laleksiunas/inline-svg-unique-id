import pluginTester from 'babel-plugin-tester';
import plugin from '../plugin';
import { name as title } from '../../package.json';

pluginTester({
  plugin,
  title,
  tests: {
    'should update ids when defs are defined as a first child': {
      code: `
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
      `,
      output: `
        import { useUniqueInlineId } from '@inline-svg-unique-id/react';

        const Icon = function () {
          const _id = useUniqueInlineId();

          return (
            <svg height="150" width="400">
              <defs>
                <linearGradient id={_id} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
                  <stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
                </linearGradient>
              </defs>
              <ellipse cx="200" cy="70" rx="85" ry="55" fill={\`url(#\${_id})\`} />
            </svg>
          );
        };
      `,
    },
    'should update ids when defs are defined after regular elements': {
      code: `
        const Icon = () => (
          <svg height="150" width="400">
            <ellipse cx="200" cy="70" rx="85" ry="55" fill="url(#grad1)" />
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
                <stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
              </linearGradient>
            </defs>
          </svg>
        );
      `,
      output: `
        import { useUniqueInlineId } from '@inline-svg-unique-id/react';

        const Icon = function () {
          const _id = useUniqueInlineId();

          return (
            <svg height="150" width="400">
              <ellipse cx="200" cy="70" rx="85" ry="55" fill={\`url(#\${_id})\`} />
              <defs>
                <linearGradient id={_id} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
                  <stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
                </linearGradient>
              </defs>
            </svg>
          );
        };
      `,
    },
    'should not update any ids when component is not wrapped by svg tag': `
      const Component = () => (
        <p>
          <span id="grad1">Span</span>
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
              <stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
            </linearGradient>
          </defs>
        </p>
      );
    `,
    'should not replace component return statement if there is one already': {
      code: `
        const Icon = () => {
          return (
            <svg height="150" width="400">
              <ellipse cx="200" cy="70" rx="85" ry="55" fill="url(#grad1)" />
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
                  <stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
                </linearGradient>
              </defs>
            </svg>
          );
        };
      `,
      output: `
        import { useUniqueInlineId } from '@inline-svg-unique-id/react';

        const Icon = function () {
          const _id = useUniqueInlineId();

          return (
            <svg height="150" width="400">
              <ellipse cx="200" cy="70" rx="85" ry="55" fill={\`url(#\${_id})\`} />
              <defs>
                <linearGradient id={_id} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
                  <stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
                </linearGradient>
              </defs>
            </svg>
          );
        };
      `,
    },
    'should transform standard function component': {
      code: `
        function Icon() {
          return (
            <svg height="150" width="400">
              <ellipse cx="200" cy="70" rx="85" ry="55" fill="url(#grad1)" />
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
                  <stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
                </linearGradient>
              </defs>
            </svg>
          );
        };
      `,
      output: `
        import { useUniqueInlineId } from '@inline-svg-unique-id/react';

        function Icon() {
          const _id = useUniqueInlineId();

          return (
            <svg height="150" width="400">
              <ellipse cx="200" cy="70" rx="85" ry="55" fill={\`url(#\${_id})\`} />
              <defs>
                <linearGradient id={_id} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
                  <stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
                </linearGradient>
              </defs>
            </svg>
          );
        }
      `,
    },
    'should update definitions references': {
      code: `
        const Icon = () => (
          <svg height="150" width="400">
            <ellipse cx="200" cy="70" rx="85" ry="55" fill="url(#grad1)" />
            <ellipse cx="200" cy="70" rx="85" ry="55" fill="url(#grad2)" />
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%" random="#grad2">
                <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
                <stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
              </linearGradient>
              <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%" xlink:href="#grad1">
                <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
                <stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
              </linearGradient>
            </defs>
          </svg>
        );
      `,
      output: `
        import { useUniqueInlineId } from '@inline-svg-unique-id/react';

        const Icon = function () {
          const _id2 = useUniqueInlineId();

          const _id = useUniqueInlineId();

          return (
            <svg height="150" width="400">
              <ellipse cx="200" cy="70" rx="85" ry="55" fill={\`url(#\${_id})\`} />
              <ellipse cx="200" cy="70" rx="85" ry="55" fill={\`url(#\${_id2})\`} />
              <defs>
                <linearGradient id={_id} x1="0%" y1="0%" x2="100%" y2="0%" random={\`#\${_id2}\`}>
                  <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
                  <stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
                </linearGradient>
                <linearGradient id={_id2} x1="0%" y1="0%" x2="100%" y2="0%" xlink:href={\`#\${_id}\`}>
                  <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
                  <stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
                </linearGradient>
              </defs>
            </svg>
          );
        };
      `,
    },
    'should update id references in styles': {
      code: `
        const Icon = () => (
          <svg height="150" width="400">
            <ellipse className=".el1" cx="200" cy="70" rx="85" ry="55" fill="url(#grad1)" />
            <ellipse className=".el2" cx="200" cy="70" rx="85" ry="55" fill="url(#grad2)" />
            <style>
              {'.el1 { fill: url(#grad1); } .el2 { fill: url(#grad2); }'}
            </style>
            <style>
              {'.el1{fill:url(#grad1);}.el2{fill:url(#grad2);}'}
            </style>
            <defs>
              <style>
                {'.el1 { fill: url(#grad1); }'}
                {'.el2 { fill: url(#grad2); }'}
              </style>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
                <stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
              </linearGradient>
              <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
                <stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
              </linearGradient>
            </defs>
          </svg>
        );
      `,
      output: `
        import { useUniqueInlineId } from '@inline-svg-unique-id/react';

        const Icon = function () {
          const _id2 = useUniqueInlineId();

          const _id = useUniqueInlineId();

          return (
            <svg height="150" width="400">
              <ellipse className=".el1" cx="200" cy="70" rx="85" ry="55" fill={\`url(#\${_id})\`} />
              <ellipse className=".el2" cx="200" cy="70" rx="85" ry="55" fill={\`url(#\${_id2})\`} />
              <style>{'.el1 { fill: ' + \`url(#\${_id})\` + '; } .el2 { fill: ' + \`url(#\${_id2})\` + '; }'}</style>
              <style>{'.el1{fill:' + \`url(#\${_id})\` + ';}.el2{fill:' + \`url(#\${_id2})\` + ';}'}</style>
              <defs>
                <style>
                  {'.el1 { fill: ' + \`url(#\${_id})\` + '; }'}
                  {'.el2 { fill: ' + \`url(#\${_id2})\` + '; }'}
                </style>
                <linearGradient id={_id} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
                  <stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
                </linearGradient>
                <linearGradient id={_id2} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
                  <stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
                </linearGradient>
              </defs>
            </svg>
          );
        };
      `,
    },
    'should update all elements attributes matching IRI': {
      code: `
        const Icon = () => (
          <svg height="150" width="400">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
                <stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
              </linearGradient>
            </defs>
            <ellipse cx="200" cy="70" rx="85" ry="55" fill="url(#grad1)" random="url(#grad1)" xlink:random="url(#grad1)" />
          </svg>
        );
      `,
      output: `
        import { useUniqueInlineId } from '@inline-svg-unique-id/react';

        const Icon = function () {
          const _id = useUniqueInlineId();

          return (
            <svg height="150" width="400">
              <defs>
                <linearGradient id={_id} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
                  <stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
                </linearGradient>
              </defs>
              <ellipse
                cx="200"
                cy="70"
                rx="85"
                ry="55"
                fill={\`url(#\${_id})\`}
                random={\`url(#\${_id})\`}
                xlink:random={\`url(#\${_id})\`}
              />
            </svg>
          );
        };
      `,
    },
    'should not update unknown references': {
      code: `
        const Icon = () => (
          <svg height="150" width="400">
            <ellipse className="el1" cx="200" cy="70" rx="85" ry="55" fill="url(#grad1)" />
            <ellipse cx="200" cy="70" rx="85" ry="55" fill="url(#grad2)" />
            <ellipse cx="200" cy="70" rx="85" ry="55" fill="url(#some-id)" />
            <defs>
              <styles>
                {'.el1 { fill: url(#some-id) }'}
              </styles>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%" random="#unknown-target">
                <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
                <stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
              </linearGradient>
              <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%" xlink:href="#unknown-target1">
                <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
                <stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
              </linearGradient>
            </defs>
          </svg>
        );
      `,
      output: `
        import { useUniqueInlineId } from '@inline-svg-unique-id/react';

        const Icon = function () {
          const _id2 = useUniqueInlineId();

          const _id = useUniqueInlineId();

          return (
            <svg height="150" width="400">
              <ellipse className="el1" cx="200" cy="70" rx="85" ry="55" fill={\`url(#\${_id})\`} />
              <ellipse cx="200" cy="70" rx="85" ry="55" fill={\`url(#\${_id2})\`} />
              <ellipse cx="200" cy="70" rx="85" ry="55" fill="url(#some-id)" />
              <defs>
                <styles>{'.el1 { fill: url(#some-id) }'}</styles>
                <linearGradient id={_id} x1="0%" y1="0%" x2="100%" y2="0%" random="#unknown-target">
                  <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
                  <stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
                </linearGradient>
                <linearGradient id={_id2} x1="0%" y1="0%" x2="100%" y2="0%" xlink:href="#unknown-target1">
                  <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
                  <stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
                </linearGradient>
              </defs>
            </svg>
          );
        };
      `,
    },
  },
});
