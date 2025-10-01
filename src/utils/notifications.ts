import { LocalNotifications } from '@capacitor/local-notifications';

export interface NotificationSchedule {
  workoutTime: string;
  breakfastTime: string;
  lunchTime: string;
  dinnerTime: string;
}

export async function requestNotificationPermission(): Promise<boolean> {
  try {
    const permission = await LocalNotifications.requestPermissions();
    return permission.display === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
}

export async function checkNotificationPermission(): Promise<boolean> {
  try {
    const permission = await LocalNotifications.checkPermissions();
    return permission.display === 'granted';
  } catch (error) {
    console.error('Error checking notification permission:', error);
    return false;
  }
}

export async function scheduleDailyReminders(schedule: NotificationSchedule) {
  try {
    // Cancel existing notifications
    await LocalNotifications.getPending().then(pending => {
      const ids = pending.notifications.map(n => n.id);
      if (ids.length > 0) {
        LocalNotifications.cancel({ notifications: ids.map(id => ({ id })) });
      }
    });

    const notifications = [];

    // Workout reminder
    const [workoutHour, workoutMin] = schedule.workoutTime.split(':').map(Number);
    notifications.push({
      title: '💪 Workout Time!',
      body: "It's time for your workout. Let's get strong!",
      id: 1,
      schedule: {
        on: {
          hour: workoutHour,
          minute: workoutMin
        },
        repeats: true,
        allowWhileIdle: true
      }
    });

    // Pre-workout reminder (1 hour before)
    const preWorkoutHour = workoutHour > 0 ? workoutHour - 1 : 23;
    notifications.push({
      title: '🍌 Pre-Workout Snack',
      body: 'Your workout is in 1 hour. Have a light snack!',
      id: 2,
      schedule: {
        on: {
          hour: preWorkoutHour,
          minute: workoutMin
        },
        repeats: true,
        allowWhileIdle: true
      }
    });

    // Breakfast reminder
    const [breakfastHour, breakfastMin] = schedule.breakfastTime.split(':').map(Number);
    notifications.push({
      title: '🍳 Breakfast Time!',
      body: 'Start your day with a high-protein breakfast.',
      id: 3,
      schedule: {
        on: {
          hour: breakfastHour,
          minute: breakfastMin
        },
        repeats: true,
        allowWhileIdle: true
      }
    });

    // Lunch reminder
    const [lunchHour, lunchMin] = schedule.lunchTime.split(':').map(Number);
    notifications.push({
      title: '🥗 Lunch Time!',
      body: "Refuel with a balanced lunch. Don't forget your carbs!",
      id: 4,
      schedule: {
        on: {
          hour: lunchHour,
          minute: lunchMin
        },
        repeats: true,
        allowWhileIdle: true
      }
    });

    // Dinner reminder
    const [dinnerHour, dinnerMin] = schedule.dinnerTime.split(':').map(Number);
    notifications.push({
      title: '🍽️ Dinner Time!',
      body: 'Time for a protein-rich dinner to recover and grow.',
      id: 5,
      schedule: {
        on: {
          hour: dinnerHour,
          minute: dinnerMin
        },
        repeats: true,
        allowWhileIdle: true
      }
    });

    // Hydration reminder (every 3 hours during the day)
    for (let hour = 8; hour <= 20; hour += 3) {
      notifications.push({
        title: '💧 Stay Hydrated',
        body: 'Remember to drink water!',
        id: 10 + hour,
        schedule: {
          on: {
            hour: hour,
            minute: 0
          },
          repeats: true,
          allowWhileIdle: true
        }
      });
    }

    await LocalNotifications.schedule({
      notifications: notifications as any
    });

    console.log('Daily reminders scheduled successfully');
    return true;
  } catch (error) {
    console.error('Error scheduling notifications:', error);
    return false;
  }
}

export async function cancelAllNotifications() {
  try {
    const pending = await LocalNotifications.getPending();
    const ids = pending.notifications.map(n => ({ id: n.id }));
    if (ids.length > 0) {
      await LocalNotifications.cancel({ notifications: ids });
    }
    console.log('All notifications cancelled');
  } catch (error) {
    console.error('Error cancelling notifications:', error);
  }
}

export async function getPendingNotifications() {
  try {
    const pending = await LocalNotifications.getPending();
    return pending.notifications;
  } catch (error) {
    console.error('Error getting pending notifications:', error);
    return [];
  }
}
