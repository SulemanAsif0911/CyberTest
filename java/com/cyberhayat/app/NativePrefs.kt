package com.cyberhayat.app

import android.content.Context

/** Small native-side settings (the web layer reads/writes them through [NativeBridge]). */
class NativePrefs(context: Context) {
    private val p = context.applicationContext.getSharedPreferences("ch_native", Context.MODE_PRIVATE)

    /** Hide content in recent apps + block screenshots on the Assistant / Resources pages. Default ON. */
    var secureScreens: Boolean
        get() = p.getBoolean("secure_screens", true)
        set(v) { p.edit().putBoolean("secure_screens", v).apply() }

    /** Ask for biometrics / device credential when the app is opened. Default OFF. */
    var appLock: Boolean
        get() = p.getBoolean("app_lock", false)
        set(v) { p.edit().putBoolean("app_lock", v).apply() }
}
