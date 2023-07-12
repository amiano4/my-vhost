#!/usr/bin/env node

import chalk from "chalk";
import boxen from "boxen";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import figlet from "figlet";
import hostAlias from "./host-alias.js";
import vhConfig from "./vh-config.js";

console.log(chalk.red(figlet.textSync("my-vhost", { horizontalLayout: "full" })), "\n");

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
  .option("c", { alias: "comment", describe: "Additional comment (optional)", type: "string", demandOption: false })
  .help(true)
  .showHelpOnFail(true)
  .parseSync();

try {
  const host = argv.h || argv.host || "127.0.0.1";
  const alias = argv.a || argv.alias;
  const directory = argv.d || argv.dir;
  const comment = argv.c || argv.comment;

  // validate ip
  if (validateIPAddress(host)) {
    vhConfig.init().then(async () => {
      await hostAlias.set(alias, host, comment);
      vhConfig.addVirtualHost(alias, directory);
    });
  }
} catch (err) {
  console.error(err);
}

function validateIPAddress(ip) {
  // Regular expression to validate IP address format
  const ipRegex = /^([0-9]{1,3}\.){3}[0-9]{1,3}$/;

  if (!ipRegex.test(ip)) {
    throw new Error("Invalid IP address format");
  }

  return ip;
}
