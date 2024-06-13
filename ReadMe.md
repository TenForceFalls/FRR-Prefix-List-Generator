# FRR Prefix List Generator

Made with love by [AS393577](https://tritan.gg) <3

## Overview

This project will generate BGP prefix lists, it pulls ASN from the output on the FRR bgp summary command then fetches their AS-SETs. Following this, it builds filters based on as-sets and adds them to the running config.

It essentially does the following:

- Gets all bgp neighbors dynamically
- Polls peeringdb api for as-set listed
  - If an ASN is on an ignore list (like IXP asns, transit, etc-- things that don't need specific filters) it will ignore it.
- Generates prefix lists from the as-set via bgpq4.
  - The naming format for prefix lists are as follow: `AS00000-In-v4` or `AS00000-In-v6`. Your route maps for the neighbors will need to reflect this.

You can run this on a cronjob, daily, weekly, whatever. It saves it into the running config so you can default back to your orignal frr config by reloading it at any time.

## Deps

You'll need to install the following on the linux box:
bgpq4, bun runtime (or compile to js and use node)

## Running in Dev

- With Bun installed, run `bun install` to get packages.
- Run `bun dev` to start the script.

## Running w/ Cronjob

- Run `which bun` to get the executable of bun.
- Create a cronjob as root: `crontab -u root -E`
- Start using bun in the crontab, this example is every day at 00:00: `0 0 * * * /root/.nvm/versions/node/v20.14.0/bin/bun run /root/folder/src/main.ts`

Or alternatively, compile the ts to js and use node as the runtime.

## Contributing

Any contributions are welcome, feel free to submit a pull request. This was made in literally under a few hours while I was at work lol.
