package com.cyberhayat.app

import android.webkit.JavascriptInterface
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricManager.Authenticators.BIOMETRIC_WEAK
import androidx.biometric.BiometricManager.Authenticators.DEVICE_CREDENTIAL
import androidx.fragment.app.FragmentActivity

/**
 * The only native surface exposed to the page (as `window.CHNative`). It only ever serves the
 * app's own bundled pages: every other origin is blocked or opened outside the app.
 */
class NativeBridge(
    private val activity: FragmentActivity,
    private val prefs: NativePrefs,
    private val host: NativeHost
) {
    private fun canAuth(): Boolean =
        BiometricManager.from(activity).canAuthenticate(BIOMETRIC_WEAK or DEVICE_CREDENTIAL) ==
            BiometricManager.BIOMETRIC_SUCCESS

    @JavascriptInterface fun getSecureScreens(): Boolean = prefs.secureScreens

    @JavascriptInterface fun setSecureScreens(enabled: Boolean) {
        prefs.secureScreens = enabled
        activity.runOnUiThread { host.onSecureChanged() }
    }

    @JavascriptInterface fun canAppLock(): Boolean = canAuth()
    @JavascriptInterface fun getAppLock(): Boolean = prefs.appLock
    @JavascriptInterface fun setAppLock(enabled: Boolean) { prefs.appLock = enabled && canAuth() }

    /** Close the app immediately and clear its back-stack. */
    @JavascriptInterface fun quickExit() { activity.runOnUiThread { host.quickExit() } }

    /** Opens Android's print dialog ("Save as PDF" is one of the choices). */
    @JavascriptInterface fun printPage() { activity.runOnUiThread { host.printPage() } }

    /** Opens the Android share sheet with plain text. */
    @JavascriptInterface fun shareText(text: String) {
        val t = text.take(4000)
        activity.runOnUiThread { host.shareText(t) }
    }

    /** "default", "notes" or "calc". */
    @JavascriptInterface fun getDisguise(): String = host.disguise()
    @JavascriptInterface fun setDisguise(mode: String) {
        if (mode == "default" || mode == "notes" || mode == "calc") activity.runOnUiThread { host.setDisguise(mode) }
    }
}
