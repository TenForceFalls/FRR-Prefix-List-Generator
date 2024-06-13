import { execSync } from "child_process";
import { ingoreList } from "../../config";

function extractASNs(): number[] {
  const asNumbers: number[] = [];

  try {
    const commandOutput = execSync("sudo vtysh -c 'sh bgp su'").toString();
    const lines = commandOutput.split("\n");

    for (let i = 6; i < lines.length; i++) {
      const columns = lines[i].trim().split(/\s+/);
      const AS = parseInt(columns[2]);

      if (!ingoreList.includes(AS) && !asNumbers.includes(AS)) {
        if (!isNaN(AS)) asNumbers.push(AS);
      }
    }

    console.log("AS Numbers:", asNumbers);
  } catch (error) {
    console.error("Error executing BGP command:", error);
  }

  return asNumbers;
}

export default extractASNs;
