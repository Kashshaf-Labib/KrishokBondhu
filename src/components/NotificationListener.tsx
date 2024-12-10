"use client";

import React, { useEffect, useState } from "react";
import Pusher from "pusher-js";

interface Notification {
  postId: string;
  expertName: string;
  content: string;
  createdAt: string;
}

const NotificationListener: React.FC<{ userId: string }> = ({ userId }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Initialize Pusher client
    const pusher = new Pusher("daa7c0ddb799cdba8335", {
      cluster: "ap2",
    });

    // Subscribe to the user's channel
    const channel = pusher.subscribe(`user-${userId}`);

    // Listen for the "new-advice" event
    channel.bind("new-advice", (data: Notification) => {
      setNotifications((prev) => [data, ...prev]); // Prepend the new notification
    });

    // Cleanup on unmount
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [userId]);

  return (
    <div className="fixed bottom-6 right-6 w-96 bg-white rounded-lg shadow-lg border border-gray-300 p-4 z-50">
      <h3 className="text-lg font-semibold mb-3">🔔 Notifications</h3>
      {notifications.length === 0 && (
        <p className="text-gray-500">No notifications yet!</p>
      )}
      <ul className="space-y-3">
        {notifications.map((notification, index) => (
          <li
            key={index}
            className="p-3 bg-gray-100 rounded-lg shadow-sm border border-gray-200"
          >
            <p className="font-semibold text-green-700">
              {notification.expertName} commented on your post!
            </p>
            <p className="text-gray-700">{notification.content}</p>
            <p className="text-sm text-gray-400">
              {new Date(notification.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationListener;
