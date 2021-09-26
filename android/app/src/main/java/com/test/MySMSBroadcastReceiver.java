package com.test;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.google.android.gms.auth.api.phone.SmsRetriever;
import com.google.android.gms.common.api.CommonStatusCodes;
import com.google.android.gms.common.api.Status;
import com.facebook.react.modules.core.DeviceEventManagerModule;import com.facebook.react.bridge.WritableMap;import com.facebook.react.bridge.Arguments;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * BroadcastReceiver to wait for SMS messages. This can be registered either
 * in the AndroidManifest or at runtime.  Should filter Intents on
 * SmsRetriever.SMS_RETRIEVED_ACTION.
 */
public class MySMSBroadcastReceiver extends BroadcastReceiver {


    @Override
    public void onReceive(final Context context, Intent intent) {
        if (SmsRetriever.SMS_RETRIEVED_ACTION.equals(intent.getAction())) {
            Bundle extras = intent.getExtras();
            Status status = (Status) extras.get(SmsRetriever.EXTRA_STATUS);

            switch(status.getStatusCode()) {
                case CommonStatusCodes.SUCCESS:
                    // Get SMS message contents
                    String message = (String) extras.get(SmsRetriever.EXTRA_SMS_MESSAGE);
                    Log.d("otp",message);
                    WritableMap params = Arguments.createMap();
                    params.putString("eventProperty", message);
                    CalendarModule.sendEvent("EventReminder", params);
                    //Log.d("otp-code",parseCode(message));
                    break;
                case CommonStatusCodes.TIMEOUT:
                    Log.d("otp","Error");
                    CalendarModule.sendEvent("EventReminder", null);
                    // Waiting for SMS timed out (5 minutes)
                    // Handle the error ...
                    break;
            }
        }
    }


    public String parseCode(String message) {
        Pattern p = Pattern.compile("\\b\\d{6}\\b");
        Matcher m = p.matcher(message);
        String code = "";
        while (m.find()) {
            code = m.group(0);
        }
        return code;
    }



}
