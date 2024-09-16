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
    'should update ids for elements defined outside defs too': {
      code: `
        const Icon = () => (
          <svg height="16" width="16">
            <mask
              id="my_mask"
              width={16}
              height={16}
              x={0}
              y={0}
              maskUnits="userSpaceOnUse"
              style={{
                maskType: 'alpha',
              }}
            >
              <path fill="#D9D9D9" d="M0 0h16v16H0z" />
            </mask>
            <g mask="url(#my_mask)">
              <path
                fill="currentColor"
                d="M8 10.667c.833 0 1.542-.292 2.125-.875A2.895 2.895 0 0 0 11 7.667c0-.834-.291-1.542-.875-2.126A2.895 2.895 0 0 0 8 4.667c-.833 0-1.542.291-2.125.874A2.895 2.895 0 0 0 5 7.667c0 .833.292 1.541.875 2.125A2.895 2.895 0 0 0 8 10.667Zm0-1.2c-.5 0-.925-.175-1.275-.526A1.734 1.734 0 0 1 6.2 7.667c0-.5.175-.925.525-1.276.35-.35.775-.524 1.275-.524.5 0 .925.175 1.275.524.35.35.525.776.525 1.276s-.175.925-.525 1.274c-.35.35-.775.526-1.275.526Zm0 3.2c-1.622 0-3.1-.453-4.433-1.359-1.334-.905-2.3-2.12-2.9-3.641.6-1.523 1.566-2.737 2.9-3.642A7.72 7.72 0 0 1 8 2.667c1.622 0 3.1.452 4.433 1.358 1.334.905 2.3 2.12 2.9 3.642-.6 1.522-1.566 2.736-2.9 3.641A7.717 7.717 0 0 1 8 12.667Zm0-1.334c1.256 0 2.409-.33 3.459-.992a6.513 6.513 0 0 0 2.408-2.674 6.518 6.518 0 0 0-2.408-2.676A6.366 6.366 0 0 0 8 4c-1.255 0-2.408.33-3.459.991a6.518 6.518 0 0 0-2.408 2.676 6.514 6.514 0 0 0 2.408 2.674 6.363 6.363 0 0 0 3.46.992Z"
              />
            </g>
          </svg>
        );
      `,
      output: `
        import { useUniqueInlineId } from '@inline-svg-unique-id/react';

        const Icon = function () {
          const _id = useUniqueInlineId();

          return (
            <svg height="16" width="16">
              <mask
                id={_id}
                width={16}
                height={16}
                x={0}
                y={0}
                maskUnits="userSpaceOnUse"
                style={{
                  maskType: 'alpha',
                }}
              >
                <path fill="#D9D9D9" d="M0 0h16v16H0z" />
              </mask>
              <g mask={\`url(#\${_id})\`}>
                <path
                  fill="currentColor"
                  d="M8 10.667c.833 0 1.542-.292 2.125-.875A2.895 2.895 0 0 0 11 7.667c0-.834-.291-1.542-.875-2.126A2.895 2.895 0 0 0 8 4.667c-.833 0-1.542.291-2.125.874A2.895 2.895 0 0 0 5 7.667c0 .833.292 1.541.875 2.125A2.895 2.895 0 0 0 8 10.667Zm0-1.2c-.5 0-.925-.175-1.275-.526A1.734 1.734 0 0 1 6.2 7.667c0-.5.175-.925.525-1.276.35-.35.775-.524 1.275-.524.5 0 .925.175 1.275.524.35.35.525.776.525 1.276s-.175.925-.525 1.274c-.35.35-.775.526-1.275.526Zm0 3.2c-1.622 0-3.1-.453-4.433-1.359-1.334-.905-2.3-2.12-2.9-3.641.6-1.523 1.566-2.737 2.9-3.642A7.72 7.72 0 0 1 8 2.667c1.622 0 3.1.452 4.433 1.358 1.334.905 2.3 2.12 2.9 3.642-.6 1.522-1.566 2.736-2.9 3.641A7.717 7.717 0 0 1 8 12.667Zm0-1.334c1.256 0 2.409-.33 3.459-.992a6.513 6.513 0 0 0 2.408-2.674 6.518 6.518 0 0 0-2.408-2.676A6.366 6.366 0 0 0 8 4c-1.255 0-2.408.33-3.459.991a6.518 6.518 0 0 0-2.408 2.676 6.514 6.514 0 0 0 2.408 2.674 6.363 6.363 0 0 0 3.46.992Z"
                />
              </g>
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
            <ellipse
              cx="200"
              cy="70"
              rx="85"
              ry="55"
              fill="url(#grad1)"
              random="url(#grad1)"
              xlink:href="url(#grad1)"
              xlink:random="url(#grad1)"
            />
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
                xlink:href={\`url(#\${_id})\`}
                xlink:random={\`url(#\${_id})\`}
              />
            </svg>
          );
        };
      `,
    },
    'should update xlink:href attribute matching ID pattern': {
      code: `
        const Icon = () => (
          <svg height="150" width="400">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
                <stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
              </linearGradient>
            </defs>
            <ellipse cx="200" cy="70" rx="85" ry="55" fill="url(#grad1)" xlink:href="#grad1" />
            <ellipse cx="200" cy="70" rx="85" ry="55" fill="url(#grad1)" xlinkHref="#grad1" />
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
              <ellipse cx="200" cy="70" rx="85" ry="55" fill={\`url(#\${_id})\`} xlink:href={\`#\${_id}\`} />
              <ellipse cx="200" cy="70" rx="85" ry="55" fill={\`url(#\${_id})\`} xlinkHref={\`#\${_id}\`} />
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
    'uses a custom id generator hook': {
      pluginOptions: {
        idGeneratorLibraryName: 'react',
        idGeneratorHookName: 'useId',
      },
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
        import { useId } from 'react';

        const Icon = function () {
          const _id = useId();

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
  },
});
