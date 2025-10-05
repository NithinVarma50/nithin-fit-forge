// Platform detection and sharing utilities
export type SharingPlatform = 'facebook' | 'twitter' | 'linkedin' | 'pinterest' | 'instagram' | 'whatsapp' | 'telegram' | 'default';

// Platform-specific image configurations
export const platformConfigs = {
  facebook: {
    image: '/images/share/facebook-gym-share.svg',
    dimensions: { width: 1200, height: 630 },
    description: 'Share your fitness journey on Facebook'
  },
  twitter: {
    image: '/images/share/twitter-gym-share.svg', 
    dimensions: { width: 1200, height: 675 },
    description: 'Tweet about your fitness progress'
  },
  linkedin: {
    image: '/images/share/linkedin-gym-share.svg',
    dimensions: { width: 1200, height: 627 },
    description: 'Share your professional fitness journey'
  },
  pinterest: {
    image: '/images/share/pinterest-gym-share.svg',
    dimensions: { width: 1000, height: 1500 },
    description: 'Pin your fitness inspiration'
  },
  instagram: {
    image: '/images/share/instagram-gym-share.svg',
    dimensions: { width: 1080, height: 1080 },
    description: 'Share your fitness story on Instagram'
  },
  whatsapp: {
    image: '/images/share/whatsapp-gym-share.svg',
    dimensions: { width: 300, height: 300 },
    description: 'Share your fitness progress with friends'
  },
  telegram: {
    image: '/images/share/telegram-gym-share.svg',
    dimensions: { width: 1200, height: 630 },
    description: 'Share your fitness journey on Telegram'
  },
  default: {
    image: '/images/share/default-gym-share.svg',
    dimensions: { width: 1200, height: 630 },
    description: 'Share your fitness journey'
  }
};

// Detect the sharing platform based on user agent or referrer
export const detectSharingPlatform = (): SharingPlatform => {
  if (typeof window === 'undefined') return 'default';
  
  const userAgent = window.navigator.userAgent.toLowerCase();
  const referrer = document.referrer.toLowerCase();
  
  // Check referrer first (more reliable)
  if (referrer.includes('facebook.com') || referrer.includes('fb.com')) return 'facebook';
  if (referrer.includes('twitter.com') || referrer.includes('t.co')) return 'twitter';
  if (referrer.includes('linkedin.com')) return 'linkedin';
  if (referrer.includes('pinterest.com')) return 'pinterest';
  if (referrer.includes('instagram.com')) return 'instagram';
  if (referrer.includes('whatsapp.com') || referrer.includes('wa.me')) return 'whatsapp';
  if (referrer.includes('telegram.org') || referrer.includes('t.me')) return 'telegram';
  
  // Check user agent as fallback
  if (userAgent.includes('facebook')) return 'facebook';
  if (userAgent.includes('twitter')) return 'twitter';
  if (userAgent.includes('linkedin')) return 'linkedin';
  if (userAgent.includes('pinterest')) return 'pinterest';
  if (userAgent.includes('instagram')) return 'instagram';
  if (userAgent.includes('whatsapp')) return 'whatsapp';
  if (userAgent.includes('telegram')) return 'telegram';
  
  return 'default';
};

// Update meta tags dynamically
export const updateSharingMetaTags = (platform: SharingPlatform, title: string, description: string, url?: string) => {
  if (typeof window === 'undefined') return;
  
  const config = platformConfigs[platform];
  const baseUrl = window.location.origin;
  // Add cache-busting parameter to force fresh image fetch
  const cacheBuster = `?v=${Date.now()}`;
  const imageUrl = `${baseUrl}${config.image}${cacheBuster}`;
  const shareUrl = url || window.location.href;
  
  // Update or create meta tags
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
  
  // Update Open Graph tags
  updateMetaTag('og:title', title);
  updateMetaTag('og:description', description);
  updateMetaTag('og:image', imageUrl);
  updateMetaTag('og:url', shareUrl);
  updateMetaTag('og:type', 'website');
  updateMetaTag('og:image:width', config.dimensions.width.toString());
  updateMetaTag('og:image:height', config.dimensions.height.toString());
  
  // Update Twitter tags
  updateMetaTag('twitter:card', 'summary_large_image');
  updateMetaTag('twitter:title', title);
  updateMetaTag('twitter:description', description);
  updateMetaTag('twitter:image', imageUrl);
  
  // Update standard meta tags
  updateMetaTag('description', description);
  
  // Update page title
  document.title = title;
};

// Generate share URLs for different platforms
export const generateShareUrls = (url: string, title: string, description: string) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  
  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedDescription}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`
  };
};

// Share to specific platform
export const shareToPlatform = (platform: SharingPlatform, url: string, title: string, description: string) => {
  const shareUrls = generateShareUrls(url, title, description);
  const shareUrl = shareUrls[platform];
  
  if (shareUrl) {
    window.open(shareUrl, '_blank', 'width=600,height=400');
  }
};
