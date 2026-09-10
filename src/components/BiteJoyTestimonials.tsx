import React, { useState } from 'react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 'tab-1',
    name: 'Sarah Jenkins',
    role: 'Food Blogger',
    quote:
      '"Bitejoy makes campus dining an absolute delight! The burgers are consistently juicy, seasoned to perfection, and ready in minutes."',
    avatar:
      'https://cdn.prod.website-files.com/678b0c0393efc5b8320e8808/6790f1d75f1b1c31405e3f4b_client-image-1.jpg'
  },
  {
    id: 'tab-2',
    name: 'Michael Chen',
    role: 'Software Engineer',
    quote:
      '"Between heavy coding sprints and lectures, ordering ahead from Bitejoy saves my life every day. Best loaded burgers and fries on campus!"',
    avatar:
      'https://cdn.prod.website-files.com/678b0c0393efc5b8320e8808/6790f1d8c1c5520a402ae55c_client-image-2.jpg'
  },
  {
    id: 'tab-3',
    name: 'Rachel Kim',
    role: 'Yoga Instructor',
    quote:
      '"Love the plant-based and vegan options! Fresh ingredients, wholesome recipes, and super fast order tracking."',
    avatar:
      'https://cdn.prod.website-files.com/678b0c0393efc5b8320e8808/6790f1d830b80894be6a245f_client-image-3.jpg'
  },
  {
    id: 'tab-4',
    name: 'Emily Carter',
    role: 'Photographer',
    quote:
      '"Not only is the food delicious, but the vibrant design and live canteen notifications make eating here a joyous habit."',
    avatar:
      'https://cdn.prod.website-files.com/678b0c0393efc5b8320e8808/6790f1d837ba7733842d0752_client-image-4.jpg'
  }
];

export const BiteJoyTestimonials: React.FC = () => {
  const [activeId, setActiveId] = useState(TESTIMONIALS[0].id);
  const activeTestimonial =
    TESTIMONIALS.find((t) => t.id === activeId) || TESTIMONIALS[0];

  return (
    <section className="testimonial-section">
      <div className="padding-global">
        <div className="container-medium">
          <div className="padding-section-large">
            <div className="testimonial-component">
              <div className="max-width-xlarge align-center">
                <h2 className="heading-style-h2 text-align-center">
                  Tasty Reviews from <span className="featured h2">Fans</span>
                </h2>
              </div>
              <div className="spacer-xlarge"></div>

              <div className="testimonial-tabs w-tabs">
                {/* Client Avatar Tab Selector */}
                <div
                  className="testimonial-tab-menu w-tab-menu"
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '16px',
                    marginBottom: '32px'
                  }}
                >
                  {TESTIMONIALS.map((t) => {
                    const isCurrent = t.id === activeId;
                    return (
                      <a
                        key={t.id}
                        className={`testimonial-tab-link w-inline-block w-tab-link cursor-pointer ${
                          isCurrent ? 'w--current' : ''
                        }`}
                        onClick={() => setActiveId(t.id)}
                        style={{
                          borderRadius: '50%',
                          border: isCurrent
                            ? '4px solid var(--black)'
                            : '2px solid rgba(0,0,0,0.2)',
                          boxShadow: isCurrent
                            ? '3px 3px 0 0 var(--black)'
                            : 'none',
                          padding: '4px',
                          transition: 'all 0.2s ease',
                          transform: isCurrent ? 'scale(1.1)' : 'scale(1)'
                        }}
                      >
                        <img
                          alt={t.name}
                          className="testimonial-image"
                          src={t.avatar}
                          style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            objectFit: 'cover'
                          }}
                        />
                      </a>
                    );
                  })}
                </div>

                {/* Active Testimonial Card */}
                <div className="w-tab-content">
                  <div className="testimonial-tab-pane w-tab-pane w--tab-active">
                    <div className="testimonial-card">
                      <div className="testimonial-content">
                        <div className="testimonial-block">
                          {/* 5 Stars */}
                          <div className="testimonial-rating-wrapper">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <div key={star} className="testimonial-rating-icon">
                                <div className="star-icon w-embed">
                                  <svg
                                    fill="none"
                                    viewBox="0 0 18 17"
                                    width="100%"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M8.16379 0.551109C8.47316 -0.183704 9.52684 -0.183703 9.83621 0.551111L11.6621 4.88811C11.7926 5.19789 12.0875 5.40955 12.426 5.43636L17.1654 5.81173C17.9684 5.87533 18.294 6.86532 17.6822 7.38306L14.0713 10.4388C13.8134 10.6571 13.7007 10.9996 13.7795 11.3259L14.8827 15.8949C15.0696 16.669 14.2172 17.2809 13.5297 16.8661L9.47208 14.4176C9.18225 14.2427 8.81775 14.2427 8.52793 14.4176L4.47029 16.8661C3.7828 17.2809 2.93036 16.669 3.11727 15.8949L4.22048 11.3259C4.29928 10.9996 4.18664 10.6571 3.92873 10.4388L0.317756 7.38306C-0.294046 6.86532 0.0315611 5.87533 0.834562 5.81173L5.57402 5.43636C5.91255 5.40955 6.20744 5.19789 6.33786 4.88811L8.16379 0.551109Z"
                                      fill="currentColor"
                                    ></path>
                                  </svg>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="spacer-large-2"></div>
                          <h3 className="testimonial-text">
                            {activeTestimonial.quote}
                          </h3>
                          <div className="client-content-wrapper">
                            <div className="testimonial-client">
                              <div className="testimonial-client-info">
                                <div className="testimonial-name">
                                  {activeTestimonial.name}
                                </div>
                                <div>{activeTestimonial.role}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <img
                  alt="Quote – Bitejoy Webflow Template "
                  className="quote-icon"
                  loading="lazy"
                  src="https://cdn.prod.website-files.com/678b0c0393efc5b8320e8808/6790f0a6a9c10dd1cea7a22f_quote-icon.svg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
