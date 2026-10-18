package com.cyberhayat.app.ui

import android.annotation.SuppressLint
import android.content.ActivityNotFoundException
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.net.Uri
import android.view.ViewGroup
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.RenderProcessGoneDetail
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.compose.BackHandler
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.displayCutout
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.ime
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.systemBars
import androidx.compose.foundation.layout.union
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color as ComposeColor
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.webkit.WebSettingsCompat
import androidx.webkit.WebViewAssetLoader
import androidx.webkit.WebViewFeature
import com.cyberhayat.app.NativeBridge
import java.io.ByteArrayInputStream
import kotlin.math.roundToInt

private const val HOST = "appassets.androidplatform.net"
private const val START_URL = "https://$HOST/assets/www/index.html"
private const val OFFLINE_URL = "https://$HOST/assets/www/offline.html"

/** Exact hosts Apps Script uses: the /exec endpoint and its redirect target. */
private val BACKEND_HOSTS = setOf("script.google.com", "script.googleusercontent.com")

/** Only these schemes may leave the app, and only to a system handler. */
private val EXTERNAL_SCHEMES = setOf("http", "https", "tel", "mailto", "sms", "smsto")

/**
 * Hosts the bundled Cyber Hayat site (assets/www) full-screen and edge-to-edge.
 * The page gets the real system-bar / cutout sizes, so nothing sits under the status bar
 * and nothing is off-screen. Everything except the Apps Script backend is blocked.
 */
@SuppressLint("SetJavaScriptEnabled")
@Composable
fun CyberHayatApp(
    bridge: NativeBridge,
    locked: Boolean,
    onUnlock: () -> Unit,
    onPageUrl: (String?) -> Unit,
    onWebView: (WebView) -> Unit = {}
) {
    var webView by remember { mutableStateOf<WebView?>(null) }
    var canGoBack by remember { mutableStateOf(false) }
    var reloadKey by remember { mutableIntStateOf(0) }

    // File picker for the evidence vault (<input type="file"> inside the WebView).
    var chooser by remember { mutableStateOf<ValueCallback<Array<Uri>>?>(null) }
    val picker = rememberLauncherForActivityResult(ActivityResultContracts.OpenMultipleDocuments()) { uris ->
        chooser?.onReceiveValue(uris.toTypedArray())
        chooser = null
    }

    // ---- real insets, in CSS px (1 dp == 1 CSS px) ----
    val density = LocalDensity.current
    val bars = WindowInsets.systemBars.union(WindowInsets.displayCutout)
    val d = density.density
    val top = (bars.getTop(density) / d).roundToInt()
    val left = (bars.getLeft(density, LayoutDirection.Ltr) / d).roundToInt()
    val right = (bars.getRight(density, LayoutDirection.Ltr) / d).roundToInt()
    val imeOpen = WindowInsets.ime.getBottom(density) > 0
    val bottom = if (imeOpen) 0 else (bars.getBottom(density) / d).roundToInt()
    val insetsJs = "window.__CH_INSETS=[$top,$right,$bottom,$left];" +
        "if(window.CH_setInsets){CH_setInsets($top,$right,$bottom,$left);}"

    LaunchedEffect(insetsJs, webView) { webView?.evaluateJavascript(insetsJs, null) }
    BackHandler(enabled = canGoBack) { webView?.goBack() }

    Box(Modifier.fillMaxSize().background(ComposeColor.White)) {
        key(reloadKey) {
            AndroidView(
                modifier = Modifier.fillMaxSize().imePadding(),
                factory = { ctx ->
                    val loader = WebViewAssetLoader.Builder()
                        .setDomain(HOST)
                        .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(ctx))
                        .build()

                    WebView(ctx).apply {
                        layoutParams = ViewGroup.LayoutParams(
                            ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT
                        )
                        setBackgroundColor(Color.WHITE)
                        overScrollMode = WebView.OVER_SCROLL_NEVER
                        settings.apply {
                            javaScriptEnabled = true
                            domStorageEnabled = true
                            allowFileAccess = false
                            allowContentAccess = false
                            javaScriptCanOpenWindowsAutomatically = false
                            setSupportMultipleWindows(false)
                            setGeolocationEnabled(false)
                            mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
                            textZoom = 100
                            useWideViewPort = true
                            loadWithOverviewMode = false
                            setSupportZoom(false)
                            builtInZoomControls = false
                            displayZoomControls = false
                            cacheMode = WebSettings.LOAD_DEFAULT
                        }
                        if (WebViewFeature.isFeatureSupported(WebViewFeature.ALGORITHMIC_DARKENING)) {
                            WebSettingsCompat.setAlgorithmicDarkeningAllowed(settings, false)
                        }
                        addJavascriptInterface(bridge, "CHNative")

                        webViewClient = object : WebViewClient() {
                            override fun shouldInterceptRequest(
                                view: WebView, request: WebResourceRequest
                            ): WebResourceResponse? {
                                val host = request.url.host
                                return when {
                                    host == HOST -> loader.shouldInterceptRequest(request.url)
                                    host != null && host in BACKEND_HOSTS -> null   // sync + AI answers
                                    else -> WebResourceResponse(                    // everything else is offline
                                        "text/plain", "utf-8", 403, "Blocked", emptyMap(),
                                        ByteArrayInputStream(ByteArray(0))
                                    )
                                }
                            }

                            override fun shouldOverrideUrlLoading(
                                view: WebView, request: WebResourceRequest
                            ): Boolean {
                                val uri = request.url
                                val scheme = uri.scheme?.lowercase()
                                if (scheme == "https" && uri.host == HOST) return false   // in-app page
                                if (scheme != null && scheme in EXTERNAL_SCHEMES) openExternally(ctx, uri)
                                return true   // intent:, file:, javascript:, content:, ... are ignored
                            }

                            override fun onReceivedError(
                                view: WebView, request: WebResourceRequest, error: WebResourceError
                            ) {
                                if (request.isForMainFrame && request.url.toString() != OFFLINE_URL) {
                                    view.loadUrl(OFFLINE_URL)   // friendly screen instead of a blank view
                                }
                            }

                            override fun onReceivedHttpError(
                                view: WebView, request: WebResourceRequest, errorResponse: WebResourceResponse
                            ) {
                                if (request.isForMainFrame && errorResponse.statusCode >= 400 &&
                                    request.url.toString() != OFFLINE_URL
                                ) view.loadUrl(OFFLINE_URL)
                            }

                            override fun onRenderProcessGone(
                                view: WebView, detail: RenderProcessGoneDetail
                            ): Boolean {
                                reloadKey++   // rebuild the WebView instead of crashing
                                return true
                            }

                            override fun onPageCommitVisible(v: WebView, url: String?) {
                                v.evaluateJavascript(insetsJs, null)
                            }
                            override fun onPageFinished(v: WebView, url: String?) {
                                v.evaluateJavascript(insetsJs, null)
                                canGoBack = v.canGoBack()
                                onPageUrl(url)
                            }
                            override fun doUpdateVisitedHistory(v: WebView, url: String?, isReload: Boolean) {
                                canGoBack = v.canGoBack()
                                onPageUrl(url)
                            }
                        }
                        webChromeClient = object : WebChromeClient() {
                            override fun onShowFileChooser(
                                webView: WebView, filePathCallback: ValueCallback<Array<Uri>>,
                                fileChooserParams: WebChromeClient.FileChooserParams
                            ): Boolean {
                                chooser?.onReceiveValue(null)
                                chooser = filePathCallback
                                picker.launch(arrayOf("image/*", "application/pdf", "video/*", "audio/*", "text/plain"))
                                return true
                            }
                        }
                        loadUrl(START_URL)
                        webView = this
                        onWebView(this)
                    }
                },
                onRelease = { it.destroy() }
            )
        }
        if (locked) LockScreen(onUnlock)
    }
}

@Composable
private fun LockScreen(onUnlock: () -> Unit) {
    Box(
        Modifier.fillMaxSize().background(ComposeColor(0xFF0B1220)),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Text("Cyber Hayat", color = ComposeColor.White)
            Text("Locked for your privacy", color = ComposeColor(0xFFB6BFCC))
            Button(onClick = onUnlock) { Text("Unlock") }
        }
    }
}

private fun openExternally(ctx: Context, uri: Uri) {
    val action = if (uri.scheme == "tel") Intent.ACTION_DIAL else Intent.ACTION_VIEW
    try {
        ctx.startActivity(Intent(action, uri).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
    } catch (_: ActivityNotFoundException) { /* no app can handle it */ }
}
