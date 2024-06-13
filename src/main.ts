import fetchAsSets from "./lib/fetchAsSets";
import extractASNs from "./lib/extractASNs";
import generatePrefixLists from "./lib/generatePrefixLists";
import { execSync } from "child_process";

let v4Done = false;
let v6Done = false;

async function main() {
  let asns = extractASNs();

  for (const asn of asns) {
    const asSets = await fetchAsSets(`${asn}`);
    const prefixLists = generatePrefixLists(`${asn}`, asSets);

    prefixLists.v4.forEach((ctx) => {
      execSync(`vtysh -c "conf t" -c "${ctx}" -c "end" -c "exit"`);
      console.log(`Adding ${ctx}`);
    });

    prefixLists.v6.forEach((ctx) => {
      execSync(`vtysh -c "conf t" -c "${ctx}" -c "end" -c "exit"`);
      console.log(`Adding ${ctx}`);
    });
  }

  v4Done = true;
  v6Done = true;
}

main().catch((error) => {
  console.error("An error occurred:", error);

  if (v4Done) console.log("v4 prefixes added successfully");
  if (v6Done) console.log("v6 prefixes added successfully");

  if (v4Done && v6Done) process.exit(1);
});
