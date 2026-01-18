# ESPHome Designer

**A visual drag-and-drop editor for ESPHome displays (E-Ink, OLED, LCD, Touch), self-hosted via Docker.**

### Important Note:
* This Repo was downloaded from the original author of the *ESPHome Designer App*.
* I take **NO** credit for the design, nor do I provide any support for it.
* Please visit the original author's GitHub for the most recent versions, and for dedicated support: [koosoli - ESPHomeDesigner](https://github.com/koosoli/ESPHomeDesigner)

<br>

<div align="center">
  <a href="https://github.com/sponsors/koosoli">
    <img src="https://img.shields.io/badge/Sponsor-❤️-ff69b4?style=for-the-badge&logo=github-sponsors" alt="Sponsor Project">
  </a>
  <a href="https://buymeacoffee.com/koosoli">
    <img src="https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me a Coffee">
  </a>
  <br>
  <strong>If you find this project useful, consider <a href="https://github.com/sponsors/koosoli">supporting its development!</a></strong>
</div>

<div align="center">
  <a href="https://youtu.be/BLkzDYYQJcQ">
    <img src="https://img.youtube.com/vi/BLkzDYYQJcQ/maxresdefault.jpg" alt="Watch the v0.8.6 Feature Walkthrough" width="600">
  </a>
  <br>
  <a href="https://youtu.be/BLkzDYYQJcQ">
    <img src="https://img.shields.io/badge/YouTube-Watch%20v0.8.6%20Overview-red?style=for-the-badge&logo=youtube&logoColor=white" alt="Watch Video">
  </a>
  <br>
  <strong>Click to watch the latest feature walkthrough!</strong>
</div>

---

## What Does It Do?

Building a custom smart display for Home Assistant? Frustrated with manually writing C++ lambdas and guessing coordinates?

ESPHome Designer lets you build premium, touch-interactive dashboards for various ESP32-based devices (like the Seeed reTerminal, TRMNL, standard touch screens, and more) without writing a single line of display code.

- **Visual drag-and-drop editor** - Design layouts in your browser, see your actual HA entities update live on the canvas
  <p align="center"><img src="screenshots/draganddrop.gif" width="800" alt="Drag & Drop Editor"></p>
- **Multiple pages** - Navigate with hardware buttons, set different refresh rates per page
- **Auto-generates ESPHome config** - Clean, readable YAML that you can paste into your existing ESPHome setup
- **Round-trip editing** - Import existing ESPHome configs back into the editor
- **AI-Powered Dashboard Assistant** - Generate entire layouts or individual widgets from simple text prompts
- **Full device integration** - Exposes buttons, buzzer, temperature, humidity sensors back to HA for automations
- **Smart power management** - Battery monitoring, configurable refresh intervals, deep sleep support

**Use case:** Display a weather page when you wake up, switch to a sensor dashboard during the day, show a specific alert page when the doorbell rings - all automated through Home Assistant.

---

## Quick Start (Docker)

### 1. Deploy with Portainer

1. In Portainer, go to **Stacks** → **Add Stack**
2. Paste the following docker-compose configuration:

```yaml
version: '3.8'

services:
  esphome-designer:
    image: ghcr.io/spicylimes/esphome-designer:latest
    container_name: esphome-designer
    restart: unless-stopped
    ports:
      - "6054:80"
    environment:
      - HA_URL=${HA_URL:-}
      - HA_TOKEN=${HA_TOKEN:-}
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost/"]
      interval: 30s
      timeout: 3s
      retries: 3
```

3. Add environment variables for secure token storage:
   - `HA_URL` = `http://YOUR_HA_IP:8123`
   - `HA_TOKEN` = `your-long-lived-access-token`
4. Deploy the stack

Access the designer at `http://YOUR_DOCKER_HOST_IP:6054`

> **Note:** The Docker image is automatically built and published to GitHub Container Registry on every push to the main branch. Multi-architecture support (amd64/arm64) is included for compatibility with Raspberry Pi and other ARM devices.

### 2. Configure Home Assistant CORS

Add to your Home Assistant `configuration.yaml`:

```yaml
http:
  cors_allowed_origins:
    - http://YOUR_DOCKER_HOST_IP:6054
```

Restart Home Assistant after making this change.

### 3. Prepare Your ESPHome Device

**Important:** Copy the Material Design Icons font file first!

From this repo: `font_ttf/font_ttf/materialdesignicons-webfont.ttf`
To your ESPHome: `/config/esphome/fonts/materialdesignicons-webfont.ttf`

(Create the `fonts` folder if it doesn't exist)

Then create a new ESPHome device:

1. Create a new device in ESPHome Dashboard
2. Let ESPHome generate the base config (WiFi, API, OTA, etc.)
3. Configure the correct ESP platform for your device (instructions included in the generated YAML comments)

### 4. Design Your Dashboard

1. Open the designer at `http://YOUR_DOCKER_HOST_IP:6054`
2. Select your device type (E1001, E1002, TRMNL,...)
3. Drag widgets onto the canvas
4. Add your sensors, weather entities, icons, shapes
5. Create multiple pages with different refresh rates
6. **Live Preview**: Your YAML is generated on the fly as you design!
   <p align="center"><img src="screenshots/modern_canvas.gif" width="800" alt="Modern Canvas Interaction"></p>

### 5. Flash It

1. Copy the generated YAML snippet
2. Paste it below ESPHome's auto-generated sections in your device config
3. Compile and flash via ESPHome

Done! Your custom dashboard is now running on your device.

### 6. Connect & Automate

Once flashed, your device will come online.

1. Go to **Settings** → **Devices & Services** in Home Assistant.
2. Your device should be discovered (or you can add it via the ESPHome integration).
3. **Configure it** to ensure Home Assistant connects to its API.

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `HA_URL` | Your Home Assistant URL | `http://192.168.1.100:8123` |
| `HA_TOKEN` | Long-Lived Access Token from HA | `eyJ0eXAiOiJKV1Q...` |

To create a Long-Lived Access Token:
1. Go to your Home Assistant Profile
2. Scroll to **Long-Lived Access Tokens**
3. Click **Create Token**
4. Copy the token (it won't be shown again)

---

## Widget Types

- **Text & Sensor Text** - Static labels or live HA entity values with smart type detection and multiple formatting options
  <p align="center"><img src="screenshots/text_formatting.gif" width="700" alt="Rich Text Formatting"></p>
- **Icon & Weather Icon** - 360+ Material Design Icons or dynamic weather-state icons with full size/color control
  <p align="center"><img src="screenshots/icon_picker2.gif" width="700" alt="Icon Picker System"></p>
- **Date, Time & Calendar** - Customizable clock, date, and full monthly calendar views
- **Progress Bar & Battery** - Visual indicators for percentages and dynamic battery level tracking
- **Shapes & Rounded Rects** - Rectangles, circles, lines, and rounded rects with gray/dither support
- **Graph** - Advanced sensor history plotting with auto-scaling, grid lines, and X/Y axis labeling
- **Image & Online Image** - Static photos or dynamic URLs (weather maps, cameras) with auto-dithering
- **Quote / RSS Feed** - Inspirational quotes or external RSS feeds with auto-scaling and refresh logic
- **QR Code** - Dynamic QR generation for URLs or text with adjustable error correction
- **Touch Area** - Invisible or icon-labeled interactive zones to trigger HA actions (supports dual-state feedback)
  <p align="center"><img src="screenshots/touch_icons.gif" width="700" alt="Touch Interactive Icons"></p>
- **Weather Forecast** - Multi-day forecast display integrated with HA weather entities

## LVGL Support (Experimental)

**Highly Experimental - Expect Bugs!**

This tool includes experimental support for **LVGL (Light and Versatile Graphics Library)** widgets on LCD+Touch devices. LVGL enables interactive widgets like buttons, switches, sliders, and checkboxes that can control Home Assistant entities directly from the touchscreen.

### Important Notes

- **LCD+Touch devices only** - LVGL is designed for real-time displays, not e-paper
- **Entire page switches to LVGL mode** if you add any LVGL widget
- **High memory usage** - Requires ESP32-S3 with PSRAM
- **May be unstable** - This feature is under active development

### Available LVGL Widgets

- Buttons, Switches, Checkboxes, Sliders (interactive, can trigger HA actions)
- Arcs, Bars, Charts (display sensor values)
- Labels, Images, QR Codes, and more

For stable results, stick to **Native Mode** (standard widgets without LVGL prefix).

---

## Features

- **Visual Editor** - Drag-and-drop canvas with snap-to-grid, live entity state updates
- **AI-Powered Assistant** - Design entire dashboards using text prompts with support for Gemini, OpenAI, and OpenRouter
- **Secure API Storage** - AI keys are stored locally in your browser and never sent to the backend or included in exports
- **Layout Manager** - Manage multiple devices, export/import layouts as files
- **Entity Picker** - Browse and search your actual HA entities with real-time preview
- **Multi-Page Support** - Create up to 10 pages, each with custom refresh intervals
- **Page Management** - Drag & drop to reorder pages in the sidebar
- **Productivity Tools** - Copy/Paste (Ctrl+C/V), Undo/Redo (Ctrl+Z/Y), and Z-Index layering support
- **Canvas Controls** - Zoom in/out and recenter for precise editing
- **Dark Mode Option** - Toggle "Dark Mode" in device settings for black backgrounds
- **Hardware Integration** - Buttons, buzzer, temperature, humidity sensors exposed to HA
- **Smart Generator** - Produces clean, additive YAML that doesn't conflict with your base config
- **Live YAML Generation** - Your YAML is generated on the fly as you design
- **RGB Color Picker** - Precise color control for e-paper and LCD widgets
  <p align="center"><img src="screenshots/rgb_picker.gif" width="700" alt="RGB Color Picker"></p>
- **Round-Trip Editing** - Import existing ESPHome code back into the editor (now supports LVGL widgets!)
  <p align="center"><img src="screenshots/yaml_parsing.gif" width="700" alt="YAML Round-Trip Import"></p>
- **Power & Battery Management** - Monitoring, deep sleep support, and configurable refresh intervals
- **Modern Canvas Interaction** - Zoom with the mouse wheel and pan with the middle mouse button
- **Modular Hardware Profiles** - Support for loading hardware profiles from external YAML packages

---

## Hardware Support

**Currently Supported:**
- **Seeed Studio**: [reTerminal E1001](https://www.seeedstudio.com/reTerminal-E1001-p-6534.html) (BW), [reTerminal E1002](https://www.seeedstudio.com/reTerminal-E1002-p-6533.html) (Color), [TRMNL 7.5'' OG DIY Kit](https://www.seeedstudio.com/TRMNL-7-5-Inch-OG-DIY-Kit-p-6481.html) (S3)
- **Waveshare**: [PhotoPainter](https://www.waveshare.com/esp32-s3-photopainter.htm) (7-Color)
- **M5Stack**: [M5Paper](https://shop.m5stack.com/products/m5paper-esp32-development-kit-v1-1-960x540-4-7-eink-display-235-ppi) (Touch), [M5Stack M5Core Ink](https://shop.m5stack.com/products/m5stack-esp32-core-ink-development-kit1-54-elnk-display)
- **TRMNL**: Original [ESP32-C3 e-paper device](https://shop.usetrmnl.com/collections/devices/products/trmnl)

> [!IMPORTANT]
> All devices not explicitly listed above are **untested** and may require troubleshooting.

**Hardware Features Exposed:**
- 3 physical buttons (GPIO 3/4/5)
- RTTTL buzzer (GPIO 45)
- SHT4x temp/humidity sensor (I2C)
- Battery voltage monitoring (ADC GPIO1)
- WiFi signal strength

All exposed as Home Assistant entities for use in automations.

---

## Repository Structure

```
ESPHome-Designer/
├── docker/                          # Docker deployment files
│   ├── Dockerfile
│   ├── docker-compose.yaml
│   ├── nginx.conf
│   └── docker-entrypoint.sh
├── custom_components/
│   └── reterminal_dashboard/
│       ├── frontend/                # Web UI
│       │   ├── editor.html
│       │   ├── editor.css
│       │   ├── js/                  # JavaScript modules
│       │   └── hardware/            # Hardware profiles
│       ├── yaml_parser.py           # YAML import
│       └── ...
├── font_ttf/                        # Icon font for ESPHome
└── screenshots/                     # Documentation images
```

---

## Troubleshooting

**Font compilation error?**
- Make sure you copied `materialdesignicons-webfont.ttf` to `/config/esphome/fonts/`

**Display not updating?**
- Check `update_interval: never` in display config
- Verify buttons are wired to `component.update: epaper_display`

**Duplicate section errors?**
- The generator now produces a complete, standalone configuration including `psram`, `i2c`, etc.
- **Do not** use old hardware templates that define these sections. Rely on the generated code.

**Compilation Fails ("Killed signal" / Out of Memory)?**
If your Raspberry Pi crashes with `Killed signal terminated program`, it lacks the RAM for these fonts.

**Try this first:**
Add `compile_process_limit: 1` to your `esphome:` section in the YAML. This reduces memory usage but slows down compilation.

**If that fails, compile on your PC:**

1. **Install ESPHome**: Install Python, then run `pip install esphome` in your terminal.
2. **Setup Folder**: Create a folder like `C:\esphome_build` (**Important**: No spaces in the folder path!).
3. **Copy Files**: Copy your `reterminal.yaml` and the `fonts/` folder into that folder.
4. **Compile**: Run this command:
   ```powershell
   python -m esphome compile C:\esphome_build\reterminal.yaml
   ```
5. **Upload**: Take the generated .bin file and upload it via the Home Assistant ESPHome dashboard (Install -> Manual Download).

---

## License

Made with love - free and Open Source under the GPL 3.0 license.

<div align="center">

**If you find this project useful, consider supporting its development!**

[![Sponsor](https://img.shields.io/badge/Sponsor-❤️-ff69b4?style=for-the-badge&logo=github-sponsors)](https://github.com/sponsors/koosoli)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/koosoli)

</div>
