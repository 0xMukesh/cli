import { GluegunCommand, GluegunToolbox } from "gluegun";
import axios, { AxiosResponse } from "axios";
import inquirer from "inquirer";

import { PriceFetchResult } from "../../types";

const command: GluegunCommand = {
  name: "price",
  alias: ["solp"],
  description: "Fetch price for a specific SPL token via jup.ag",
  commandPath: ["solana", "price"],
  run: async (toolbox: GluegunToolbox) => {
    const {
      print: { colors, error, success, spin },
    } = toolbox;

    const token: {
      symbol: string;
    } = await inquirer.prompt({
      message: "What's the SPL token's symbol?",
      name: "symbol",
      type: "input",
      validate: (value) => {
        if (value.includes(",")) {
          return colors.red("Only 1 SPL token must be passed at a time");
        }
        return true;
      },
    });

    const spinner = spin(`Fetching ${token.symbol} price`);
    const response: AxiosResponse<PriceFetchResult> = await axios.get(
      `https://price.jup.ag/v4/price?ids=${token.symbol}`
    );
    spinner.stop();

    if (response.status !== 200) {
      error(
        colors.red(
          "An error occurred while trying to fetch the SPL token's price"
        )
      );
      process.exit(1);
    }

    success(
      colors.green(`SHDW - ${response.data.data[token.symbol].price} USDC`)
    );
    process.exit(0);
  },
};

module.exports = command;
