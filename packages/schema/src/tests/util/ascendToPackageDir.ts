import fs from "fs";
import path from "path";

export function ascendToPackageDir(packageName: string = "breadboard-ai") {
  let directory = process.cwd();
  while (directory !== "/") {
    const packageJsonPath = `${directory}/package.json`;
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
      if (packageJson.name === packageName) {
        return directory;
      }
    }
    directory = path.dirname(directory);
  }
  throw new Error("Could not find breadboard-ai directory.");
}