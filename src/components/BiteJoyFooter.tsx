import React from 'react';

export const BiteJoyFooter: React.FC = () => {
  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer" style={{ position: 'relative' }}>
      <div className="padding-global">
        <div className="container-large">
          <div className="footer-padding">
            {/* Top Row: Logo + Back to Top */}
            <div className="footer-top-content">
              <div className="max-width-small">
                <a className="footer-logo-link w-inline-block" href="/">
                  <img
                    alt="Logo – Bitejoy Webflow Template "
                    className="footer-logo"
                    loading="lazy"
                    src="https://cdn.prod.website-files.com/678b0c0393efc5b8320e8808/678fb4e2a55ea3fa39a32d64_footer-logo%20(1).svg"
                  />
                </a>
                <div className="spacer-xsmall"></div>
                <div className="footer-description-block">
                  <p className="text-size-regular text-color-alternate">
                    Savor Every Delicious Bite • Instant Campus Canteen
                  </p>
                </div>
              </div>

              <div
                className="footer-content-block"
                id="w-node-_37b78ce8-6c56-439d-e460-72774bac889c-4bac888f"
              >
                <div className="back-to-top-item">
                  <a
                    className="back-to-top-link w-inline-block cursor-pointer"
                    onClick={scrollToTop}
                    title="Back to Top"
                  >
                    <div className="back-to-top-arrow w-embed">
                      <svg
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M13.0001 7.82843V20H11.0001V7.82843L5.63614 13.1924L4.22192 11.7782L12.0001 4L19.7783 11.7782L18.3641 13.1924L13.0001 7.82843Z"></path>
                      </svg>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            {/* Grid Columns: Pages, Menu, Social Media */}
            <div className="w-layout-grid footer-component-grid">
              <div
                className="footer-content-block"
                id="w-node-_37b78ce8-6c56-439d-e460-72774bac88a0-4bac888f"
              >
                <div className="footer-subtitle">PAGES:</div>
                <a className="link-button w-inline-block" href="#top">
                  <div className="link-wrap">
                    <div className="link-text is-alternate">Home</div>
                    <div className="link-text footer-hover">Home</div>
                  </div>
                </a>
                <a className="link-button w-inline-block" href="#menu">
                  <div className="link-wrap">
                    <div className="link-text is-alternate">Menu</div>
                    <div className="link-text footer-hover">Menu</div>
                  </div>
                </a>
                <a className="link-button w-inline-block" href="#about">
                  <div className="link-wrap">
                    <div className="link-text is-alternate">About</div>
                    <div className="link-text footer-hover">About</div>
                  </div>
                </a>
                <a className="link-button w-inline-block" href="#contact">
                  <div className="link-wrap">
                    <div className="link-text is-alternate">Contact</div>
                    <div className="link-text footer-hover">Contact</div>
                  </div>
                </a>
              </div>

              <div
                className="footer-content-block"
                id="w-node-fb136496-e950-5833-1713-80fd5b32a26e-4bac888f"
              >
                <div className="footer-subtitle">MENU:</div>
                <div className="w-dyn-list">
                  <div className="category-link-wrapper w-dyn-items" role="list">
                    <div className="w-dyn-item" role="listitem">
                      <a className="link-button w-inline-block" href="#burgers">
                        <div className="link-wrap">
                          <div className="link-text is-alternate">Burgers</div>
                          <div className="link-text footer-hover">Burgers</div>
                        </div>
                      </a>
                    </div>
                    <div className="w-dyn-item" role="listitem">
                      <a className="link-button w-inline-block" href="#sides">
                        <div className="link-wrap">
                          <div className="link-text is-alternate">Sides</div>
                          <div className="link-text footer-hover">Sides</div>
                        </div>
                      </a>
                    </div>
                    <div className="w-dyn-item" role="listitem">
                      <a className="link-button w-inline-block" href="#desserts">
                        <div className="link-wrap">
                          <div className="link-text is-alternate">Desserts</div>
                          <div className="link-text footer-hover">Desserts</div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div
                className="footer-social-media"
                id="w-node-_37b78ce8-6c56-439d-e460-72774bac88cb-4bac888f"
              >
                <a
                  className="social-link is-footer w-inline-block"
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="social-icon-wrap">
                    <div className="social-icon w-embed">
                      <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.001 9C10.3436 9 9.00098 10.3431 9.00098 12C9.00098 13.6573 10.3441 15 12.001 15C13.6583 15 15.001 13.6569 15.001 12C15.001 10.3427 13.6579 9 12.001 9ZM12.001 7C14.7614 7 17.001 9.2371 17.001 12C17.001 14.7605 14.7639 17 12.001 17C9.24051 17 7.00098 14.7629 7.00098 12C7.00098 9.23953 9.23808 7 12.001 7ZM18.501 6.74915C18.501 7.43926 17.9402 7.99917 17.251 7.99917C16.5609 7.99917 16.001 7.4384 16.001 6.74915C16.001 6.0599 16.5617 5.5 17.251 5.5C17.9393 5.49913 18.501 6.0599 18.501 6.74915ZM12.001 4C9.5265 4 9.12318 4.00655 7.97227 4.0578C7.18815 4.09461 6.66253 4.20007 6.17416 4.38967C5.74016 4.55799 5.42709 4.75898 5.09352 5.09255C4.75867 5.4274 4.55804 5.73963 4.3904 6.17383C4.20036 6.66332 4.09493 7.18811 4.05878 7.97115C4.00703 9.0752 4.00098 9.46105 4.00098 12C4.00098 14.4745 4.00753 14.8778 4.05877 16.0286C4.0956 16.8124 4.2012 17.3388 4.39034 17.826C4.5591 18.2606 4.7605 18.5744 5.09246 18.9064C5.42863 19.2421 5.74179 19.4434 6.17187 19.6094C6.66619 19.8005 7.19148 19.9061 7.97212 19.9422C9.07618 19.9939 9.46203 20 12.001 20C14.4755 20 14.8788 19.9934 16.0296 19.9422C16.8117 19.9055 17.3385 19.7996 17.827 19.6106C18.2604 19.4423 18.5752 19.2402 18.9074 18.9085C19.2436 18.5718 19.4445 18.2594 19.6107 17.8283C19.8013 17.3358 19.9071 16.8098 19.9432 16.0289C19.9949 14.9248 20.001 14.5389 20.001 12C20.001 9.52552 19.9944 9.12221 19.9432 7.97137C19.9064 7.18906 19.8005 6.66149 19.6113 6.17318C19.4434 5.74038 19.2417 5.42635 18.9084 5.09255C18.573 4.75715 18.2616 4.55693 17.8271 4.38942C17.338 4.19954 16.8124 4.09396 16.0298 4.05781C14.9258 4.00605 14.5399 4 12.001 4ZM12.001 2C14.7176 2 15.0568 2.01 16.1235 2.06C17.1876 2.10917 17.9135 2.2775 18.551 2.525C19.2101 2.77917 19.7668 3.1225 20.3226 3.67833C20.8776 4.23417 21.221 4.7925 21.476 5.45C21.7226 6.08667 21.891 6.81333 21.941 7.8775C21.9885 8.94417 22.001 9.28333 22.001 12C22.001 14.7167 21.991 15.0558 21.941 16.1225C21.8918 17.1867 21.7226 17.9125 21.476 18.55C21.2218 19.2092 20.8776 19.7658 20.3226 20.3217C19.7668 20.8767 19.2076 21.22 18.551 21.475C17.9135 21.7217 17.1876 21.89 16.1235 21.94C15.0568 21.9875 14.7176 22 12.001 22C9.28431 22 8.94514 21.99 7.87848 21.94C6.81431 21.8908 6.08931 21.7217 5.45098 21.475C4.79264 21.2208 4.23514 20.8767 3.67931 20.3217C3.12348 19.7658 2.78098 19.2067 2.52598 18.55C2.27848 17.9125 2.11098 17.1867 2.06098 16.1225C2.01348 15.0558 2.00098 14.7167 2.00098 12C2.00098 9.28333 2.01098 8.94417 2.06098 7.8775C2.11014 6.8125 2.27848 6.0875 2.52598 5.45C2.78014 4.79167 3.12348 4.23417 3.67931 3.67833C4.23514 3.1225 4.79348 2.78 5.45098 2.525C6.08848 2.2775 6.81348 2.11 7.87848 2.06C8.94514 2.0125 9.28431 2 12.001 2Z"></path>
                      </svg>
                    </div>
                  </div>
                </a>
                <a
                  className="social-link is-footer w-inline-block"
                  href="https://www.x.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="social-icon-wrap">
                    <div className="social-icon w-embed">
                      <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 2H1L9.26086 13.0145L1.44995 21.9999H4.09998L10.4883 14.651L16 22H23L14.3917 10.5223L21.8001 2H19.1501L13.1643 8.88578L8 2ZM17 20L5 4H7L19 20H17Z"></path>
                      </svg>
                    </div>
                  </div>
                </a>
              </div>
            </div>

            <div className="footer-line"></div>

            {/* Bottom bar */}
            <div className="w-layout-grid bottom-component-grid">
              <div
                className="bottom-content-wrapper"
                id="w-node-_37b78ce8-6c56-439d-e460-72774bac88e2-4bac888f"
              >
                <div className="bottom-content-item">
                  <div className="text-size-small is-footer">Created for Campus with 🧡 by</div>
                  <span style={{ fontWeight: '800', marginLeft: '6px' }}>Team-Winnerr</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="background-footer"></div>
    </footer>
  );
};
