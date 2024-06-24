"use strict";

import { execSync } from "child_process";

interface PrefixLists {
  v4: string[];
  v6: string[];
}

function generatePrefixLists(asn: string, asSets: string[]): PrefixLists {
  const results: PrefixLists = { v4: [], v6: [] };

  if (asSets && asSets.length > 0) {
    asSets.forEach((asSet: string) => {
      const namingFormatV4 = `AS${asn}-In-v4`;
      const namingFormatV6 = `AS${asn}-In-v6`;

      const bgpq4IPv4Command = `bgpq4 ${asSet} -l ${namingFormatV4} -S RPKI,AFRINIC,ARIN,APNIC,LACNIC,RIPE`;
      const bgpq4IPv6Command = `bgpq4 -6 ${asSet} -l ${namingFormatV6} -S RPKI,AFRINIC,ARIN,APNIC,LACNIC,RIPE`;

      const resultIPv4 = execSync(bgpq4IPv4Command, { encoding: "utf-8" }).trim();
      const resultIPv6 = execSync(bgpq4IPv6Command, { encoding: "utf-8" }).trim();

      const linesIPv4 = resultIPv4.split("\n");
      const linesIPv6 = resultIPv6.split("\n");

      linesIPv4.forEach(line => {
        if (!results.v4.includes(line)) {
          results.v4.push(line);
        }
      });

      linesIPv6.forEach(line => {
        if (!results.v6.includes(line)) {
          results.v6.push(line);
        }
      });
    });
  }

  return results;
}

export default generatePrefixLists;
