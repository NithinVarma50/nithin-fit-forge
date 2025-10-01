import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  requestNotificationPermission,
  checkNotificationPermission,
  scheduleDailyReminders,
  cancelAllNotifications,
  getPendingNotifications,
  NotificationSchedule,
} from "@/utils/notifications";

const NotificationSettings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [schedule, setSchedule] = useState<NotificationSchedule>({
    workoutTime: "17:30",
    breakfastTime: "08:00",
    lunchTime: "12:30",
    dinnerTime: "19:00",
  });
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    checkPermissionStatus();
    updatePendingCount();
  }, []);

  const checkPermissionStatus = async () => {
    const permission = await checkNotificationPermission();
    setHasPermission(permission);
    setNotificationsEnabled(permission);
  };

  const updatePendingCount = async () => {
    const pending = await getPendingNotifications();
    setPendingCount(pending.length);
  };

  const handleEnableNotifications = async () => {
    if (!hasPermission) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        toast.error("Notification permission denied. Please enable it in your device settings.");
        return;
      }
      setHasPermission(true);
    }

    const success = await scheduleDailyReminders(schedule);
    if (success) {
      setNotificationsEnabled(true);
      await updatePendingCount();
      toast.success("Daily reminders enabled! You'll get notifications even when the app is closed.");
    } else {
      toast.error("Failed to schedule notifications. Please try again.");
    }
  };

  const handleDisableNotifications = async () => {
    await cancelAllNotifications();
    setNotificationsEnabled(false);
    setPendingCount(0);
    toast.success("All notifications cancelled.");
  };

  const handleScheduleChange = (key: keyof NotificationSchedule, value: string) => {
    setSchedule(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSchedule = async () => {
    if (notificationsEnabled) {
      const success = await scheduleDailyReminders(schedule);
      if (success) {
        await updatePendingCount();
        toast.success("Notification schedule updated!");
      } else {
        toast.error("Failed to update schedule. Please try again.");
      }
    } else {
      toast.info("Enable notifications first to save the schedule.");
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold">Daily Reminders</h3>
          <p className="text-sm text-muted-foreground">
            Get notified even when the app is closed
          </p>
        </div>
        <Switch
          checked={notificationsEnabled}
          onCheckedChange={(checked) => {
            if (checked) {
              handleEnableNotifications();
            } else {
              handleDisableNotifications();
            }
          }}
        />
      </div>

      {notificationsEnabled && (
        <div className="mt-4 p-3 bg-success/10 text-success rounded-lg text-sm">
          ✓ {pendingCount} notifications scheduled
        </div>
      )}

      <div className="space-y-4 mt-6">
        <div>
          <Label htmlFor="workout-time">Workout Time</Label>
          <Input
            id="workout-time"
            type="time"
            value={schedule.workoutTime}
            onChange={(e) => handleScheduleChange("workoutTime", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="breakfast-time">Breakfast Time</Label>
          <Input
            id="breakfast-time"
            type="time"
            value={schedule.breakfastTime}
            onChange={(e) => handleScheduleChange("breakfastTime", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="lunch-time">Lunch Time</Label>
          <Input
            id="lunch-time"
            type="time"
            value={schedule.lunchTime}
            onChange={(e) => handleScheduleChange("lunchTime", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="dinner-time">Dinner Time</Label>
          <Input
            id="dinner-time"
            type="time"
            value={schedule.dinnerTime}
            onChange={(e) => handleScheduleChange("dinnerTime", e.target.value)}
          />
        </div>

        <Button 
          onClick={handleSaveSchedule}
          className="w-full"
          disabled={!notificationsEnabled}
        >
          Save Schedule
        </Button>
      </div>

      {!hasPermission && (
        <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
          📱 Notification permission required. Click the switch above to enable.
        </div>
      )}

      <div className="mt-6 space-y-2 text-sm text-muted-foreground">
        <p className="font-semibold">You'll receive reminders for:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Pre-workout snack (1 hour before workout)</li>
          <li>Workout time</li>
          <li>Breakfast, lunch, and dinner</li>
          <li>Hydration (every 3 hours)</li>
        </ul>
      </div>
    </Card>
  );
};

export default NotificationSettings;
