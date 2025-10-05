import { useEffect, useState } from 'react';
import { detectSharingPlatform, updateSharingMetaTags, type SharingPlatform } from '@/utils/sharing';

interface UseSharingOptions {
  title: string;
  description: string;
  url?: string;
  autoDetect?: boolean;
}

export const useSharing = (options: UseSharingOptions) => {
  const { title, description, url, autoDetect = true } = options;
  const [platform, setPlatform] = useState<SharingPlatform>('default');
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    if (autoDetect) {
      const detectedPlatform = detectSharingPlatform();
      setPlatform(detectedPlatform);
      updateSharingMetaTags(detectedPlatform, title, description, url);
    }
  }, [title, description, url, autoDetect]);

  const updateSharing = (newPlatform: SharingPlatform, newTitle?: string, newDescription?: string, newUrl?: string) => {
    setPlatform(newPlatform);
    updateSharingMetaTags(
      newPlatform, 
      newTitle || title, 
      newDescription || description, 
      newUrl || url
    );
  };

  const shareToPlatform = (targetPlatform: SharingPlatform) => {
    setIsSharing(true);
    updateSharing(targetPlatform);
    
    // Reset sharing state after a short delay
    setTimeout(() => setIsSharing(false), 1000);
  };

  return {
    platform,
    isSharing,
    updateSharing,
    shareToPlatform
  };
};
