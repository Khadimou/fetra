"use client";
import { useState } from "react";

type FAQItem = {
  question: string;
  answer: string;
};

const faqData: FAQItem[] = [
  {
    question: "Le rituel FETRA est-il adapté aux hommes ?",
    answer: "Absolument ! Il est conçu pour tous les visages désireux d'un éclat naturel, de traits sculptés et d'un moment de bien-être, sans distinction de genre.",
  },
  {
    question: "Mon type de peau ou ma carnation est-il compatible avec le Kit FETRA ?",
    answer: "Oui, le Kit FETRA est formulé pour s'adapter à toutes les peaux et carnations. Nos outils en Quartz Rose et notre huile naturelle offrent un soin doux et respectueux de votre épiderme.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggleFAQ(index: number) {
    setOpenIndex(openIndex === index ? null : index);
  }

  return (
    <div className="mt-8 bg-white p-6 rounded-xl brand-shadow">
      <h2 className="text-xl font-bold mb-4">Questions Fréquentes</h2>
      <div className="space-y-3">
        {faqData.map((item, index) => (
          <div key={index} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full text-left flex items-start justify-between gap-4 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-fetra-olive/30 rounded-md"
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
              <div className="mt-2 text-sm text-gray-700 animate-fade-in">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

