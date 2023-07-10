import fs from "fs";
import isAdmin from "is-admin";

const hostAlias = {
  path: "C:/Windows/System32/drivers/etc/hosts",
  set: async function (alias, ipAddress) {
    // Check if the script is running with administrative privileges
    if (process.platform !== "win32" || !(await isAdmin())) {
      console.log("Please run this script with administrative privileges.");
      process.exit(1);
    }

    // Append the host alias to the hosts file
    fs.appendFile(this.path, `\n${ipAddress}\t\t${alias}\n`, (err) => {
      if (err) throw err;
      console.log(`The host alias '${alias}' has been added to the hosts file.`);
    });
  },
};

export default hostAlias;
