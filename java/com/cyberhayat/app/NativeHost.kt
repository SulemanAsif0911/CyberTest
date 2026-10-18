package com.cyberhayat.app

/** What the web page may ask the app to do (through [NativeBridge]). */
interface NativeHost {
    fun onSecureChanged()
    fun quickExit()
    fun printPage()
    fun shareText(text: String)
    fun disguise(): String
    fun setDisguise(mode: String)
}
