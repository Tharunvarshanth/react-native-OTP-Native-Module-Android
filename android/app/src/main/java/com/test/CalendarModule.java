package com.test; // replace com.your-app-name with your app’s name
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.android.gms.auth.api.phone.SmsRetriever;
import com.google.android.gms.auth.api.phone.SmsRetrieverClient;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;

import java.util.Map;
import java.util.HashMap;

public class CalendarModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;
    CalendarModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
    }



    @ReactMethod
    public void createCalendarEvent(String name, String location) {
        SmsRetrieverClient client = SmsRetriever.getClient(this.getReactApplicationContext());
        Task<Void> task = client.startSmsRetriever();

        task.addOnSuccessListener(new OnSuccessListener<Void>() {
            @Override
            public void onSuccess(Void aVoid) {
                // Successfully started retriever, expect broadcast intent
                // ...
                Toast.makeText(getReactApplicationContext(),"k",Toast.LENGTH_LONG).show();
            }
        });

        task.addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(@NonNull Exception e) {
                Toast.makeText(getReactApplicationContext(),"h",Toast.LENGTH_LONG).show();
                // Failed to start retriever, inspect Exception for more details
                // ...
            }
        });
      //  Toast.makeText(getReactApplicationContext(),name,Toast.LENGTH_LONG).show();
        Log.d("CalendarModule", "Create event called with name: " + name   + " and location: " + location);
    }
    public static void sendEvent(String eventName, @Nullable WritableMap params) {

        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }





    @NonNull
    @Override
    public String getName() {
        return "CalendarModule";
    }
}
