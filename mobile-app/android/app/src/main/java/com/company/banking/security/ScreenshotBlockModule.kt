package com.company.banking.security

import android.view.WindowManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class ScreenshotBlockModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "ScreenshotBlockModule"
    }

    @ReactMethod
    fun enableFlagSecure() {
        currentActivity?.runOnUiThread {
            currentActivity?.window?.setFlags(
                WindowManager.LayoutParams.FLAG_SECURE,
                WindowManager.LayoutParams.FLAG_SECURE
            )
        }
    }

    @ReactMethod
    fun disableFlagSecure() {
        currentActivity?.runOnUiThread {
            currentActivity?.window?.clearFlags(
                WindowManager.LayoutParams.FLAG_SECURE
            )
        }
    }
}
