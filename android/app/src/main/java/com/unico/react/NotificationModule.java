package com.unico.react;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.util.Log;

import androidx.core.app.NotificationCompat;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class NotificationModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    private final String CHANNEL_ID = "Fedfina";

    public NotificationModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
        createNotificationChannel();
    }

    @Override
    public String getName() {
        return "NotificationModule";
    }

    @ReactMethod
    public void showNotification(String title, String message) {
        try {
            NotificationCompat.Builder builder = new NotificationCompat.Builder(reactContext, CHANNEL_ID)
                    .setContentTitle(title)
                    .setContentText(message)
                    .setSmallIcon(android.R.drawable.ic_notification_overlay)
                    .setPriority(NotificationCompat.PRIORITY_DEFAULT);

            Intent notificationIntent = new Intent(reactContext, MainActivity.class);

            PendingIntent contentIntent = PendingIntent.getActivity(
                    reactContext,
                    0,
                    notificationIntent,
                    PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );
            builder.setContentIntent(contentIntent);

            NotificationManager notificationManager = (NotificationManager) reactContext.getSystemService(Context.NOTIFICATION_SERVICE);
            emitEventToReactNative("onNotificationReceived", title,message);
            notificationManager.notify(1, builder.build());
        }
        catch (Exception e) {
            Log.e(NotificationModule.class.getSimpleName(), "Error in showNotification: " + e.getMessage());
        }
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            CharSequence name = "Fedfina sales pro";
            String description = " Fedfina sales pro Description";
            int importance = NotificationManager.IMPORTANCE_DEFAULT;
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, name, importance);
            channel.setDescription(description);

            NotificationManager notificationManager = reactContext.getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
    }

    private void emitEventToReactNative(String eventName,String title, String message) {
        WritableMap params = Arguments.createMap();
        params.putString("title", title);
        params.putString("message", message);

        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }



}
