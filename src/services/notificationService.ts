
// Push Notification Service - Prepared for future Capacitor integration
export interface NotificationData {
  id: string;
  title: string;
  body: string;
  type: 'promotion' | 'flash-discount' | 'general';
  restaurantId?: number;
  imageUrl?: string;
  actionUrl?: string;
  expiresAt?: Date;
}

export class NotificationService {
  private static instance: NotificationService;
  private isInitialized = false;
  private registrationToken: string | null = null;

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Initialize push notifications (to be called when Capacitor is set up)
  async initialize(): Promise<boolean> {
    try {
      // Check if we're in a Capacitor environment
      if (typeof window !== 'undefined' && (window as any).Capacitor) {
        try {
          // Use eval to prevent TypeScript from resolving the import at compile time
          const PushNotifications = await this.loadPushNotifications();
          
          if (!PushNotifications) {
            console.log('Push notifications module not available');
            return false;
          }
          
          // Request permission for push notifications
          const permission = await PushNotifications.requestPermissions();
          
          if (permission.receive === 'granted') {
            // Register for push notifications
            await PushNotifications.register();
            
            // Get registration token
            PushNotifications.addListener('registration', (token: any) => {
              console.log('Push registration success:', token.value);
              this.registrationToken = token.value;
              // TODO: Send token to your backend server
              this.sendTokenToServer(token.value);
            });

            // Handle registration errors
            PushNotifications.addListener('registrationError', (error: any) => {
              console.error('Push registration error:', error);
            });

            // Handle incoming notifications
            PushNotifications.addListener('pushNotificationReceived', (notification: any) => {
              console.log('Push notification received:', notification);
              this.handleIncomingNotification(notification);
            });

            // Handle notification action performed
            PushNotifications.addListener('pushNotificationActionPerformed', (notification: any) => {
              console.log('Push notification action performed:', notification);
              this.handleNotificationAction(notification);
            });

            this.isInitialized = true;
            return true;
          }
        } catch (error) {
          console.log('Capacitor push notifications not available yet. Install @capacitor/push-notifications to enable.');
          return false;
        }
      } else {
        console.log('Push notifications not available - not in Capacitor environment');
        // For web environment, you can implement Web Push API here
        this.initializeWebPush();
      }
      
      return false;
    } catch (error) {
      console.error('Failed to initialize push notifications:', error);
      return false;
    }
  }

  // Dynamic import helper to avoid TypeScript compilation issues
  private async loadPushNotifications(): Promise<any> {
    try {
      const module = await eval('import("@capacitor/push-notifications")');
      return module.PushNotifications;
    } catch {
      return null;
    }
  }

  // Dynamic import helper for local notifications
  private async loadLocalNotifications(): Promise<any> {
    try {
      const module = await eval('import("@capacitor/local-notifications")');
      return module.LocalNotifications;
    } catch {
      return null;
    }
  }

  // Initialize web push notifications (for browser)
  private async initializeWebPush() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);
        // TODO: Set up web push subscription
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  // Send registration token to your backend
  private async sendTokenToServer(token: string) {
    try {
      // TODO: Replace with your backend endpoint
      const response = await fetch('/api/notifications/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, platform: 'android' })
      });
      
      if (response.ok) {
        console.log('Token sent to server successfully');
      }
    } catch (error) {
      console.error('Failed to send token to server:', error);
    }
  }

  // Handle incoming notification
  private handleIncomingNotification(notification: any) {
    // Custom logic for handling different notification types
    const data = notification.data as NotificationData;
    
    switch (data.type) {
      case 'promotion':
        this.handlePromotionNotification(data);
        break;
      case 'flash-discount':
        this.handleFlashDiscountNotification(data);
        break;
      default:
        this.handleGeneralNotification(data);
    }
  }

  // Handle notification actions
  private handleNotificationAction(notification: any) {
    const data = notification.notification.data as NotificationData;
    
    if (data.actionUrl) {
      // Navigate to specific URL or restaurant
      window.location.href = data.actionUrl;
    } else if (data.restaurantId) {
      // Navigate to restaurant details
      window.location.href = `/?restaurant=${data.restaurantId}`;
    }
  }

  // Handle different notification types
  private handlePromotionNotification(data: NotificationData) {
    console.log('Promotion notification:', data);
    // Show in-app promotion banner or modal
  }

  private handleFlashDiscountNotification(data: NotificationData) {
    console.log('Flash discount notification:', data);
    // Show urgent discount notification
  }

  private handleGeneralNotification(data: NotificationData) {
    console.log('General notification:', data);
    // Handle general notifications
  }

  // Check if notifications are supported and enabled
  isSupported(): boolean {
    return this.isInitialized;
  }

  // Get registration token
  getRegistrationToken(): string | null {
    return this.registrationToken;
  }

  // Schedule local notification (for testing)
  async scheduleLocalNotification(notification: NotificationData) {
    if (typeof window !== 'undefined' && (window as any).Capacitor) {
      try {
        const LocalNotifications = await this.loadLocalNotifications();
        
        if (!LocalNotifications) {
          console.log('Local notifications module not available');
          return;
        }
        
        await LocalNotifications.schedule({
          notifications: [{
            title: notification.title,
            body: notification.body,
            id: parseInt(notification.id),
            schedule: { at: new Date(Date.now() + 5000) }, // 5 seconds from now
            extra: notification
          }]
        });
      } catch (error) {
        console.log('Local notifications not available yet. Install @capacitor/local-notifications to enable.');
      }
    }
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();

/*
FUTURE SETUP INSTRUCTIONS:

1. Install Capacitor Push Notifications plugin:
   npm install @capacitor/push-notifications @capacitor/local-notifications

2. Add to capacitor.config.ts:
   plugins: {
     PushNotifications: {
       presentationOptions: ["badge", "sound", "alert"]
     }
   }

3. For Android, add to android/app/src/main/AndroidManifest.xml:
   <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
   <uses-permission android:name="android.permission.VIBRATE" />

4. Set up Firebase Cloud Messaging:
   - Create Firebase project
   - Add google-services.json to android/app/
   - Configure FCM in Firebase Console

5. Backend Integration:
   - Set up server to send push notifications via FCM
   - Create API endpoints for notification management
   - Store device tokens in database

6. Initialize in your app:
   import { notificationService } from './services/notificationService';
   
   // In your main component
   useEffect(() => {
     notificationService.initialize();
   }, []);
*/
