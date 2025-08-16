import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react'
import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import "/node_modules/flag-icons/css/flag-icons.min.css";
import { locales } from '@/lib/data';

const LangSwitcher = () => {
    const router = useRouter();
    const { locale: activeLocal, defaultLocale } = router;

    const activeLang = locales.find(lang => lang.lang === activeLocal);

    const handleLanguageChange = (lang) => {
        router.push(router.pathname, router.pathname, { locale: lang });
    };

    const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";

    useEffect(() => {
        // Update the dir attribute of the HTML tag based on the active locale
        document.documentElement.dir = activeLocal === 'ar' ? 'rtl' : 'ltr';
    }, [activeLocal]);

    return (
        <Dropdown>
            <DropdownTrigger>
                <Button
                    variant="faded"
                >
                    <span className={`fi fi-${activeLang.flagCode.toLowerCase()}`}></span>
                    {activeLang.name}
                </Button>
            </DropdownTrigger>
            <DropdownMenu variant="faded" aria-label="Dropdown menu with icons">
                {locales.map((local, index) => (
                    <DropdownItem
                        key={index}
                        onClick={() => handleLanguageChange(local.lang)}
                        startContent={<span className={`fi fi-${local.flagCode.toLowerCase()}`}></span>}
                    >
                        {local.name}
                    </DropdownItem>
                ))}
            </DropdownMenu>
        </Dropdown>
    )
}

export default LangSwitcher