"use strict";

import axios from "axios";

interface ASData {
  [key: string]: string;
}

interface ASResponse {
  data: ASData[];
}

async function fetchASNSets(asn: number): Promise<string[]> {
  try {
    const response = await axios.get<ASResponse>(`https://www.peeringdb.com/api/as_set/${asn}`);
    
    if (response.data.data && response.data.data.length > 0) {
      const asSets: Set<string> = new Set();

      response.data.data.forEach((item: ASData) => {
        Object.values(item).forEach((asSet) => {
          if (asSet !== "") {
            asSets.add(asSet);
          }
        });
      });

      const uniqueAsSets = Array.from(asSets);
      console.log(`AS-SET for AS${asn}:`, uniqueAsSets);
      return uniqueAsSets;
    } else {
      console.log(`No AS-SETs found for ASN ${asn}`);
      return [`${asn}`];
    }
  } catch (error) {
    console.error(`Error fetching AS-SETs for ASN ${asn}:`, error);
    return [`${asn}`];
  }
}

export default fetchASNSets;
