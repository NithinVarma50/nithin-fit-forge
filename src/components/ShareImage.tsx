import React, { useEffect } from 'react';
import { updateSharingMetaTags, type SharingPlatform } from '@/utils/sharing';

interface ShareImageProps {
  title: string;
  description: string;
  platform?: SharingPlatform;
  url?: string;
}

/**
 * Component that dynamically updates meta tags for social media sharing
 * with custom gym-related images based on the platform
 * This is a Vite-compatible version that doesn't use Next.js Head component
 */
const ShareImage: React.FC<ShareImageProps> = ({
  title,
  description,
  platform = 'default',
  url
}) => {
  useEffect(() => {
    // Update meta tags when component mounts or props change
    updateSharingMetaTags(platform, title, description, url);
  }, [platform, title, description, url]);

  // This component doesn't render anything visible
  // It only updates the document head meta tags
  return null;
};

export default ShareImage;