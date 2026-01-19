/**
 * Gets the container-injected environment configuration.
 * This is set by docker-entrypoint.sh when running in Docker.
 * @returns {Object|null} The config object or null if not running in Docker.
 */
function getEnvConfig() {
    if (window.ESPHOME_DESIGNER_CONFIG) {
        return window.ESPHOME_DESIGNER_CONFIG;
    }
    return null;
}

/**
 * Detects if running embedded within Home Assistant (custom component mode).
 * @returns {boolean} True if embedded in HA, false if standalone/Docker mode.
 */
function isEmbeddedInHA() {
    try {
        const loc = window.location;
        if (loc.protocol === "file:") {
            return false;
        }
        return (
            loc.hostname === "homeassistant" ||
            loc.hostname === "hassio" ||
            loc.pathname.includes("/api/") ||
            loc.pathname.includes("/local/") ||
            loc.pathname.includes("/hacsfiles/") ||
            loc.pathname.includes("/reterminal-dashboard")
        );
    } catch (e) {
        return false;
    }
}

// Track the running mode globally
let HA_STANDALONE_MODE = false;

/**
 * Normalizes a URL by ensuring it has a protocol and removing trailing slashes/api paths.
 * @param {string} url - The URL to normalize.
 * @returns {string} The normalized URL.
 */
function normalizeHaUrl(url) {
    if (!url) return url;
    let normalized = url.trim();

    // Add http:// if no protocol specified
    if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
        normalized = `http://${normalized}`;
    }

    // Remove trailing slash
    if (normalized.endsWith('/')) {
        normalized = normalized.slice(0, -1);
    }

    // Remove any /api suffix if user accidentally included it
    normalized = normalized.replace(/\/api(\/.*)?$/, '');

    return normalized;
}

/**
 * Gets the base HA URL (without API path suffix).
 * @returns {string|null} The base URL or null.
 */
function getHaBaseUrl() {
    // Check for container-injected config first (Docker deployment)
    const envConfig = getEnvConfig();
    if (envConfig && envConfig.HA_URL) {
        return normalizeHaUrl(envConfig.HA_URL);
    }

    // Check localStorage
    const storedUrl = localStorage.getItem('ha_base_url');
    if (storedUrl) {
        return normalizeHaUrl(storedUrl);
    }

    // Legacy: check old format
    const legacyUrl = localStorage.getItem('ha_manual_url');
    if (legacyUrl) {
        return normalizeHaUrl(legacyUrl);
    }

    return null;
}

/**
 * Detects the Home Assistant backend URL.
 * In embedded mode: Returns custom component API base.
 * In standalone mode: Returns the configured HA base URL.
 * @returns {string|null} The API base URL or null.
 */
function detectHaBackendBaseUrl() {
    // If embedded in HA, use the custom component API
    if (isEmbeddedInHA()) {
        HA_STANDALONE_MODE = false;
        return `${window.location.origin}/api/reterminal_dashboard`;
    }

    // Standalone mode: use configured HA URL with native API
    const baseUrl = getHaBaseUrl();
    if (baseUrl) {
        HA_STANDALONE_MODE = true;
        // Return just the base URL - API paths will be constructed per-call
        return baseUrl;
    }

    return null;
}

/**
 * Checks if running in standalone mode (Docker/external) vs embedded in HA.
 * @returns {boolean} True if standalone mode.
 */
function isStandaloneMode() {
    return HA_STANDALONE_MODE;
}

/**
 * Gets the manual HA URL from localStorage or environment config.
 * Environment config (from Docker) takes precedence over localStorage.
 * @returns {string|null}
 */
function getHaManualUrl() {
    return getHaBaseUrl();
}

/**
 * Sets the manual HA URL in localStorage.
 * @param {string|null} url
 */
function setHaManualUrl(url) {
    try {
        if (url) {
            let sanitizedUrl = url.trim();
            // Remove trailing slash if present
            if (sanitizedUrl.endsWith('/')) {
                sanitizedUrl = sanitizedUrl.slice(0, -1);
            }
            // Remove any /api suffix - we store just the base URL now
            sanitizedUrl = sanitizedUrl.replace(/\/api(\/.*)?$/, '');

            localStorage.setItem('ha_base_url', sanitizedUrl);
            // Also set legacy key for backwards compat
            localStorage.setItem('ha_manual_url', sanitizedUrl);
        } else {
            localStorage.removeItem('ha_base_url');
            localStorage.removeItem('ha_manual_url');
        }
    } catch (e) {
        console.error("Failed to save HA URL:", e);
    }
}

/**
 * Gets the HA Long-Lived Access Token from localStorage or environment config.
 * Environment config (from Docker) takes precedence over localStorage.
 * @returns {string|null}
 */
function getHaToken() {
    try {
        // Check for container-injected config first (Docker deployment)
        const envConfig = getEnvConfig();
        if (envConfig && envConfig.HA_TOKEN) {
            return envConfig.HA_TOKEN;
        }
        return localStorage.getItem('ha_llat_token');
    } catch (e) {
        return null;
    }
}

/**
 * Sets the HA Long-Lived Access Token in localStorage.
 * @param {string|null} token 
 */
function setHaToken(token) {
    try {
        if (token) {
            localStorage.setItem('ha_llat_token', token);
        } else {
            localStorage.removeItem('ha_llat_token');
        }
    } catch (e) {
        console.error("Failed to save HA Token:", e);
    }
}

let HA_API_BASE = detectHaBackendBaseUrl();

/**
 * Re-detects the HA backend URL (e.g. after settings change).
 */
function refreshHaBaseUrl() {
    HA_API_BASE = detectHaBackendBaseUrl();
}

/**
 * Checks if the HA backend is available.
 * @returns {boolean}
 */
function hasHaBackend() {
    return !!HA_API_BASE;
}
