import { execSync } from "child_process";

interface PrefixLists {
  v4: string[];
  v6: string[];
}

function generatePrefixLists(
  asn: string,
  asSets: string[] | null
): PrefixLists {
  const results: PrefixLists = { v4: [], v6: [] };

  if (asSets)
    asSets.forEach((asSet: string) => {
      const namingFormatV4 = `AS${asn}-In-v4`;
      const namingFormatV6 = `AS${asn}-In-v6`;

      const bgpq4IPv4Command = `bgpq4 ${asSet} -l ${namingFormatV4}`;
      const bgpq4IPv6Command = `bgpq4 -6 ${asSet} -l ${namingFormatV6}`;

      const resultIPv4 = execSync(bgpq4IPv4Command, { encoding: "utf-8" });
      const resultIPv6 = execSync(bgpq4IPv6Command, { encoding: "utf-8" });

      const linesIPv4 = resultIPv4.trim().split("\n");
      const linesIPv6 = resultIPv6.trim().split("\n");

      for (let i = 0; i < linesIPv4.length; i++) {
        if (!results.v4.includes(linesIPv4[i])) results.v4.push(linesIPv4[i]);
      }

      for (let i = 0; i < linesIPv6.length; i++) {
        if (!results.v6.includes(linesIPv6[i])) results.v6.push(linesIPv6[i]);
      }
    });

  return results;
}

export default generatePrefixLists;
