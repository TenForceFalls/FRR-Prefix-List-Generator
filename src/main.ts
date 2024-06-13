import fetchAsSets from "./lib/fetchAsSets";
import extractASNs from "./lib/extractASNs";
import generatePrefixLists from "./lib/generatePrefixLists";
import { execSync } from "child_process";

async function main() {
  let asns = extractASNs();

  for (const asn of asns) {
    let asSets = await fetchAsSets(asn);
    let prefixLists = generatePrefixLists(`${asn}`, asSets);

    let combinedPrefixLists = [...prefixLists.v4, ...prefixLists.v6];

    if (combinedPrefixLists.length > 0)
      combinedPrefixLists.forEach((i) => {
        // yell at people with inaccurate peeringdb data to fix it and then remove this, itll keep the script from overwriting the prefix list with an empty one
        if (i.startsWith("no")) return;

        execSync(`vtysh -c "conf t" -c "${i}" -c "end" -c "exit"`);

        console.log(`Adding ${i}`);
      });
  }
}

(async () => {
  await main();
})();
