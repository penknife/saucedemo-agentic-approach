// Methods on test/testNoAuth that are NOT individual test cases
const NON_TEST_METHODS = new Set([
  'describe',
  'skip',
  'fixme',
  'fail',
  'slow',
  'beforeEach',
  'afterEach',
  'beforeAll',
  'afterAll',
  'use',
  'extend',
  'info',
  'setTimeout',
]);

// Methods that ARE individual test cases (modifiers)
const TEST_MODIFIER_METHODS = new Set(['only']);

/** @type {import('eslint').Rule.RuleModule} */
const requireTestTag = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require Playwright test cases to have a tag annotation',
    },
    schema: [
      {
        type: 'object',
        properties: {
          testIdentifiers: {
            type: 'array',
            items: { type: 'string' },
            description:
              'Names of test functions to check (default: ["test", "testNoAuth"])',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      missingDetails:
        "Test \"{{ title }}\" must have a details object with a tag. Add { tag: ['@tagname'] } as the second argument.",
      missingTag:
        'Test "{{ title }}" details object must include a "tag" property.',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const testIdentifiers = new Set(
      options.testIdentifiers || ['test', 'testNoAuth']
    );

    function isTestCall(node) {
      const callee = node.callee;

      if (callee.type === 'Identifier') {
        return testIdentifiers.has(callee.name);
      }

      if (callee.type === 'MemberExpression') {
        const obj = callee.object;
        const prop = callee.property;
        if (
          obj.type === 'Identifier' &&
          testIdentifiers.has(obj.name) &&
          prop.type === 'Identifier' &&
          TEST_MODIFIER_METHODS.has(prop.name)
        ) {
          return true;
        }
      }

      return false;
    }

    function getTitle(arg) {
      return arg && arg.type === 'Literal' ? String(arg.value) : '<dynamic>';
    }

    return {
      CallExpression(node) {
        if (!isTestCall(node)) return;

        const args = node.arguments;
        if (args.length < 2) return;

        const title = getTitle(args[0]);
        const second = args[1];

        // test(title, fn) — no details object at all
        if (
          second.type === 'ArrowFunctionExpression' ||
          second.type === 'FunctionExpression'
        ) {
          context.report({ node, messageId: 'missingDetails', data: { title } });
          return;
        }

        // test(title, details, fn) — details exists, check for tag
        if (second.type === 'ObjectExpression' && args.length >= 3) {
          const hasTag = second.properties.some(
            (prop) =>
              prop.type === 'Property' &&
              prop.key.type === 'Identifier' &&
              prop.key.name === 'tag'
          );
          if (!hasTag) {
            context.report({ node, messageId: 'missingTag', data: { title } });
          }
        }
      },
    };
  },
};

export default requireTestTag;
