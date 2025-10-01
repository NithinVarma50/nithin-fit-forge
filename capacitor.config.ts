import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.1cc51a8f48fb477ba99247799b08ba61',
  appName: 'nithin-fit-forge',
  webDir: 'dist',
  server: {
    url: 'https://1cc51a8f-48fb-477b-a992-47799b08ba61.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
    }
  }
};

export default config;
