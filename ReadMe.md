## FRR Prefix List Updater

This project will update BGP prefix lists based on the peer ASN output on the FRR bgp summary command.

It essentially does the following:

- Gets all bgp neighbors dynamically
- Polls peeringdb api for as-set listed
  - If an ASN is on an ignore list (like IXP asns, transit, etc-- things that don't need specific filters) it will ignore it.
- Generates prefix lists from the as-set.
  - The naming format is AS00000-In-v4 or AS00000-In-v6. Your route maps will need to reflect this.

You can run this on a cronjob, daily, weekly, whatever. It saves it into the running config so you can default back to your orignal frr config by reloading it at any time.
