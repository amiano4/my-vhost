import fs from "fs";
import isAdmin from "is-admin";

const hostAlias = {
  path: "C:/Windows/System32/drivers/etc/hosts",
  set: async function (alias, ipAddress, comment) {
    // Check if the script is running with administrative privileges
    if (process.platform !== "win32" || !(await isAdmin())) {
      console.log("Please run this script with administrative privileges.");
      process.exit(1);
    }

    if (this.validateAliasName(alias)) {
      const content = (comment ? `\n# ${comment}` : ``) + `\n${ipAddress}\t\t${alias}\n`;

      // Append the host alias to the hosts file
      fs.appendFile(this.path, content, (err) => {
        if (err) throw err;
        console.log(`The host alias '${alias}' has been added to the hosts file.`);
      });
    }
  },
  validateAliasName: function (alias) {
    // Read file synchronously
    try {
      const data = fs.readFileSync(this.path, "utf8");

      // Split the file content into an array of lines
      const lines = data.split("\n");

      // Filter out lines that don't start with #
      const validAliases = lines.filter((line) => line.trim() !== "" && !line.trim().startsWith("#"));

      // validate
      validAliases.forEach((aliasRecord) => {
        aliasRecord = aliasRecord.split(/\s+/).slice(1).join(" ");

        if (aliasRecord.toLowerCase() == alias.toLowerCase()) {
          throw "The alias name provided has already exists";
        }
      });

      return true;
    } catch (err) {
      console.error(err);
    }
  },
};

export default hostAlias;
