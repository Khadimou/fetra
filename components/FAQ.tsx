"use client";
import { useState } from "react";
import { useTranslations } from 'next-intl';

type FAQItem = {
  question: string;
  answer: string;
};

export default function FAQ() {
  const t = useTranslations('FAQ');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqData: FAQItem[] = [
    { question: t('question1'), answer: t('answer1') },
    { question: t('question2'), answer: t('answer2') },
    { question: t('question3'), answer: t('answer3') },
    { question: t('question4'), answer: t('answer4') },
    { question: t('question5'), answer: t('answer5') },
    { question: t('question6'), answer: t('answer6') },
    { question: t('question7'), answer: t('answer7') },
    { question: t('question8'), answer: t('answer8') },
    { question: t('question9'), answer: t('answer9') },
    { question: t('question10'), answer: t('answer10') },
  ];

  function toggleFAQ(index: number) {
    setOpenIndex(openIndex === index ? null : index);
  }

  return (
    <div className="mt-12 bg-white p-8 rounded-xl brand-shadow">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">{t('title')}</h2>
        <p className="text-gray-600">{t('subtitle')}</p>
      </div>
      <div className="space-y-3 max-w-3xl mx-auto">
        {faqData.map((item, index) => (
          <div key={index} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full text-left flex items-start justify-between gap-4 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-fetra-olive/30 rounded-md hover:bg-gray-50 px-3 transition-colors"
              aria-expanded={openIndex === index}
            >
              <span className="font-semibold text-gray-900">{item.question}</span>
              <svg
                className={`w-5 h-5 text-fetra-olive transition-transform flex-shrink-0 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openIndex === index && (
              <div className="mt-2 px-3 text-sm text-gray-700 leading-relaxed animate-fade-in">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
