// Cache busting utilities for social media sharing
export const clearSocialMediaCache = () => {
  if (typeof window === 'undefined') return;
  
  // Add a timestamp to force cache refresh
  const timestamp = Date.now();
  
  // Update all meta tags with cache-busting parameters
  const updateMetaTag = (property: string, content: string) => {
    let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
    if (!meta) {
      meta = document.querySelector(`meta[name="${property}"]`) as HTMLMetaElement;
    }
    if (!meta) {
      meta = document.createElement('meta');
      if (property.startsWith('og:')) {
        meta.setAttribute('property', property);
      } else {
        meta.setAttribute('name', property);
      }
      document.head.appendChild(meta);
    }
    meta.content = content;
  };
  
  // Force refresh all image URLs
  const baseUrl = window.location.origin;
  
  // Update Open Graph image
  updateMetaTag('og:image', `${baseUrl}/images/share/instagram-gym-share.svg?v=${timestamp}`);
  
  // Update Twitter image
  updateMetaTag('twitter:image', `${baseUrl}/images/share/twitter-gym-share.svg?v=${timestamp}`);
  
  console.log('Social media cache cleared with timestamp:', timestamp);
};

// Instagram-specific cache clearing
export const clearInstagramCache = () => {
  if (typeof window === 'undefined') return;
  
  const timestamp = Date.now();
  const baseUrl = window.location.origin;
  
  // Force Instagram to fetch new image
  const instagramImage = `${baseUrl}/images/share/instagram-gym-share.svg?v=${timestamp}`;
  
  // Update Open Graph tags specifically for Instagram
  const updateMetaTag = (property: string, content: string) => {
    let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    meta.content = content;
  };
  
  updateMetaTag('og:image', instagramImage);
  updateMetaTag('og:image:width', '1080');
  updateMetaTag('og:image:height', '1080');
  updateMetaTag('og:image:alt', 'Fit Forge - Fitness Progress Tracking');
  
  console.log('Instagram cache cleared with new image:', instagramImage);
};

// Facebook-specific cache clearing
export const clearFacebookCache = () => {
  if (typeof window === 'undefined') return;
  
  const timestamp = Date.now();
  const baseUrl = window.location.origin;
  
  // Force Facebook to fetch new image
  const facebookImage = `${baseUrl}/images/share/facebook-gym-share.svg?v=${timestamp}`;
  
  const updateMetaTag = (property: string, content: string) => {
    let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    meta.content = content;
  };
  
  updateMetaTag('og:image', facebookImage);
  updateMetaTag('og:image:width', '1200');
  updateMetaTag('og:image:height', '630');
  
  console.log('Facebook cache cleared with new image:', facebookImage);
};
