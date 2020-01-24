module.exports = {
    parser: "@typescript-eslint/parser",
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "prettier/@typescript-eslint",
        "plugin:prettier/recommended"
    ],
    env : {
        browser: true,
        node: true,
        es6: true,
        es2017: true
    },

    parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module",
      project: "./tsconfig.json"
    },
    rules: {
        semi: [2, "never"],
        "prettier/prettier": "error",
        "@typescript-eslint/no-empty-function": 0,
        "@typescript-eslint/no-var-requires": 0,
        "@typescript-eslint/no-explicit-any": 0
    },
};
