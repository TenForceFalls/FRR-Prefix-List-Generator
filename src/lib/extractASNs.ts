"use strict";

import { execSync } from "child_process";
import { ignoreList } from "../../config";

function isValidASN(asn: number): boolean {
  return (asn >= 1 && asn <= 65534) || (asn >= 131072 && asn <= 4294967294);
}

function extractASNs(): number[] {
  const asNumbers: Set<number> = new Set();

  try {
    const commandOutput = execSync("sudo vtysh -c 'sh bgp su'", { encoding: "utf-8" });
    const lines = commandOutput.trim().split("\n");

    for (let i = 6; i < lines.length; i++) {
      const columns = lines[i].trim().split(/\s+/);

      if (columns.length >= 3) {
        const AS = parseInt(match[1], 10);

        if (!isNaN(AS) && isValidASN(AS) && !ignoreList.includes(AS) && !asNumbers.has(AS)) {
          asNumbers.add(AS);
        }
      }
    }

    console.log(`ASNs:`, Array.from(asNumbers));
  } catch (error) {
    console.error("Error executing BGP command:", error);
  }

  return Array.from(asNumbers);
}

export default extractASNs;
