import fetchAsSets from "./lib/fetchAsSets";
import extractASNs from "./lib/extractASNs";
import generatePrefixLists from "./lib/generatePrefixLists";
import { execSync } from "child_process";

async function main() {
  let asns = extractASNs();

  for (const asn of asns) {
    const asSets = await fetchAsSets(asn);
    const prefixLists = generatePrefixLists(`${asn}`, asSets);

    const combinedPrefixLists = [...prefixLists.v4, ...prefixLists.v6];

    if (combinedPrefixLists.length > 0)
      combinedPrefixLists.forEach((ctx) => {
        if (ctx.startsWith("no")) return;
        execSync(`vtysh -c "conf t" -c "${ctx}" -c "end" -c "exit"`);
        console.log(`Adding ${ctx}`);
      });
  }
}

(async () => {
  await main();
})();
