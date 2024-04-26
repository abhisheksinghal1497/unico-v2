package com.unico.react;

import static com.henninghall.date_picker.DatePickerPackage.context;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.util.Log;

import androidx.core.app.NotificationCompat;

import com.google.firebase.messaging.RemoteMessage;
import com.salesforce.androidsdk.push.SFDCFcmListenerService;
import com.unico.react.MainActivity;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Map;

public class NotificationService extends SFDCFcmListenerService {

    @Override
    public void onMessageReceived(RemoteMessage message) {
        super.onMessageReceived(message);

        // Extract data from the message payload
        Map<String, String> data = message.getData();

      Log.e("Notification Res","Notification Triggered"+data);

        try {
            // Extract the "content" field as a JSON string
            String contentString = data.get("content");

            // Parse the "content" field as JSON
            JSONObject contentJson = new JSONObject(contentString);

            // Extract the nested "sfdc" field as a JSON object
            JSONObject sfdcJson = contentJson.getJSONObject("sfdc");

            // Extract individual fields
            String alertTitle = sfdcJson.getString("alertTitle");
            String alertBody = sfdcJson.getString("alertBody");
            String LoanApplId = sfdcJson.getString("sid");

            alertTitle = removeHtmlTags(alertTitle);
            alertBody = removeHtmlTags(alertBody);

            // Display notification
            sendNotification(alertTitle, alertBody, LoanApplId);
        } catch (JSONException e) {
            Log.e(NotificationModule.class.getSimpleName(),
                    "Error parsing push notification payload: " + e.getMessage(), e);
        }
    }

    private String removeHtmlTags(String input) {
        return android.text.Html.fromHtml(input, android.text.Html.FROM_HTML_MODE_LEGACY).toString();
    }

    private void sendNotification(String title, String body, String LoanApplId) {
        NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);

        int notificationId = 1; // You can use a unique ID for each notification
        String channelId = "UNICO"; // The id of the channel.
        CharSequence channelName = "UNICO sales pro"; // The user-visible name of the channel.
        Intent intent = new Intent(this, MainActivity.class);
        intent.setAction("NOTIFICATION_CLICKED");

        intent.putExtra("sid", LoanApplId);
        PendingIntent pendingIntent = PendingIntent.getActivity(
                this, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);

        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, channelId)
                .setSmallIcon(R.drawable.sf__icon)
                .setContentTitle(title)
                .setContentText(body)
                .setAutoCancel(true);
        builder.setContentIntent(pendingIntent);
        // For Android Oreo and higher, you need to create a notification channel
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            int importance = NotificationManager.IMPORTANCE_HIGH;
            NotificationChannel channel = new NotificationChannel(channelId, channelName, importance);
            channel.enableLights(true);
            channel.setLightColor(Color.RED);
            channel.enableVibration(true);
            builder.setChannelId(channelId);
            notificationManager.createNotificationChannel(channel);
        }

        Notification notification = builder.build();
        notificationManager.notify(notificationId, notification);
    }
}
