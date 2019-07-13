import Fs from "fs";
import Path from "path";
import Process from "process";

const appRootDir = Fs.realpathSync(Process.cwd());
const resolveApp = (relativePath: string) =>
  Path.resolve(appRootDir, relativePath);

export default {
  appSrc: resolveApp("src"),
  appBuild: resolveApp("build"),
  appNodeModules: resolveApp("node_modules"),
  appConfig: resolveApp("config"),
  appHtml: resolveApp("public/index.html")
};
