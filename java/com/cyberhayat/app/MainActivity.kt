package com.cyberhayat.app

import android.app.ActivityManager
import android.content.Intent
import android.graphics.Color
import android.net.Uri
import android.os.Bundle
import android.print.PrintAttributes
import android.print.PrintManager
import android.view.WindowManager
import android.webkit.WebView
import androidx.activity.SystemBarStyle
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricManager.Authenticators.BIOMETRIC_WEAK
import androidx.biometric.BiometricManager.Authenticators.DEVICE_CREDENTIAL
import androidx.biometric.BiometricPrompt
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.core.content.ContextCompat
import androidx.fragment.app.FragmentActivity
import com.cyberhayat.app.ui.CyberHayatApp
import com.cyberhayat.app.ui.theme.CyberHayatTheme

class MainActivity : FragmentActivity(), NativeHost {

    private lateinit var prefs: NativePrefs
    private var locked by mutableStateOf(false)
    private var sensitivePage = false
    private var prompting = false
    private var webViewRef: WebView? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        prefs = NativePrefs(this)
        enableEdgeToEdge(
            statusBarStyle = SystemBarStyle.light(Color.TRANSPARENT, Color.TRANSPARENT),
            navigationBarStyle = SystemBarStyle.light(Color.TRANSPARENT, Color.TRANSPARENT)
        )
        locked = prefs.appLock && canAuthenticate()
        applySecure()
        Disguise.label(Disguise.current(this))?.let { setTaskDescription(ActivityManager.TaskDescription(it)) }
        val bridge = NativeBridge(this, prefs, this)
        setContent {
            CyberHayatTheme {
                CyberHayatApp(
                    bridge = bridge,
                    locked = locked,
                    onUnlock = { promptUnlock() },
                    onPageUrl = { url -> onPageUrl(url) },
                    onWebView = { webViewRef = it }
                )
            }
        }
    }

    override fun onStart() {
        super.onStart()
        if (locked) promptUnlock()
    }

    override fun onPause() {
        super.onPause()
        // With app lock on, never let the recents thumbnail show content.
        if (prefs.appLock) window.addFlags(WindowManager.LayoutParams.FLAG_SECURE)
    }

    override fun onResume() {
        super.onResume()
        applySecure()
    }

    override fun onStop() {
        super.onStop()
        if (prefs.appLock && canAuthenticate()) locked = true
    }

    /** FLAG_SECURE: hides the app in recents and blocks screenshots / screen recording. */
    private fun applySecure() {
        if (prefs.secureScreens && sensitivePage) {
            window.addFlags(WindowManager.LayoutParams.FLAG_SECURE)
        } else {
            window.clearFlags(WindowManager.LayoutParams.FLAG_SECURE)
        }
    }

    private fun onPageUrl(url: String?) {
        val path = url?.let { Uri.parse(it).path } ?: ""
        sensitivePage = listOf("chatbot", "resources", "vault", "safety", "triage", "checker")
            .any { path.endsWith("$it.html") }
        applySecure()
    }

    private fun canAuthenticate(): Boolean =
        BiometricManager.from(this).canAuthenticate(BIOMETRIC_WEAK or DEVICE_CREDENTIAL) ==
            BiometricManager.BIOMETRIC_SUCCESS

    private fun promptUnlock() {
        if (prompting) return
        prompting = true
        val info = BiometricPrompt.PromptInfo.Builder()
            .setTitle("Unlock Cyber Hayat")
            .setSubtitle("Confirm it's you")
            .setAllowedAuthenticators(BIOMETRIC_WEAK or DEVICE_CREDENTIAL)
            .build()
        val prompt = BiometricPrompt(
            this, ContextCompat.getMainExecutor(this),
            object : BiometricPrompt.AuthenticationCallback() {
                override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                    prompting = false
                    locked = false
                }
                override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
                    prompting = false   // stay locked; the lock screen offers a retry button
                }
            }
        )
        prompt.authenticate(info)
    }

    // ---- NativeHost: what the page can ask for ----
    override fun onSecureChanged() = applySecure()

    override fun quickExit() {
        webViewRef?.let { it.loadUrl("about:blank"); it.clearHistory() }
        finishAndRemoveTask()
    }

    override fun printPage() {
        val wv = webViewRef ?: return
        val pm = getSystemService(PRINT_SERVICE) as PrintManager
        pm.print("Cyber Hayat", wv.createPrintDocumentAdapter("Cyber Hayat"), PrintAttributes.Builder().build())
    }

    override fun shareText(text: String) {
        val send = Intent(Intent.ACTION_SEND).setType("text/plain").putExtra(Intent.EXTRA_TEXT, text)
        startActivity(Intent.createChooser(send, null))
    }

    override fun disguise(): String = Disguise.current(this)

    override fun setDisguise(mode: String) {
        Disguise.apply(this, mode)
        Disguise.label(mode)?.let { setTaskDescription(ActivityManager.TaskDescription(it)) }
    }
}
