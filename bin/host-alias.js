const fs = require("fs");

const hostAlias = {
  path: "C:/Windows/System32/drivers/etc/hosts",
  set: function (alias, ipAddress) {
    // Check if the script is running with administrative privileges
    if (process.platform !== "win32" || process.getuid() !== 0) {
      console.log("Please run this script with administrative privileges.");
      process.exit(1);
    }

    // Append the host alias to the hosts file
    fs.appendFile(this.path, `${ipAddress}\t\t${alias}\n`, (err) => {
      if (err) throw err;
      console.log(`The host alias '${hostAlias}' has been added to the hosts file.`);
    });
  },
};

export default hostAlias;
