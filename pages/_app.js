import React from 'react'
import '@/styles/globals.css'
import Head from 'next/head'
import { mainData } from '@/lib/data'

import { appWithTranslation, useTranslation } from 'next-i18next';
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Footer, Navbar } from '@/components';
import { useRouter } from 'next/router';
import { GoogleAnalytics } from 'nextjs-google-analytics';

const App = ({ Component, pageProps }) => {
    const router = useRouter();
    const { locales, locale: activeLocal, defaultLocale } = router;

    const { t } = useTranslation()

    return (
        <>
            <GoogleAnalytics trackPageViews strategy="lazyOnload" />
            <NextUIProvider>
                <NextThemesProvider attribute="class" defaultTheme="dark">
                    <React.Fragment>
                        <Head>
                            <meta name="viewport" content="width=device-width, initial-scale=1" />
                            <link rel="shortcut icon" href={mainData.favicon.src} />
                            {locales.map((local, index) => (
                                <link key={index} rel="alternate" href={process.env.NEXT_PUBLIC_DOMAIN_URL + '/' + local} hreflang={local} />
                            ))}
                            <link rel="manifest" href="/manifest.json" />
                            <meta name="theme-color" content="#000000" />
                            <meta name="google-site-verification" content="_IqktHo6oIo2-k8jc95j-_drdPO8K-MK4KHTP4U9VnE" />
                        </Head>
                        {/* Navbar */}
                        <Navbar />

                        <Component {...pageProps} />

                        {/* Footer */}
                        <Footer websiteName={t("website_name")} />
                    </React.Fragment>
                </NextThemesProvider>
            </NextUIProvider>
        </>
    )
}


export default appWithTranslation(App)
