import fetchAsSets from "./lib/fetchAsSets";
import extractASNs from "./lib/extractASNs";
import generatePrefixLists from "./lib/generatePrefixLists";
import { execSync } from "child_process";

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
}

main().catch((error) => {
  console.error("An error occurred:", error);
});
