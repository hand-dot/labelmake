import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import builtins from "rollup-plugin-node-builtins";
import globals from "rollup-plugin-node-globals";

const pkg = require("./package.json");

const libraryName = "labelmake";

export default {
  input: `src/${libraryName}.ts`,
  output: [
    {
      file: pkg.main,
      name: libraryName,
      format: "umd",
      sourcemap: true,
      compact: true,
      freeze: false
    }
  ],
  watch: {
    include: "src/**"
  },
  plugins: [
    typescript({ useTsconfigDeclarationDir: true }),
    commonjs(),
    resolve(),
    globals(),
    builtins()
  ]
};
