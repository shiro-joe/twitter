import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  {
    files: ["**/*.js"], 
    languageOptions: {sourceType: "commonjs" },
    rules: {
      "quotes": ["error", "double"], 
      "semi": ["error", "always"], 
      "strict": ["error", "global"]
    }
  },
  {languageOptions: { globals: {...globals.browser, ...globals.node} }},
  pluginJs.configs.recommended,
];
