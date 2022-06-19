import path from "path";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export default {
  entry: "./src/index.ts",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
  target: "node",
  mode: "production",
  resolve: {
    modules: [path.join(__dirname, "node_modules")],
    extensions: [".js", ".ts"],
  },
};
