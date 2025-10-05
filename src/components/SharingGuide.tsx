import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  MessageCircle,
  Send,
  Share2
} from 'lucide-react';

/**
 * Component that provides a guide for the sharing feature
 * Shows users how the dynamic sharing works across platforms
 */
const SharingGuide: React.FC = () => {
  const platforms = [
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Professional fitness journey sharing with optimized 1200x630 images',
      features: ['Open Graph optimization', 'Professional gym imagery', 'Progress highlights']
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'text-sky-500',
      bgColor: 'bg-sky-50',
      description: 'Quick fitness updates with 1200x675 optimized cards',
      features: ['Summary cards', 'Real-time progress', 'Hashtag integration']
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
      description: 'Professional fitness achievements with 1200x627 images',
      features: ['Career-focused content', 'Professional metrics', 'Goal tracking']
    },
    {
      name: 'Instagram',
      icon: Instagram,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      description: 'Visual fitness stories with 1080x1080 square format',
      features: ['Story-style layout', 'Visual progress', 'Motivational content']
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Personal fitness updates with 300x300 compact images',
      features: ['Quick sharing', 'Personal progress', 'Friend updates']
    },
    {
      name: 'Telegram',
      icon: Send,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      description: 'Fitness journey updates with 1200x630 optimized format',
      features: ['Channel sharing', 'Progress updates', 'Community engagement']
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Dynamic Sharing Feature
          </CardTitle>
          <CardDescription>
            Automatically detects the sharing platform and provides optimized images and content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {platforms.map((platform) => {
              const IconComponent = platform.icon;
              return (
                <Card key={platform.name} className={`${platform.bgColor} border-0`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <IconComponent className={`w-5 h-5 ${platform.color}`} />
                      <span className="font-semibold">{platform.name}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{platform.description}</p>
                    <div className="space-y-1">
                      {platform.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">How It Works:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
              <li>Platform detection automatically identifies the sharing source</li>
              <li>Appropriate gym-related image is selected based on platform requirements</li>
              <li>Meta tags are dynamically updated for optimal social media display</li>
              <li>Content is tailored to each platform's audience and format</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SharingGuide;
