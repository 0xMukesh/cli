import { GluegunCommand, GluegunToolbox } from "gluegun";
import pako from "pako";
import base64url from "base64url";

const command: GluegunCommand = {
  name: "decode",
  alias: ["pkd"],
  description: "Decode base64 encoded JSON payload",
  commandPath: ["pako", "decode"],
  run: async (toolbox: GluegunToolbox) => {
    const {
      parameters: { options },
      print: { error, colors, success },
    } = toolbox;

    if (!options.data) {
      error(colors.red("Missing required `data` option flag"));
      process.exit(1);
    }

    const decoded = JSON.parse(
      pako.inflate(base64url.toBuffer(options.data), {
        to: "string",
      })
    );

    success(JSON.stringify(decoded, null, 2));
    process.exit(0);
  },
};

module.exports = command;
