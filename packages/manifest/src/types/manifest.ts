/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { BoardResource, DereferencedBoard } from "./boards";
import { ResourceReference, Title, UriReference } from "./resource";

/**
 * A manifest resource.
 * Either referenced or dereferenced.
 */
export type ManifestResource = ReferencedManifest | DereferencedManifest;

/**
 * A dereferenced manifest with board and manifest resources.
 * @examples
 * [
 *   {
 *     "title": "My Awesome Manifest",
 *     "boards": [],
 *     "manifests": []
 *   },
 *   {
 *     "boards": [
 *       {
 *         "nodes": [],
 *         "edges": []
 *       },
 *       {
 *         "url": "https://breadboard.new/board.bgl.json"
 *       }
 *     ],
 *     "manifests": [
 *       {
 *         "title": "Nested Manifest",
 *         "boards": [],
 *         "manifests": []
 *       },
 *       {
 *         "url":"https://breadboard.new/manifest.bbm.json"
 *       }
 *     ]
 *   }
 * ]
 */
export type DereferencedManifest = {
  url?: UriReference;
  title?: Title;
  boards?: BoardResource[];
  manifests?: ManifestResource[];
};

/**
 * A reference to a manifest.
 * @examples
 * [
 *   {
 *     "title": "Nested Manifest",
 *     "boards": [],
 *     "manifests": []
 *   },
 *   {
 *     "url": "https://breadboard.new/manifest.bbm.json"
 *   }
 * ]
 *
 */
export type ReferencedManifest = ResourceReference & {
  url?: UriReference;
  boards?: undefined;
  manifests?: undefined;
};

/**
 * A fully dereferenced manifest with board and manifest resources.
 */
export type FullyDereferencedManifest = {
  url?: UriReference;
  title: Title;
  boards: DereferencedBoard[];
  manifests: FullyDereferencedManifest[];
};
