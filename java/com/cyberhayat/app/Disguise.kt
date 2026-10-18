package com.cyberhayat.app

import android.content.ComponentName
import android.content.Context
import android.content.pm.PackageManager

/** Switches the launcher icon and name between the real app, "Notes" and "Calculator". */
object Disguise {
    private val ALIASES = linkedMapOf(
        "default" to "com.cyberhayat.app.AliasDefault",
        "notes" to "com.cyberhayat.app.AliasNotes",
        "calc" to "com.cyberhayat.app.AliasCalc"
    )

    fun label(mode: String): String? = when (mode) { "notes" -> "Notes"; "calc" -> "Calculator"; else -> null }

    fun current(ctx: Context): String {
        val pm = ctx.packageManager
        for ((mode, cls) in ALIASES) {
            if (mode == "default") continue
            if (pm.getComponentEnabledSetting(ComponentName(ctx.packageName, cls)) ==
                PackageManager.COMPONENT_ENABLED_STATE_ENABLED) return mode
        }
        return "default"
    }

    fun apply(ctx: Context, mode: String) {
        val pm = ctx.packageManager
        // Enable the chosen entry first so the app never has zero launcher icons.
        val order = ALIASES.entries.sortedBy { if (it.key == mode) 0 else 1 }
        for ((key, cls) in order) {
            pm.setComponentEnabledSetting(
                ComponentName(ctx.packageName, cls),
                if (key == mode) PackageManager.COMPONENT_ENABLED_STATE_ENABLED else PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
                PackageManager.DONT_KILL_APP
            )
        }
    }
}
