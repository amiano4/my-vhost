#!/usr/bin/env node

import chalk from "chalk";
import boxen from "boxen";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import figlet from "figlet";
import hostAlias from "./host-alias";

console.log(chalk.red(figlet.textSync("my-vhost", { horizontalLayout: "full" })));

const usage = "\nUsage: my-vhost [-h <host>] -a <alias> -d <dir> \n";

const argv = yargs(hideBin(process.argv))
  .usage(usage)
  .option("<h>", {
    alias: "host",
    describe: "Host IP address (default: 127.0.0.1)",
    type: "string",
    demandOption: false,
    coerce: validateIPAddress,
  })
  .option("a", { alias: "alias", describe: "Alias name", type: "string", demandOption: true })
  .option("d", { alias: "dir", describe: "Root directory to be hosted", type: "string", demandOption: true })
  .help(true)
  .showHelpOnFail(true)
  .parseSync();

// if (argv.alias == null && argv.a == null) {
//   console.log(chalk.red(figlet.textSync("my-vhost", { horizontalLayout: "full" })));
//   console.log("Alias name (DNS alias sample) is required");
//   process.exit();
// }

// if (argv.dir == null && argv.d == null) {
//   console.log(chalk.red(figlet.textSync("my-vhost", { horizontalLayout: "full" })));
//   console.log("Please add the root directory to be hosted");
//   process.exit();
// }

const host = argv.h || argv.host;
const alias = argv.a || argv.alias;
const directory = argv.d || argv.dir;

// validate ip
validateIPAddress(host);

function validateIPAddress(ip) {
  // Regular expression to validate IP address format
  const ipRegex = /^([0-9]{1,3}\.){3}[0-9]{1,3}$/;

  if (!ipRegex.test(ip)) {
    throw new Error("Invalid IP address format");
  }

  return ip;
}
