import { readdir } from "node:fs/promises";
import { join } from "node:path";

export const deepReadDir = async (directory: string) =>
  await Promise.all(
    (
      await readdir(directory, { withFileTypes: true })
    ).map(async (dirent) => {
      const path = join(directory, dirent.name);
      return dirent.isDirectory() ? await deepReadDir(path) : path;
    })
  );
