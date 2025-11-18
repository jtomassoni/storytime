/**
 * ESLint rule to prevent em dashes (—) in code
 * Em dashes are a common AI-generated pattern that should be replaced with regular hyphens
 */
module.exports = {
  "no-em-dash": {
    meta: {
      type: "problem",
      docs: {
        description: "Disallow em dashes (—) in strings and comments",
        category: "Stylistic Issues",
        recommended: false,
      },
      fixable: null,
      schema: [],
      messages: {
        noEmDash: "Found em dash (—). Replace with regular hyphen (-) or hyphen with spaces ( - ).",
      },
    },
    create(context) {
      const sourceCode = context.getSourceCode()

      function checkText(text, node, offset = 0) {
        const emDashRegex = /—/g
        let match

        while ((match = emDashRegex.exec(text)) !== null) {
          const index = match.index + offset
          context.report({
            node,
            messageId: "noEmDash",
            loc: {
              start: sourceCode.getLocFromIndex(index),
              end: sourceCode.getLocFromIndex(index + 1),
            },
          })
        }
      }

      return {
        // Check string literals
        Literal(node) {
          if (typeof node.value === "string" && node.value.includes("—")) {
            checkText(node.value, node, node.range[0] + 1) // +1 for opening quote
          }
        },

        // Check template literals
        TemplateLiteral(node) {
          node.quasis.forEach((quasi) => {
            if (quasi.value.raw.includes("—")) {
              checkText(quasi.value.raw, quasi, quasi.range[0] + 1) // +1 for opening backtick
            }
          })
        },

        // Check JSX text content
        JSXText(node) {
          if (node.value.includes("—")) {
            checkText(node.value, node, node.range[0])
          }
        },

        // Check comments
        Program() {
          const comments = sourceCode.getAllComments()
          comments.forEach((comment) => {
            if (comment.value.includes("—")) {
              const start = comment.range[0] + (comment.type === "Block" ? 2 : 2) // +2 for /* or //
              checkText(comment.value, comment, start)
            }
          })
        },
      }
    },
  },
}

