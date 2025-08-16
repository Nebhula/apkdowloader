const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL;
const nextI18NextConfig = require('./next-i18next.config.js');
const { locales } = nextI18NextConfig.i18n;

module.exports = {
    siteUrl,
    exclude: ["/404"],
    generateRobotsTxt: true,
    robotsTxtOptions: {
        policies: [
            {
                userAgent: "*",
                disallow: ["/404"],
            },
            { userAgent: "*", allow: "/" },
        ]
    },
    alternateRefs: locales.map(locale => ({
        href: `${siteUrl}/${locale}`,
        hrefLang: locale
    }))
};
