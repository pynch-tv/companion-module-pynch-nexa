# companion-module-pynch-nexa

This module interacts with a [Pynch Nexa](https://github.com/pynch-tv/Nexa) REST API service, that in its turn talks to either a [EVS XT](https://evs.com/products/live-production-servers/xt-via)'s or [HyperDeck](https://www.blackmagicdesign.com/products/hyperdeckstudio/models)'s.

## Connection

Each connection manages a single audioVideoServer. When you have multiple devices that you want to control, make a new connection for each.

![Screenshot 2025-04-13 at 10 00 51](https://github.com/user-attachments/assets/2de30aef-c0b2-408f-b0d1-a9aca2f34ca7)

The module will automatically find the Nexa service through Bonjour. A manual option is also available. Use the same format as used in Bonjour: `<IPv4>:<Port>`

The server name needs to be entered manually (unfortunately a dropbox can't be filled with available servers for the moment). To find the available server, check your Nexa service Landing Page.

> Usage tip: manually change the Label to include the server name. Here: `nexa-a123456` (don't use spaces in the name)

## Buttons

### Load

![Screenshot 2025-04-13 at 10 04 10](https://github.com/user-attachments/assets/abb2c361-8d06-4d28-b563-49a5c3b4cb02)

Load a `clip` from the dropdown and loads it on the chosen `output` (PGM1).

### Status

![Screenshot 2025-04-13 at 10 04 17](https://github.com/user-attachments/assets/0c25abd2-502c-468b-8333-bece366d51d9)

Changes the the `status` of the chosen output (PGM1) : options are `Play`, `Stop` or `Pause`. 
