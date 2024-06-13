import { execSync } from "child_process";

interface PrefixLists {
  v4: string[];
  v6: string[];
}

function generatePrefixLists(asn: string, asSets: string[]): PrefixLists {
  const results: PrefixLists = { v4: [], v6: [] };

  asSets.forEach((asSet) => {
    const namingFormatV4 = `AS${asn}-In-v4`;
    const namingFormatV6 = `AS${asn}-In-v6`;

    const bgpq4IPv4Command = `bgpq4 ${asSet} -l ${namingFormatV4}`;
    const bgpq4IPv6Command = `bgpq4 -6 ${asSet} -l ${namingFormatV6}`;

    const resultIPv4 = execSync(bgpq4IPv4Command, { encoding: "utf-8" });
    const resultIPv6 = execSync(bgpq4IPv6Command, { encoding: "utf-8" });

    results.v4.push(...resultIPv4.trim().split("\n"));
    results.v6.push(...resultIPv6.trim().split("\n"));
  });

  return results;
}

export default generatePrefixLists;
