import fetchAsSets from "./lib/fetchAsSets";
import extractASNs from "./lib/extractASNs";
import generatePrefixLists from "./lib/generatePrefixLists";
import { execSync } from "child_process";

async function main() {
  let asns = extractASNs();
  let asSets = await fetchAsSets(asns);

  for (const asn of asns) {
    const prefixLists = generatePrefixLists(`${asn}`, asSets);

    const combinedPrefixLists = [...prefixLists.v4, ...prefixLists.v6];

    combinedPrefixLists.forEach((ctx) => {
      execSync(`vtysh -c "conf t" -c "${ctx}" -c "end" -c "exit"`);
      console.log(`Adding ${ctx}`);
    });
  }
}

main().catch((error) => {
  console.error("An error occurred:", error);
  process.exit(1);
});
