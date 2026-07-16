# Zero Signal

Zero Signal is a self-contained browser FPS where the player enters a ten-combatant arena and fights to become the last survivor. It includes multiple operators, weapon loadouts, themed maps, pickups, grenades, and bots that move and fight independently.

**[Play Zero Signal](https://ganeevm.github.io/web-projects/zero-signal/)**

![Zero Signal loadout screen](https://ganeevm.github.io/assets/projects/zero-signal.png)

## About the game

I built Zero Signal to experiment with first-person rendering, game AI, weapon balancing, and responsive controls without using a game engine. The entire game runs in a desktop browser using HTML, CSS, JavaScript, and the Canvas API.

The objective is simple: enter the complex, eliminate the other nine combatants, and survive. There are no respawns.

## Features

- Offline single-player matches with nine AI-controlled opponents
- Bots that patrol, strafe, pursue targets, seek cover, and fight each other
- Enemy spawn points distributed throughout the map, including hidden corners
- Five operators with distinct visual styles
- Five primary weapon choices with different damage, fire rate, range, and ammunition
- Three maps with different layouts, colors, lighting, and sightlines
- Knife, bandages, grenades, ammunition, armor, and item pickups
- Shotgun pellet spread with individual pellet trails
- Visible grenade throwing, bouncing, and explosion effects
- Minimap, health, armor, ammunition, elimination counter, and kill feed
- Aim-down-sights, reloading, sprinting, crouching, and mouse-wheel gear selection

## Controls

| Input | Action |
| --- | --- |
| `W A S D` | Move |
| Mouse | Look around |
| Left mouse button | Fire or use selected gear |
| Right mouse button | Aim down sights |
| `Shift` | Sprint |
| `Ctrl` | Crouch / move slowly |
| `1` | Knife |
| `2` | Primary weapon |
| `3` | Bandage |
| `4` | Grenade |
| Mouse wheel | Cycle through gear |
| `R` | Reload |
| `E` | Pick up a nearby item |
| `Esc` | Release the mouse cursor |

After selecting an operator, weapon, and map, choose **Enter Lockdown**. Click the game screen if the mouse is not already captured.

## Weapons

| Weapon | Role |
| --- | --- |
| Assault Rifle | Balanced automatic weapon |
| Vector SMG | Fast fire rate for close-range fights |
| Pump Shotgun | Wide multi-pellet spread with high close-range damage |
| Heavy Pistol | Slower shots with strong single-hit damage |
| Rocket Launcher | Heavy weapon with limited ammunition |

## Maps

| Map | Style |
| --- | --- |
| Ironworks | Tight industrial corridors with teal lighting |
| Crossfire | Long lanes with a red furnace theme |
| Black Vault | Rooms, cover, and a blue vault theme |

## Technology

- HTML5
- CSS3
- Vanilla JavaScript
- Canvas 2D rendering
- Pointer Lock API
- No external libraries or game engine

## Run it locally

1. Download or clone this repository.
2. Open the game HTML file in a modern desktop browser.
3. Select a loadout and press **Enter Lockdown**.

No installation, build command, or server is required.

## Author

Created by **Ganeev Mujral**.

- GitHub: [@GaneevM](https://github.com/GaneevM)
- Email: [smganeev@gmail.com](mailto:smganeev@gmail.com)
