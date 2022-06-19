import path from "path";

export default {
  entry: "./src/index.ts",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  target: "node",
  mode: "development",
  resolve: {
    modules: [path.join(__dirname, "node_modules")],
    extensions: [".js", ".ts"],
  },
};
