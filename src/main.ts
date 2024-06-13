import fetchAsSets from "./lib/fetchAsSets";
import extractASNs from "./lib/extractASNs";
import generatePrefixLists from "./lib/generatePrefixLists";
import { execSync } from "child_process";

let count = 1;
async function main() {
  let asns = extractASNs();

  for (const asn of asns) {
    const asSets = await fetchAsSets(asn);
    const prefixLists = generatePrefixLists(`${asn}`, asSets);

    const combinedPrefixLists = [...prefixLists.v4, ...prefixLists.v6];

    if (combinedPrefixLists.length > 0)
      combinedPrefixLists.forEach((ctx) => {
        execSync(`vtysh -c "conf t" -c "${ctx}" -c "end" -c "exit"`);
        console.log(`Adding ${ctx}`);
      });

    count++;
  }

  console.log(`Got to ${count}`);
}

(async () => {
  await main();
})();
