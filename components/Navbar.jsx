import React from 'react'
import { Navbar as NavbarComponent, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@nextui-org/react";
import { LangSwitcher, Logo, ThemeSwitcher } from '.';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
    const router = useRouter();
    const { locales, locale: activeLocal, defaultLocale } = router;

    let common;
    try {
        // Dynamically import the correct common.json file based on the active locale
        common = require(`@/public/locales/${activeLocal}/common.json`);
    } catch (error) {
        console.error("Error importing common.json:", error);
        common = {};
    }

    const { t } = useTranslation('common');

    // Check if there are any NavLinks present
    const hasLinks = common.navlinks && common.navlinks.length > 0;

    return (
        <NavbarComponent shouldHideOnScroll>
            <NavbarBrand>
                <Logo websiteName={common.website_name} />
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                {hasLinks && (
                    <>
                        {common.navlinks.map((link, index) => (
                            <NavbarItem key={index}>
                                <Link color="foreground" href={t(link.href)}>
                                    {t(link.title)}
                                </Link>
                            </NavbarItem>
                        ))}
                    </>
                )}
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem>
                    <ThemeSwitcher />
                </NavbarItem>
                <NavbarItem>
                    <LangSwitcher />
                </NavbarItem>
            </NavbarContent>
        </NavbarComponent>
    )
}

export default Navbar