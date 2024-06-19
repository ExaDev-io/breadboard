import { DereferencedManifest } from "../types/manifest";

export function isDereferencedManifest(
  resource: object
): resource is DereferencedManifest {
  return (
    typeof resource === "object" &&
    (hasBoardsArray(resource) || hasManifestsArray(resource))
  );
}
function hasManifestsArray(resource: object): boolean {
  return "manifests" in resource && Array.isArray(resource.manifests);
}

function hasBoardsArray(resource: object): boolean {
  return "boards" in resource && Array.isArray(resource.boards);
}
