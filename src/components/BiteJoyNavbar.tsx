import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface BiteJoyNavbarProps {
  currentView: 'menu' | 'orders' | 'admin';
  onNavigate: (view: 'menu' | 'orders' | 'admin') => void;
  onOpenCart: () => void;
  onOpenAuth: () => void;
}

export const BiteJoyNavbar: React.FC<BiteJoyNavbarProps> = ({
  currentView,
  onNavigate,
  onOpenCart,
  onOpenAuth
}) => {
  const { itemCount } = useCart();
  const { firebaseUser, profile, logout } = useAuth();
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div
      className="navbar w-nav"
      data-animation="default"
      data-collapse="all"
      data-duration="0"
      id="top"
      role="banner"
      style={{ position: 'relative', zIndex: 900 }}
    >
      <div className="padding-global">
        <div className="container-large">
          <div className="w-layout-grid nav-component-grid">
            {/* Logo */}
            <a
              className="brand-link w-inline-block cursor-pointer"
              id="w-node-_016c42d0-27ae-d0d7-3914-01d3df01ab5e-df01ab5a"
              onClick={() => onNavigate('menu')}
            >
              <img
                alt="Logo – Bitejoy Webflow Template "
                className="logo"
                loading="lazy"
                src="https://cdn.prod.website-files.com/678b0c0393efc5b8320e8808/678feff4083448ea912b93c9_logo.svg"
              />
            </a>

            {/* Cart on Right */}
            <div className="nav-menu-wrapper">
              <div className="cart-item">
                <div className="w-commerce-commercecartwrapper cart">
                  <a
                    aria-haspopup="dialog"
                    aria-label="Open cart"
                    className="w-commerce-commercecartopenlink cart-button w-inline-block cursor-pointer"
                    role="button"
                    onClick={onOpenCart}
                  >
                    <img
                      alt="Cart – Bitejoy Webflow Template "
                      className="cart-icon"
                      loading="lazy"
                      src="https://cdn.prod.website-files.com/678b0c0393efc5b8320e8808/678b0c0393efc5b8320e88ae_cart_icon.svg"
                    />
                    <div className="w-commerce-commercecartopenlinkcount cart-quantity">
                      {itemCount}
                    </div>
                  </a>
                </div>
              </div>
            </div>

            {/* Hamburger Nav Dropdown Menu */}
            <nav
              className={`nav-menu w-nav-menu ${navOpen ? 'w--open' : ''}`}
              role="navigation"
            >
              <div className="nav-coontent-wrapper">
                <div className="nav-content-block">
                  <div className="background-navbar"></div>
                  <div className="nav-menu-content">
                    <div className="nav-link-overflow">
                      <a
                        className={`nav-link w-inline-block cursor-pointer ${
                          currentView === 'menu' ? 'w--current' : ''
                        }`}
                        onClick={() => {
                          onNavigate('menu');
                          setNavOpen(false);
                        }}
                      >
                        <div className="nav-text">Menu</div>
                        <div className="nav-text is-hover">Menu</div>
                      </a>
                    </div>

                    <div className="nav-link-overflow">
                      <a
                        className={`nav-link w-inline-block cursor-pointer ${
                          currentView === 'orders' ? 'w--current' : ''
                        }`}
                        onClick={() => {
                          onNavigate('orders');
                          setNavOpen(false);
                        }}
                      >
                        <div className="nav-text">My Orders</div>
                        <div className="nav-text is-hover">My Orders</div>
                      </a>
                    </div>

                    <div className="nav-link-overflow">
                      <a
                        className={`nav-link w-inline-block cursor-pointer ${
                          currentView === 'admin' ? 'w--current' : ''
                        }`}
                        onClick={() => {
                          onNavigate('admin');
                          setNavOpen(false);
                        }}
                      >
                        <div className="nav-text">Kitchen Portal</div>
                        <div className="nav-text is-hover">Kitchen Portal</div>
                      </a>
                    </div>

                    <div className="nav-link-overflow">
                      {firebaseUser ? (
                        <a
                          className="nav-link w-inline-block cursor-pointer"
                          onClick={() => {
                            logout();
                            setNavOpen(false);
                          }}
                        >
                          <div className="nav-text">Sign Out ({profile?.name || firebaseUser.email?.split('@')[0]})</div>
                          <div className="nav-text is-hover">Sign Out</div>
                        </a>
                      ) : (
                        <a
                          className="nav-link w-inline-block cursor-pointer"
                          onClick={() => {
                            onOpenAuth();
                            setNavOpen(false);
                          }}
                        >
                          <div className="nav-text">Sign In / Register</div>
                          <div className="nav-text is-hover">Sign In / Register</div>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </nav>

            {/* Burger Trigger Button */}
            <div
              className={`menu-button w-nav-button cursor-pointer ${navOpen ? 'w--open' : ''}`}
              role="button"
              tabIndex={0}
              onClick={() => setNavOpen(!navOpen)}
            >
              <div className="menu-wrapper">
                <div className="menu-text">{navOpen ? 'CLOSE' : 'MENU'}</div>
                <div className="burger-icon-wrapper">
                  <img
                    alt="Menu Button"
                    className="burger-top"
                    loading="lazy"
                    src="https://cdn.prod.website-files.com/678b0c0393efc5b8320e8808/678ff234323442bce6c89dc6_burger-top.svg"
                  />
                  <img
                    alt="Menu Button"
                    className="burger-middle"
                    loading="lazy"
                    src="https://cdn.prod.website-files.com/678b0c0393efc5b8320e8808/678ff234adfe6fe02e6d4c02_burger-middle.svg"
                  />
                  <img
                    alt="Menu Button"
                    className="burger-bottom"
                    loading="lazy"
                    src="https://cdn.prod.website-files.com/678b0c0393efc5b8320e8808/678ff233c61e98eeefe2b090_burger-bottom.svg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
