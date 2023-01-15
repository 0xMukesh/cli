import { build } from "gluegun";
import { Toolbox } from "gluegun/build/types/domain/toolbox";

async function run(argv: string[]): Promise<Toolbox> {
  const cli = build()
    .brand("cli")
    .src(__dirname)
    .plugins("./node_modules", { matching: "cli-*", hidden: true })
    .help()
    .version()
    .create();
  const toolbox = await cli.run(argv);

  return toolbox;
}

module.exports = { run };
