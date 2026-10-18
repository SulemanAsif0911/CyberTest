package com.cyberhayat.app

import android.app.Application
import android.webkit.WebView

class CyberHayatApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        WebView.setWebContentsDebuggingEnabled(false)   // never inspectable in release
    }
}
