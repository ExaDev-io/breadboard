import * as fs from "fs";

import { Package } from "src/types/package";

export function readPackage(packagePath: string): Package {
  return JSON.parse(fs.readFileSync(packagePath, "utf8"));
}