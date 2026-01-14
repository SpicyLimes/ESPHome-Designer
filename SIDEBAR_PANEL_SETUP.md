# Adding reTerminal Panel to Home Assistant Sidebar

If the "reTerminal" panel doesn't automatically appear in your Home Assistant sidebar after installing the integration, you can manually add it using one of these methods:

## Method 1: configuration.yaml (Recommended)

1. Open your Home Assistant `configuration.yaml` file
2. Add the following configuration:

```yaml
panel_iframe:
  reterminal:
    title: "reTerminal Designer"
    icon: mdi:monitor-dashboard
    url: /reterminal-dashboard
    require_admin: false
```

3. Restart Home Assistant
4. The "reTerminal Designer" panel should now appear in your sidebar

## Method 2: Direct URL Access

Simply navigate to:
```
http://your-homeassistant:8123/reterminal-dashboard
```

Replace `your-homeassistant` with your actual Home Assistant hostname or IP address.

## Editor Features

Once accessible, the editor provides:

- **Canvas**: Visual 800x480 drag-and-drop layout designer
- **Entity Picker**: Browse and select real Home Assistant entities
- **Live Preview**: See actual entity states updating every 30 seconds
- **Sensor Widgets**: 
  - Auto-populated labels from entity names
  - Separate font sizes for labels and values
  - Multiple display formats:
    - Value only (no label)
    - Label: Value (inline)
    - Label on top, value below
- **Property Editor**: Full control over positioning, sizing, colors, and formatting
- **Multi-Page Support**: Create multiple pages with individual refresh rates
- **YAML Generation**: Automatic ESPHome configuration snippet generation

## Troubleshooting

If you still don't see the panel:

1. Check Home Assistant logs for errors:
   ```
   Settings → System → Logs
   ```
   Look for messages containing `reterminal_dashboard`

2. Verify the integration is loaded:
   ```
   Settings → Devices & Services → Integrations
   ```
   Look for "reTerminal Dashboard Designer"

3. Try reloading the integration:
   - Go to Settings → Devices & Services
   - Find "reTerminal Dashboard Designer"
   - Click the 3-dot menu → Reload

4. Clear browser cache and refresh the page
