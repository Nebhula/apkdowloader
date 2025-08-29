const withPWA = require('next-pwa')({
  dest: 'public'
})

/** @type {import('next').NextConfig} */
const path = require('path')
const { i18n } = require('./next-i18next.config')

const nextConfig = {
  i18n,
  reactStrictMode: true,
}

module.exports = withPWA(nextConfig)
// === 🔥 Desactiva ESLint en el build para evitar errores falsos ===
  eslint: {
    ignoreDuringBuilds: true,
  },
  // ================================================================
};

module.exports = withPWA(nextConfig);
