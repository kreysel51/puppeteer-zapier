#!/usr/bin/env bash

# Tell Render where to cache Puppeteer files
export PUPPETEER_CACHE_DIR="/opt/render/.cache/puppeteer"

# Trigger Puppeteer's browser install (installs Chromium)
npx puppeteer browsers install chrome
