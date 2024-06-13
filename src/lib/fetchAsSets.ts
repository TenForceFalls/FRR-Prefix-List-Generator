import axios from "axios";

interface ASData {
  [key: string]: string;
}

interface ASResponse {
  data: ASData[];
}

async function fetchASNSets(asns: number[]): Promise<string[]> {
  try {
    const promises = asns.map(async (asn) => {
      const response = await axios.get<ASResponse>(
        `https://www.peeringdb.com/api/as_set/${asn}`
      );

      const asSets: string[] = [];

      response.data.data.forEach((item: ASData) => {
        Object.values(item).forEach((value: string) => {
          if (value || value !== "") asSets.push(value);
        });
      });

      return asSets;
    });

    const allASNSets = await Promise.all(promises);

    console.log("AS-Sets:", allASNSets);

    return allASNSets.flat();
  } catch (error) {
    console.error("Error fetching AS-SETs:", error);
    return [];
  }
}

export default fetchASNSets;
