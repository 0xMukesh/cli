import { GluegunToolbox, GluegunCommand } from "gluegun";
import fs from "fs";

import { deepReadDir } from "../utils";

const command: GluegunCommand = {
  name: "export",
  alias: ["e"],
  run: async (toolbox: GluegunToolbox) => {
    const {
      parameters,
      print: { colors, error },
      filesystem,
    } = toolbox;

    const folder = parameters.first;
    if (!folder) {
      return error(colors.red("Missing `folder` parameter"));
    }

    const contents: string[] = (await deepReadDir(folder!)).flat(
      Number.POSITIVE_INFINITY
    );
    const filteredItems = contents
      .filter((item) => {
        return item.split(".")[item.split(".").length - 1] === "ts";
      })
      .map((item) => {
        return item.split("/").slice(1).join("/").split(".").slice(0, -1)[0];
      });

    if (filesystem.exists(`${folder}/index.ts`) === "file") {
      filesystem.remove(`${folder}/index.ts`);
    }

    filteredItems.map((item) => {
      fs.appendFileSync(`${folder}/index.ts`, `export * from "./${item}"\r\n`);
    });
  },
};

module.exports = command;
