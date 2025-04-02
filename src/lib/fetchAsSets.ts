import axios from "axios";

interface ASData {
  [key: string]: string;
}

interface ASResponse {
  data: ASData[];
  meta: Record<string, any>;
}

async function fetchASNSets(asn: number): Promise<string[]> {
  try {
    const response = await axios.get<ASResponse>(
      `https://www.peeringdb.com/api/as_set/${asn}`
    );

    // Check if we have valid data
    if (
      response.data.data &&
      Array.isArray(response.data.data) &&
      response.data.data.length > 0
    ) {
      const asSets: string[] = [];

      response.data.data.forEach((item: ASData) => {
        // Get the AS set value for this specific ASN key
        const asSetValue = item[asn.toString()];
        
        // Only add non-empty AS sets
        if (asSetValue && typeof asSetValue === "string" && asSetValue.trim() !== "") {
          asSets.push(asSetValue.trim());
        }
      });

      if (asSets.length > 0) {
        console.log(`AS-SET for AS${asn}:`, asSets);
        return asSets;
      } else {
        console.log(`No valid AS-SETs found for ASN ${asn}, using default.`);
        return [`AS${asn}`];
      }
    } else {
      console.log(`No AS-SET data found for ASN ${asn}, using default.`);
      return [`AS${asn}`];
    }
  } catch (error) {
    console.log(`Error fetching AS-SETs for ASN ${asn}: ${error.message}`);
    return [`AS${asn}`];
  }
}

export default fetchASNSets;
