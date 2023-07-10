#!/usr/bin/env node

import chalk from "chalk";
import boxen from "boxen";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import figlet from "figlet";

console.log(chalk.red(figlet.textSync("my-vhost", { horizontalLayout: "full" })));

const usage = "\nUsage: my-vhost [-h <host>] -a <alias> -d <dir> \n";

const argv = yargs(hideBin(process.argv))
  .usage(usage)
  .option("h", { alias: "host", describe: "Host IP address (default: 127.0.0.1)", type: "string", demandOption: false })
  .option("a", { alias: "alias", describe: "Alias name", type: "string", demandOption: true })
  .option("d", { alias: "dir", describe: "Root directory to be hosted", type: "string", demandOption: true })
  .help(true)
  .showHelpOnFail(true)
  .parseSync();

if (argv.language == null && argv.l == null) {
  console.log(chalk.red(figlet.textSync("my-vhost", { horizontalLayout: "full" })));
  // yargs.showHelp();
  process.exit();
}

if (argv.sentence == null && argv.s == null) {
  // yargs.showHelp();
  process.exit();
}

const language = argv.l || argv.language;
const sentence = argv.s || argv.sentence;
