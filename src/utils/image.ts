/**
 * Food image resolution utility for Kay Jevnar.
 * Uses locally served assets in public/items for Web and static asset require maps for React Native Expo.
 * Avoids third-party external CDN/Unsplash dependencies that fail on SSL proxy networks.
 */

export const resolveFoodImage = (url: string | undefined, name?: string): string => {
  const nameLower = (name || '').toLowerCase();

  if (nameLower.includes('paneer tikka') || nameLower.includes('paneer burger')) {
    return '/items/paneer_burger.png';
  }
  if (nameLower.includes('smash') || nameLower.includes('veggie burger')) {
    return '/items/smash_burger.png';
  }
  if (nameLower.includes('classic veggie cheese') || nameLower.includes('cheeseburger') || nameLower.includes('cheese')) {
    return '/items/classic-beef-burger-ready-be-served.png';
  }
  if (nameLower.includes('zinger') || nameLower.includes('spicy paneer')) {
    return '/items/classic-hamburger-filled.png';
  }
  if (nameLower.includes('waffle')) {
    return '/items/fries-cone-yellow-background.png';
  }
  if (nameLower.includes('onion')) {
    return '/items/onion-rings-blue-box.png';
  }
  if (nameLower.includes('fries')) {
    return '/items/portion-french-fries-with-ketchup.png';
  }
  if (nameLower.includes('strawberry') || nameLower.includes('cake')) {
    return '/items/pink-strawberry-cake-portion-pink-background.png';
  }
  if (nameLower.includes('lava') || nameLower.includes('truffle') || nameLower.includes('chocolate')) {
    return '/items/top-view-arrangement-with-doughnuts-blue-background.png';
  }
  if (nameLower.includes('coffee')) {
    return '/items/zach-camp-3D0HUHFcRrk-unsplash.png';
  }
  if (nameLower.includes('lemon') || nameLower.includes('soda')) {
    return '/items/ian-dooley-TLD6iCOlyb0-unsplash.png';
  }

  // If already a valid local item URL
  if (url && url.startsWith('/items/')) {
    return url;
  }

  return '/items/paneer_burger.png';
};

/**
 * Returns static local image asset for React Native Image component
 */
export const getLocalFoodAsset = (name?: string) => {
  const n = (name || '').toLowerCase();

  if (n.includes('paneer tikka') || n.includes('paneer burger')) {
    return require('../../assets/food/paneer_burger.png');
  }
  if (n.includes('smash') || n.includes('veggie burger')) {
    return require('../../assets/food/smash_burger.png');
  }
  if (n.includes('classic veggie cheese') || n.includes('cheeseburger') || n.includes('cheese')) {
    return require('../../assets/food/classic-beef-burger-ready-be-served.png');
  }
  if (n.includes('zinger') || n.includes('spicy paneer')) {
    return require('../../assets/food/classic-hamburger-filled.png');
  }
  if (n.includes('waffle')) {
    return require('../../assets/food/fries-cone-yellow-background.png');
  }
  if (n.includes('onion')) {
    return require('../../assets/food/onion-rings-blue-box.png');
  }
  if (n.includes('fries')) {
    return require('../../assets/food/portion-french-fries-with-ketchup.png');
  }
  if (n.includes('strawberry') || n.includes('cake')) {
    return require('../../assets/food/pink-strawberry-cake-portion-pink-background.png');
  }
  if (n.includes('lava') || n.includes('truffle') || n.includes('chocolate')) {
    return require('../../assets/food/top-view-arrangement-with-doughnuts-blue-background.png');
  }
  if (n.includes('coffee')) {
    return require('../../assets/food/zach-camp-3D0HUHFcRrk-unsplash.png');
  }
  if (n.includes('lemon') || n.includes('soda')) {
    return require('../../assets/food/ian-dooley-TLD6iCOlyb0-unsplash.png');
  }

  return require('../../assets/food/paneer_burger.png');
};
