# companion-module-pynch-nexa

See [HELP.md](./companion/HELP.md) and [LICENSE](./LICENSE)

This module interacts with a Pynch Nexa REST API service, that in its turn talks to either a [EVS XT](https://evs.com/products/live-production-servers/xt-via)'s or [HyperDeck](https://www.blackmagicdesign.com/products/hyperdeckstudio/models)'s.

## Connection

Each connection manages a single audioVideoServer. When you have multiple devices that you want to control, make a new connection for each.

![Screenshot 2025-04-13 at 09 44 03](https://github.com/user-attachments/assets/f094ba84-2042-45d9-b304-4c92a52e87d0)

The module will automatically find the Nexa service through Bonjour. A manual option is also available. Use the same format as used in Bonjour: `<IPv4>:<Port>`

The server name needs to be entered manually (unfortunately a dropbox can't be filled with available servers for the moment). To find the available server, check your Nexa service Landing Page.

## Buttons

### Load

![Screenshot 2025-04-13 at 09 35 55](https://github.com/user-attachments/assets/55d5fcf2-680f-4f45-a88c-ac21f74b2ba1)

Load a clip from the dropdown and loads it on the chosen output (PGM1).

### Status

![Screenshot 2025-04-13 at 09 47 18](https://github.com/user-attachments/assets/71a7ee48-7550-424e-baef-5c94d6685b6f)

Changes the the status of the chosen output (PGM1) : options are `Play`, `Stop` or `Pause`. 

## Pynch Nexa
A unified REST API on top of specfic vendor's protocols. Each protocol is implemented in a Nexa PlugIn that is loaded at runtime
