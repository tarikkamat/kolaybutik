import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { useI18n } from '@/i18n';

export function FaqSection() {
    const { t } = useI18n();

    const faqItems = [
        {
            id: 'item-1',
            question: t('landing.faq.q1'),
            answer: t('landing.faq.a1'),
        },
        {
            id: 'item-2',
            question: t('landing.faq.q2'),
            answer: t('landing.faq.a2'),
        },
        {
            id: 'item-3',
            question: t('landing.faq.q3'),
            answer: t('landing.faq.a3'),
        },
        {
            id: 'item-4',
            question: t('landing.faq.q4'),
            answer: t('landing.faq.a4'),
        },
        {
            id: 'item-5',
            question: t('landing.faq.q5'),
            answer: t('landing.faq.a5'),
        },
        {
            id: 'item-6',
            question: t('landing.faq.q6'),
            answer: t('landing.faq.a6'),
        },
        {
            id: 'item-7',
            question: t('landing.faq.q7'),
            answer: t('landing.faq.a7'),
        },
    ];

    return (
        <section className="px-4 py-20">
            <div className="mx-auto max-w-3xl">
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
                        {t('landing.faq.title')}
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        {t('landing.faq.subtitle')}
                    </p>
                </div>

                <Accordion type="single" collapsible className="w-full">
                    {faqItems.map((item) => (
                        <AccordionItem key={item.id} value={item.id}>
                            <AccordionTrigger className="text-left text-slate-900 dark:text-white">
                                {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-slate-600 dark:text-slate-400">
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                    <AccordionItem value="item-8">
                        <AccordionTrigger className="text-left text-slate-900 dark:text-white">
                            {t('landing.faq.q8')}
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-600 dark:text-slate-400">
                            {t('landing.faq.a8a')}{' '}
                            <a
                                href="https://docs.iyzico.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:underline dark:text-indigo-400"
                            >
                                docs.iyzico.com
                            </a>{' '}
                            {t('landing.faq.a8b')}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </section>
    );
}
