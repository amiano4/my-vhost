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
    const path = this.configPath();
    const fileExists = await checkFileExists(path);

    if (fileExists) {
      const data = JSON.parse(fs.readFileSync(this.configPath, "utf8"));

      if (!data["xampp-directory"]) {
        await createConfig(path);
      }
    } else {
      await createConfig(path);
    }
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
  const directory = await getXamppInstallationDirectory();
  const content = JSON.stringify(
    {
      "xampp-directory": directory,
    },
    null,
    2
  );

  fs.writeFile(path, content, "utf8", (error) => {
    if (error) {
      console.error("Error creating the file:", error);
      return;
    }

    console.log("My-vhost json config file created successfully");
  });
}

export default vhConfig;
