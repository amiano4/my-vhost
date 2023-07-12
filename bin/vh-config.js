import fs from "fs";
import regedit from "regedit";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const vhConfig = {
  configPath: function () {
    const currentFilePath = fileURLToPath(import.meta.url);
    const rootDirectory = dirname(currentFilePath);
    return join(rootDirectory, "v-host.json");
  },
  init: async function () {
    console.log("Check initialization of directory files");

    const path = this.configPath();
    const fileExists = await checkFileExists(path);

    if (fileExists) {
      const data = JSON.parse(fs.readFileSync(path, "utf8"));

      if (!data["xampp-directory"]) {
        await createConfig(path);
      }
    } else {
      await createConfig(path);
    }
  },
  getPath: function (key) {
    try {
      const data = JSON.parse(fs.readFileSync(this.configPath(), "utf8"));
      return data[key];
    } catch (err) {
      console.error("Unable to retreive key data");
      return false;
    }
  },
  addVirtualHost: function (alias, directory) {
    console.log(`Writing new virtual host configuration`);

    directory = directory.replaceAll("\\", "/");

    const content = `
<VirtualHost ${alias}>
    ServerName ${alias}
    ServerAlias www.${alias}
    DocumentRoot "${directory}"
    ##ErrorLog "logs/dummy-host2.example.com-error.log"
    ##CustomLog "logs/dummy-host2.example.com-access.log" common
  <Directory "${directory}">
    AllowOverride All
    Require all granted
  </Directory>
</VirtualHost>
\n`;

    // including new config file to the apache server
    fs.appendFile(this.getPath("vhost-conf"), content, (err) => {
      if (err) throw err;
      console.log(`Successfully added new virtual host to the server`);
    });
  },
};

function getXamppInstallationDirectory() {
  return new Promise((resolve, reject) => {
    const xamppRegistryKey = "HKLM\\SOFTWARE\\xampp";

    regedit.list(xamppRegistryKey, (error, result) => {
      if (error) {
        reject(error);
      } else {
        const installDir = result[xamppRegistryKey]["values"]["Install_Dir"];
        resolve(installDir["value"]);
      }
    });
  });
}

// Function to check if a file exists
function checkFileExists(filePath) {
  return new Promise((resolve, reject) => {
    fs.access(filePath, fs.constants.F_OK, (error) => {
      if (error) {
        resolve(false); // File does not exist
      } else {
        resolve(true); // File exists
      }
    });
  });
}

async function createConfig(path) {
  try {
    const directory = await getXamppInstallationDirectory();
    const content = JSON.stringify(
      {
        "xampp-directory": directory,
        "vhost-conf": directory + "\\apache\\conf\\my-vhost.conf",
      },
      null,
      2
    );

    // creating v-host.json
    fs.writeFile(path, content, "utf8", (error) => {
      if (error) {
        console.error("Error creating the file:", error);
        return;
      }

      console.log("My-vhost json config file created successfully");
    });

    const apacheConfDirectory = directory + "\\apache\\conf\\";

    // creating the my-vhost.conf inside the xampp directory
    fs.writeFile(apacheConfDirectory + "my-vhost.conf", "# my-vhost aliases\n", "utf8", (error) => {
      if (error) {
        console.error("Error creating the file:", error);
        return;
      }

      // including new config file to the apache server
      fs.appendFile(apacheConfDirectory + "httpd.conf", "\n# my-vhost config\nInclude conf/my-vhost.conf\n", (err) => {
        if (err) throw err;
      });

      console.log("Virtual Hosts configuration file has been set.");
    });
  } catch (err) {
    console.error(err);
  }
}

export default vhConfig;
