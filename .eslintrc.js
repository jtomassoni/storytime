module.exports = {
  extends: ["next/core-web-vitals", "plugin:local-rules/all"],
  plugins: ["local-rules"],
  rules: {
    "local-rules/no-em-dash": "error",
  },
}

