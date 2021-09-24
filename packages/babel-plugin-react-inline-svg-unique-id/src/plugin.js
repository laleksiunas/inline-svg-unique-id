import template from '@babel/template';
import jsxSyntaxPlugin from '@babel/plugin-syntax-jsx';

const idGeneratorLibraryName = '@inline-svg-unique-id/react';
const idGeneratorHookName = 'useUniqueInlineId';

const idAttributeName = 'id';

// Matches SVG IRI: url(#example)
const iriRegex = 'url\\(#([a-zA-Z][\\w:.-]*)\\)';
const iriExactMatchRegex = new RegExp(`^${iriRegex}$`);
const iriGlobalMatchRegex = new RegExp(iriRegex, 'g');

const svgIdentifiers = {
  svg: ['svg', 'Svg'],
  defs: ['defs', 'Defs'],
  style: ['style'],
};

const isSvgComponentIdentifier = (openingElementNameIdentifier, expectedSvgIdentifiers) =>
  expectedSvgIdentifiers.some((i) => openingElementNameIdentifier.isJSXIdentifier({ name: i }));

const isSvgComponentPath = (path, expectedSvgIdentifiers) =>
  isSvgComponentIdentifier(path.get('openingElement.name'), expectedSvgIdentifiers);

const isSvgPath = (path) => isSvgComponentPath(path, svgIdentifiers.svg);

const isDefsPath = (path) => isSvgComponentPath(path, svgIdentifiers.defs);

const isStylePath = (path) => isSvgComponentPath(path, svgIdentifiers.style);

const isStringLiteralAttribute = (attribute) => attribute.get('value').isStringLiteral();

const createIriUrl = (id) => `url(#${id})`;

const createIdValuesContainer = (createIdIdentifier) => {
  const idIdentifierByIdValueMap = new Map();

  return {
    createIdIdentifier: (idValue) => {
      if (idIdentifierByIdValueMap.has(idValue)) {
        return idIdentifierByIdValueMap.get(idValue);
      }

      const newIdentifier = createIdIdentifier();

      idIdentifierByIdValueMap.set(idValue, newIdentifier);

      return newIdentifier;
    },
    getIdIdentifier: (idValue) => idIdentifierByIdValueMap.get(idValue),
    hasIdentifiers: () => idIdentifierByIdValueMap.size !== 0,
    getIdentifiers: () => Array.from(idIdentifierByIdValueMap.values()),
  };
};

const buildIriUrlExpression = template.expression(`\`${createIriUrl('${%%idIdentifier%%}')}\``);

const buildIdGeneratorHookImportStatement = template(
  `import { ${idGeneratorHookName} } from '${idGeneratorLibraryName}';`,
);

const buildIdIdentifierGeneratorStatement = template(`const %%idIdentifier%% = ${idGeneratorHookName}();`);

const plugin = ({ types: t }) => {
  const splitStylesStringByIriToLiterals = (stylesString, idValuesWithIdentifiers) =>
    idValuesWithIdentifiers
      .reduce(
        (splitStylesLiterals, [idValue, idIdentifier]) =>
          splitStylesLiterals.flatMap((stylesOrIdIdentifier) => {
            if (typeof stylesOrIdIdentifier !== 'string') {
              return stylesOrIdIdentifier;
            }

            const iriUrlExpression = buildIriUrlExpression({ idIdentifier });

            return stylesOrIdIdentifier
              .split(createIriUrl(idValue))
              .flatMap((s, i, splits) => (i === splits.length - 1 ? [s] : [s, iriUrlExpression]));
          }),
        [stylesString],
      )
      .map((stylesOrIdIdentifier) =>
        typeof stylesOrIdIdentifier === 'string' ? t.stringLiteral(stylesOrIdIdentifier) : stylesOrIdIdentifier,
      );

  const svgDefsElementsVisitor = {
    JSXOpeningElement(path, state) {
      const idAttribute = path.get('attributes').find((a) => a.get('name').isJSXIdentifier({ name: idAttributeName }));

      if (!idAttribute || !isStringLiteralAttribute(idAttribute)) {
        return;
      }

      const newIdIdentifier = state.idValuesContainer.createIdIdentifier(idAttribute.node.value.value);

      idAttribute.replaceWith(
        t.jsxAttribute(t.jsxIdentifier(idAttributeName), t.jsxExpressionContainer(newIdIdentifier)),
      );
    },
  };

  const svgDefsVisitor = {
    JSXElement(path, state) {
      if (isDefsPath(path)) {
        path.traverse(svgDefsElementsVisitor, state);
      }
    },
  };

  const styleTagsVisitor = {
    StringLiteral(path, state) {
      const stylesString = path.node.value;
      const iriMatches = new Set(Array.from(stylesString.matchAll(iriGlobalMatchRegex)).map((x) => x[1]));
      const idValuesWithIdentifiers = Array.from(iriMatches)
        .map((idValue) => [idValue, state.idValuesContainer.getIdIdentifier(idValue)])
        .filter(([, idIdentifier]) => idIdentifier);

      if (idValuesWithIdentifiers.length === 0) {
        return;
      }

      const stylesStringLiterals = splitStylesStringByIriToLiterals(stylesString, idValuesWithIdentifiers);
      const concatenatedStyles = stylesStringLiterals.reduce((node, styleLiteral) =>
        node ? t.binaryExpression('+', node, styleLiteral) : styleLiteral,
      );

      path.replaceWith(concatenatedStyles);
    },
  };

  const svgElementsVisitor = {
    JSXElement(path, state) {
      if (isStylePath(path)) {
        path.traverse(styleTagsVisitor, state);
      }
    },
    JSXOpeningElement(path, state) {
      path.get('attributes').forEach((attribute) => {
        if (!isStringLiteralAttribute(attribute)) {
          return;
        }

        const attributeValue = attribute.node.value.value;
        const iriMatches = attributeValue.match(iriExactMatchRegex);

        if (!iriMatches) {
          return;
        }

        const currentIdValue = iriMatches[1];
        const idIdentifier = state.idValuesContainer.getIdIdentifier(currentIdValue);

        if (idIdentifier) {
          attribute.replaceWith(
            t.jsxAttribute(
              t.jsxIdentifier(attribute.node.name.name),
              t.jsxExpressionContainer(buildIriUrlExpression({ idIdentifier })),
            ),
          );
        }
      });
    },
  };

  const renderedJsxVisitor = {
    JSXElement(path, state) {
      if (isSvgPath(path)) {
        path.traverse(svgDefsVisitor, state);
        path.traverse(svgElementsVisitor, state);
      }
    },
  };

  const componentVisitor = {
    Function(path) {
      const idValuesContainer = createIdValuesContainer(() => path.scope.generateUidIdentifier(idAttributeName));

      path.traverse(renderedJsxVisitor, { idValuesContainer });

      if (!idValuesContainer.hasIdentifiers()) {
        return;
      }

      // If component is an arrow function with implicit return, add return statement
      if (path.isArrowFunctionExpression()) {
        path.arrowFunctionToExpression();
      }

      const body = path.get('body');
      const rootPath = path.findParent((p) => p.isProgram());

      rootPath.unshiftContainer('body', buildIdGeneratorHookImportStatement());

      idValuesContainer.getIdentifiers().forEach((idIdentifier) => {
        body.unshiftContainer('body', buildIdIdentifierGeneratorStatement({ idIdentifier }));
      });
    },
  };

  return {
    inherits: jsxSyntaxPlugin,
    visitor: componentVisitor,
  };
};

export default plugin;
