import React, { useState } from 'react';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS_COL1: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'What are your opening hours?',
    answer:
      'We’re open every day from 10:00 AM to 10:00 PM. Whether you’re craving lunch, dinner, or a late-night snack, we’re here to serve you!'
  },
  {
    id: 'faq-2',
    question: 'Do you offer vegetarian or vegan options?',
    answer:
      'Yes, we do! Our menu includes a variety of vegetarian and vegan-friendly options, such as veggie burgers, fresh salads, and plant-based sides.'
  }
];

const FAQ_ITEMS_COL2: FaqItem[] = [
  {
    id: 'faq-3',
    question: 'Can I place an order online?',
    answer:
      'Absolutely! You can order directly through our website or mobile app for pickup or delivery. It’s fast, easy, and convenient!'
  },
  {
    id: 'faq-4',
    question: 'Do you accommodate food allergies?',
    answer:
      'We take food allergies seriously and are happy to help! Please inform our staff of any allergies when ordering, and we’ll do our best to accommodate your needs.'
  }
];

export const BiteJoyFaq: React.FC = () => {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderItem = (item: FaqItem) => {
    const isOpen = !!openIds[item.id];
    return (
      <div
        key={item.id}
        className={`accordion-content-item cursor-pointer ${isOpen ? 'is-open' : ''}`}
        onClick={() => toggle(item.id)}
      >
        <div className="accordion-top-wrap">
          <div className="accordion-title-item">
            <h2 className="accordion-heading">{item.question}</h2>
          </div>
          <div className="plus-block">
            <div className="plus-line"></div>
            <div
              className="plus-line vertical"
              style={{
                transform: isOpen ? 'rotate(90deg)' : 'none',
                opacity: isOpen ? 0 : 1
              }}
            ></div>
          </div>
        </div>
        <div
          className="accordion-content-wrap"
          style={{
            maxHeight: isOpen ? '200px' : '0',
            opacity: isOpen ? 1 : 0,
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <div className="accordion-content-block">
            <p className="accordion-answer-text">{item.answer}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="faq">
      <div className="padding-global">
        <div className="container-large">
          <div className="padding-section-large">
            <div className="max-width-large align-center">
              <h2 className="heading-style-h2 text-align-center">
                Common <span className="featured h2">questions</span>
              </h2>
            </div>
            <div className="spacer-xlarge"></div>
            <div className="faq-container">
              <div className="faq-wrapper">{FAQ_ITEMS_COL1.map(renderItem)}</div>
              <div className="faq-wrapper">{FAQ_ITEMS_COL2.map(renderItem)}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
