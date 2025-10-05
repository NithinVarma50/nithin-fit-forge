import React from 'react';
import Head from 'next/head';

// Define the platforms we support
export type SharingPlatform = 'facebook' | 'twitter' | 'linkedin' | 'pinterest' | 'default';

interface ShareImageProps {
  title: string;
  description: string;
  platform?: SharingPlatform;
  url?: string;
}

/**
 * Component that adds appropriate meta tags for social media sharing
 * with custom gym-related images based on the platform
 */
const ShareImage: React.FC<ShareImageProps> = ({
  title,
  description,
  platform = 'default',
  url
}) => {
  // Map of platform-specific image paths
  const platformImages = {
    facebook: '/images/share/facebook-gym-share.svg',
    twitter: '/images/share/twitter-gym-share.svg',
    linkedin: '/images/share/default-gym-share.svg',
    pinterest: '/images/share/default-gym-share.svg',
    default: '/images/share/default-gym-share.svg'
  };

  // Get the appropriate image for the platform
  const imageUrl = platformImages[platform] || platformImages.default;
  
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Head>
  );
};

export default ShareImage;