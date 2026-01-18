#!/bin/sh
set -e

# Generate config.js with environment variables
# This allows HA URL and token to be set via Portainer environment variables
cat > /usr/share/nginx/html/config.js << EOF
// Auto-generated configuration from environment variables
// This file is regenerated on container startup
window.ESPHOME_DESIGNER_CONFIG = {
    HA_URL: "${HA_URL:-}",
    HA_TOKEN: "${HA_TOKEN:-}"
};
EOF

echo "Generated config.js with HA_URL=${HA_URL:+[SET]} HA_TOKEN=${HA_TOKEN:+[SET]}"

# Execute the main command (nginx)
exec "$@"
