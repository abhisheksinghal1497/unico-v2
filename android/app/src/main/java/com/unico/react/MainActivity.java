/*
 * Copyright (c) 2015-present, salesforce.com, inc.
 * All rights reserved.
 * Redistribution and use of this software in source and binary forms, with or
 * without modification, are permitted provided that the following conditions
 * are met:
 * - Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 * - Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 * - Neither the name of salesforce.com, inc. nor the names of its contributors
 * may be used to endorse or promote products derived from this software without
 * specific prior written permission of salesforce.com, inc.
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */
package com.unico.react;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.provider.Settings;
import android.util.Log;

import androidx.core.app.NotificationManagerCompat;

import com.facebook.react.ReactInstanceEventListener;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.salesforce.androidsdk.reactnative.ui.SalesforceReactActivity;

public class MainActivity extends SalesforceReactActivity {

    /**
     *
     * @return true if you want login to happen when application launches
     *         false otherwise
     */
	@Override
	public boolean shouldAuthenticate() {
			// System.out.println("djfssdf");
		return true;
	}

	/**
	 * Returns the name of the main component registered from JavaScript.
	 * This is used to schedule rendering of the component.
	 */
	@Override
	protected String getMainComponentName() {
		return "unico";
	}


	@Override
	protected void onCreate(Bundle savedInstanceState) {

		super.onCreate(savedInstanceState);
		// Check if the activity was started from a notification click
		if (!areNotificationsEnabled()) {
			showNotificationPermissionDialog();
		}
		handleNotificationIntent(getIntent());
	}

	private boolean areNotificationsEnabled() {
		return NotificationManagerCompat.from(this).areNotificationsEnabled();
	}

	private void showNotificationPermissionDialog() {
		AlertDialog.Builder builder = new AlertDialog.Builder(this);
		builder.setTitle("Enable Notifications");
		builder.setMessage("Please enable notifications to receive updates.");

		builder.setPositiveButton("Settings", new DialogInterface.OnClickListener() {
			@Override
			public void onClick(DialogInterface dialog, int which) {
				// Open app settings to enable notifications
				Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
				Uri uri = Uri.fromParts("package", getPackageName(), null);
				intent.setData(uri);
				startActivity(intent);
			}
		});

		builder.setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
			@Override
			public void onClick(DialogInterface dialog, int which) {
				// Handle user cancellation if needed
				Log.d("Notification", "User canceled notification permission");
			}
		});

		builder.show();
	}
	private void handleNotificationIntent(Intent intent) {
		if (intent != null && intent.getAction() != null) {
			if ("NOTIFICATION_CLICKED".equals(intent.getAction())) {
				parseNotificationData(intent);
			}
		}
	}
	private void parseNotificationData(Intent intent) {
		if (intent != null) {
			String sid = intent.getStringExtra("sid");
			if (sid != null) {
				// Send the event to React Native
				sendNotificationEvent(sid);
			}
		}
	}

	private void sendNotificationEvent(String sid) {
		try {
//
//			getReactInstanceManager().getCurrentReactContext()
//					.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
//					.emit("onNotificationClicked", sid);


			ReactInstanceManager reactInstanceManager = getReactNativeHost().getReactInstanceManager();
			ReactContext reactContext = reactInstanceManager.getCurrentReactContext();
			if(reactContext != null) {
				reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
						.emit("onNotificationClicked", sid);
			} else {
				reactInstanceManager.addReactInstanceEventListener(new ReactInstanceManager.ReactInstanceEventListener() {
					@Override
					public void onReactContextInitialized(ReactContext context) {
						context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
								.emit("onNotificationClicked", sid);
						reactInstanceManager.removeReactInstanceEventListener(this);
					}
				});
			}

		} catch (Exception e) {
			Log.e("Error", "Error sending notification event to React Native: " + e.getMessage());
		}
	}


	@Override
	public void onNewIntent(Intent intent) {
		super.onNewIntent(intent);
		handleNotificationIntent(intent);
	}
}


