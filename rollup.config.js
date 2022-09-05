const path = require("path");
const del = require("rollup-plugin-del");
const ts = require("@rollup/plugin-typescript");
const commonJs = require("@rollup/plugin-commonjs");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const resolvePath = (...url) => path.resolve(__dirname, ...url);

module.exports = {
  input: resolvePath("src/index.ts"),
  output: {
    file: resolvePath("dist/index.js"),
    format: "cjs"
  },
  plugins: [
    del(),
    commonJs(),
    nodeResolve(),
    ts()
  ]
};
