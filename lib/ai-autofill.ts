export function normalize(module: string, data: unknown): unknown {
  if (data == null || typeof data !== "object") {
    return {};
  }

  return data;
}
