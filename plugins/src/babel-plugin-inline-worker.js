/* eslint-env node */
import path from "path";
import runWebPackSync from "babel-plugin-webpack-loaders/lib/runWebPackSync";
import config from "../../config/webpack.lib.config";

// Behold! The Babel-Webpack Frankenstein monster!
// I am not proud of this.
export default ({ types: t }) => {
  return {
    visitor: {
      StringLiteral(nodePath, state) {
        if (
          nodePath.node &&
          nodePath.node.value &&
          nodePath.node.value.indexOf("babel-inline-worker!") === 0
        ) {
          const [, fileName] = nodePath.node.value.split("!");
          const resolvedPath = path.resolve(
            process.cwd(),
            path.dirname(state.file.opts.filename),
            fileName
          );
          const fileContents = runWebPackSync({
            path: resolvedPath,
            configPath: path.resolve(
              process.cwd(),
              "config/webpack.lib.config"
            ),
            config,
            verbose: false
          });
          nodePath.replaceWith(
            t.stringLiteral(
              new Buffer(fileContents).toString("base64")
            )
          );
        }
      }
    }
  };
};
