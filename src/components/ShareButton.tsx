import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  MessageCircle,
  Send,
  Copy,
  Check
} from 'lucide-react';
import { generateShareUrls, shareToPlatform, type SharingPlatform } from '@/utils/sharing';
import { useToast } from '@/hooks/use-toast';

interface ShareButtonProps {
  title: string;
  description: string;
  url?: string;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const ShareButton: React.FC<ShareButtonProps> = ({
  title,
  description,
  url,
  className,
  variant = 'outline',
  size = 'default'
}) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleShare = async (platform: SharingPlatform) => {
    try {
      if (platform === 'copy') {
        await navigator.clipboard.writeText(url || window.location.href);
        setCopied(true);
        toast({
          title: "Link copied!",
          description: "Share this link with your friends",
        });
        setTimeout(() => setCopied(false), 2000);
        return;
      }

      shareToPlatform(platform, url || window.location.href, title, description);
      
      toast({
        title: `Shared to ${platform}!`,
        description: `Your fitness journey has been shared`,
      });
    } catch (error) {
      toast({
        title: "Share failed",
        description: "Unable to share at this time. Please try again.",
        variant: "destructive",
      });
    }
  };

  const shareOptions = [
    { 
      platform: 'facebook' as SharingPlatform, 
      label: 'Facebook', 
      icon: Facebook, 
      color: 'text-blue-600' 
    },
    { 
      platform: 'twitter' as SharingPlatform, 
      label: 'Twitter', 
      icon: Twitter, 
      color: 'text-sky-500' 
    },
    { 
      platform: 'linkedin' as SharingPlatform, 
      label: 'LinkedIn', 
      icon: Linkedin, 
      color: 'text-blue-700' 
    },
    { 
      platform: 'instagram' as SharingPlatform, 
      label: 'Instagram', 
      icon: Instagram, 
      color: 'text-pink-600' 
    },
    { 
      platform: 'whatsapp' as SharingPlatform, 
      label: 'WhatsApp', 
      icon: MessageCircle, 
      color: 'text-green-600' 
    },
    { 
      platform: 'telegram' as SharingPlatform, 
      label: 'Telegram', 
      icon: Send, 
      color: 'text-blue-500' 
    },
    { 
      platform: 'copy' as SharingPlatform, 
      label: 'Copy Link', 
      icon: copied ? Check : Copy, 
      color: 'text-gray-600' 
    }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Share2 className="w-4 h-4 mr-2" />
          Share Progress
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {shareOptions.map((option) => {
          const IconComponent = option.icon;
          return (
            <DropdownMenuItem
              key={option.platform}
              onClick={() => handleShare(option.platform)}
              className="cursor-pointer"
            >
              <IconComponent className={`w-4 h-4 mr-2 ${option.color}`} />
              {option.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareButton;
