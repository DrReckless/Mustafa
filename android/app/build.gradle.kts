import java.util.Properties

plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

// İmzalama bilgileri: ortam değişkenlerinden veya keystore.properties dosyasından okunur (depoya eklenmez)
val signProps = Properties().apply {
    val f = rootProject.file("keystore.properties")
    if (f.exists()) f.inputStream().use { load(it) }
}
fun sign(key: String, env: String): String? = System.getenv(env) ?: signProps.getProperty(key)

android {
    namespace = "com.hanturk.plan3d"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.hanturk.plan3d"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
    }

    signingConfigs {
        create("release") {
            val store = sign("storeFile", "HANTURK_KEYSTORE")
            if (store != null) {
                storeFile = file(store)
                storePassword = sign("storePassword", "HANTURK_KEYSTORE_PASSWORD")
                keyAlias = sign("keyAlias", "HANTURK_KEY_ALIAS")
                keyPassword = sign("keyPassword", "HANTURK_KEY_PASSWORD")
            }
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
            val rel = signingConfigs.getByName("release")
            signingConfig = if (rel.storeFile != null) rel else signingConfigs.getByName("debug")
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        buildConfig = true
    }
    androidResources {
        // Web dosyaları sıkıştırılmadan paketlenir (hızlı yükleme)
        noCompress += listOf("js", "css", "html", "png")
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.activity:activity-ktx:1.9.3")
    implementation("androidx.webkit:webkit:1.12.1")
}
