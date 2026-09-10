import React, { useState } from 'react';
import { MenuItem } from '../types';
import { useCart } from '../context/CartContext';

interface BiteJoyProductCardProps {
  item: MenuItem;
}

export const BiteJoyProductCard: React.FC<BiteJoyProductCardProps> = ({ item }) => {
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(item);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div className="product-list-item w-dyn-item" role="listitem">
      <a
        className="product-link w-inline-block cursor-pointer"
        onClick={handleClick}
        style={{ display: 'block', textDecoration: 'none', position: 'relative' }}
      >
        <div className="product-image-wrapper">
          <div className="product-price">
            ${item.price.toFixed(2)}
          </div>
          <img
            alt={item.name}
            className="product-image"
            loading="lazy"
            src={item.imageUrl}
          />
          <img
            alt="Emoji – Bitejoy Webflow Template "
            className="emoji"
            loading="lazy"
            src="https://cdn.prod.website-files.com/678b0c0393efc5b8320e8808/678d0676e9d9d30c1ec00b9c_emoji.svg"
          />

          {justAdded && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(240, 69, 33, 0.85)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontFamily: 'Realce, sans-serif',
                fontSize: '28px',
                fontWeight: 'bold',
                zIndex: 10,
                animation: 'backdropFade 0.2s ease-out'
              }}
            >
              ADDED TO TRAY! 🍔
            </div>
          )}
        </div>
        <div className="product-name">{item.name}</div>
      </a>
    </div>
  );
};
