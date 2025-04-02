"use strict";

import fetchAsSets from "./lib/fetchAsSets";
import extractASNs from "./lib/extractASNs";
import generatePrefixLists from "./lib/generatePrefixLists";
import { execSync } from "child_process";

async function main() {
  let asns = extractASNs();
  console.log("ASNs:", asns);

  for (const asn of asns) {
    try {
      console.log(`Processing ASN ${asn}...`);
      let asSets = await fetchAsSets(asn);
      
      if (!asSets || asSets.length === 0) {
        console.log(`No AS-SETs found for ASN ${asn}, using default.`);
        asSets = [`AS${asn}`];
      }
      
      let prefixLists = generatePrefixLists(`${asn}`, asSets);
      let combinedPrefixLists = [...prefixLists.v4, ...prefixLists.v6];

      if (combinedPrefixLists.length > 0) {
        console.log(`Configuring ${combinedPrefixLists.length} prefix list entries for ASN ${asn}`);
        combinedPrefixLists.forEach((i) => {
          if (i.startsWith("no") || i.startsWith("!")) {
            console.log(i); // Just log comments and removal commands
          } else {
            try {
              execSync(`vtysh -c "conf t" -c "${i}" -c "end" -c "exit"`);
              console.log(`Added: ${i}`);
            } catch (err) {
              console.error(`Failed to add command: ${i}`);
              console.error(`Error: ${err.message}`);
            }
          }
        });
      } else {
        console.log(`No prefix list entries to add for ASN ${asn}`);
      }
    } catch (error) {
      console.error(`Failed to process ASN ${asn}: ${error.message}`);
    }
  }
  
  console.log("BGP filter configuration completed");
}

(async () => {
  await main().catch(error => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
})();
