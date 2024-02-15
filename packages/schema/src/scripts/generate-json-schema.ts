/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as fs from "fs";
import * as path from "path";
import { createGenerator, type Config } from "ts-json-schema-generator";
import { generateSchemaId } from "./generate-schema-id.js";

const filePath = path.resolve("src/graph.ts");
if (!fs.existsSync(filePath)) {
  throw new Error(`File not found: ${filePath}`);
}

const tsconfigPath = path.resolve("tsconfig.json");
if (!fs.existsSync(tsconfigPath)) {
  throw new Error(`File not found: ${tsconfigPath}`);
}

const config: Config = {
  additionalProperties: false,
  expose: "all",
  path: filePath,
  schemaId: generateSchemaId(),
  sortProps: true,
  topRef: true,
  tsconfig: tsconfigPath,
  type: "GraphDescriptor",
};

const outputPath = path.resolve("breadboard.schema.json");

const schema = createGenerator(config).createSchema(config.type);

const schemaString = JSON.stringify(schema, null, "\t");
fs.writeFileSync(outputPath, schemaString);
