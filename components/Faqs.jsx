import React from 'react';
import { Accordion, AccordionItem } from "@nextui-org/react";
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

const Faqs = () => {
    const router = useRouter();
    const { locales, locale: activeLocal, defaultLocale } = router;

    // Dynamically import the correct common.json file based on the active locale
    const common = require(`@/public/locales/${activeLocal}/common.json`);

    const { t } = useTranslation('common');

    // Check if there are any FAQs present
    const hasFaqs = common.faqs.length > 0;

    return (
        <>
            {hasFaqs && (
                <div className="max-w-4xl px-4 sm:px-6 lg:px-8 mx-auto">
                    <Accordion variant="shadow">
                        {common.faqs.map((faq, index) => (
                            <AccordionItem key={index} aria-label={`Accordion ${index + 1}`} title={t(faq.title)}>
                                {t(faq.content)}
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            )}
        </>
    )
}

export default Faqs;
