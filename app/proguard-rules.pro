-keep class androidx.webkit.** { *; }
# the page calls these through window.CHNative
-keepclassmembers class com.cyberhayat.app.NativeBridge { @android.webkit.JavascriptInterface <methods>; }
