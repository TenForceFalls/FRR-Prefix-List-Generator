import axios from "axios";

interface ASData {
  [key: string]: string;
}

interface ASResponse {
  data: ASData[];
}

async function fetchASNSets(asn: string): Promise<string[]> {
  try {
    const response = await axios.get<ASResponse>(
      `https://www.peeringdb.com/api/as_set/${asn}`
    );

    const asSets: string[] = [];

    response.data.data.forEach((item: ASData) => {
      Object.values(item).forEach((asSet: string) => {
        asSets.push(asSet);
      });
    });

    return asSets;
  } catch (error) {
    console.error(`Error fetching AS-SETs for ASN ${asn}:`, error);
    return [];
  }
}

export default fetchASNSets;
