plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("org.jetbrains.kotlin.plugin.compose")
}

// ---- helpers: read a value from -P gradle property, then environment ----
fun cfg(prop: String, env: String): String? =
    (project.findProperty(prop) as String?)?.takeIf { it.isNotBlank() } ?: System.getenv(env)?.takeIf { it.isNotBlank() }

val keystorePath = cfg("chKeystore", "CH_KEYSTORE")
val hasKeystore = keystorePath != null && file(keystorePath).exists()

android {
    namespace = "com.cyberhayat.app"
    compileSdk = 36   // Google Play requires targetSdk 36 for new apps/updates since 2026-08-31

    defaultConfig {
        applicationId = "com.cyberhayat.app"
        minSdk = 24
        targetSdk = 36
        // CI passes -PversionCode=<run number> -PversionName=<x.y.z>
        versionCode = (project.findProperty("versionCode") as String?)?.toIntOrNull() ?: 1
        versionName = (project.findProperty("versionName") as String?) ?: "1.0"
    }

    signingConfigs {
        create("release") {
            if (hasKeystore) {
                storeFile = file(keystorePath!!)
                storePassword = cfg("chKeystorePassword", "CH_KEYSTORE_PASSWORD")
                keyAlias = cfg("chKeyAlias", "CH_KEY_ALIAS")
                keyPassword = cfg("chKeyPassword", "CH_KEY_PASSWORD")
            }
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
            // No silent fallback to the debug key: release builds fail without a real keystore (see below).
            signingConfig = signingConfigs.getByName("release")
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions { jvmTarget = "17" }
    buildFeatures { compose = true }
    packaging { resources.excludes += "/META-INF/{AL2.0,LGPL2.1}" }

    sourceSets {
        getByName("main") {
            // config.js is generated at build time and never committed
            assets.srcDir(layout.buildDirectory.dir("generated/chconfig").get().asFile)
        }
    }
}

// ---- generate assets/www/assets/js/config.js from secrets (never stored in git) ----
val generateChConfig = tasks.register("generateChConfig") {
    val outFile = layout.buildDirectory.file("generated/chconfig/www/assets/js/config.js")
    val url = cfg("chAppsScriptUrl", "CH_APPS_SCRIPT_URL") ?: ""
    val secret = cfg("chSharedSecret", "CH_SHARED_SECRET") ?: ""
    outputs.file(outFile)
    outputs.upToDateWhen { false }   // secret is deliberately not registered as a task input
    doLast {
        fun esc(s: String) = s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "")
        val f = outFile.get().asFile
        f.parentFile.mkdirs()
        f.writeText("window.CH_CONFIG={APPS_SCRIPT_URL:\"${esc(url)}\",SHARED_SECRET:\"${esc(secret)}\"};\n")
        if (url.isEmpty() || secret.isEmpty()) {
            logger.warn("CH_APPS_SCRIPT_URL / CH_SHARED_SECRET not set: the app will work offline-only (no team sync, no live AI).")
        }
    }
}
tasks.named("preBuild") { dependsOn(generateChConfig) }
tasks.matching { it.name.startsWith("merge") && it.name.endsWith("Assets") }.configureEach { dependsOn(generateChConfig) }

// ---- fail release builds that are not signed with a real, persistent keystore ----
gradle.taskGraph.whenReady {
    val buildsRelease = allTasks.any {
        it.project == project && it.name.contains("Release", ignoreCase = true) &&
            (it.name.startsWith("assemble") || it.name.startsWith("bundle") || it.name.startsWith("package"))
    }
    if (buildsRelease && !hasKeystore) {
        throw GradleException(
            "Release signing is not configured. Set CH_KEYSTORE (path), CH_KEYSTORE_PASSWORD, CH_KEY_ALIAS and " +
                "CH_KEY_PASSWORD (or -PchKeystore=...). Use assembleDebug for an unsigned-release-key test build."
        )
    }
}

dependencies {
    val composeBom = platform("androidx.compose:compose-bom:2025.06.01")
    implementation(composeBom)
    implementation("androidx.core:core-ktx:1.16.0")
    implementation("androidx.activity:activity-compose:1.10.1")
    implementation("androidx.fragment:fragment-ktx:1.8.6")
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.webkit:webkit:1.13.0")
    implementation("androidx.biometric:biometric:1.1.0")
}
