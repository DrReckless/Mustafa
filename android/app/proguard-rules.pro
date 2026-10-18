# JavaScript köprüsü metotları korunmalı
-keepclassmembers class com.hanturk.plan3d.NativeBridge {
    @android.webkit.JavascriptInterface <methods>;
}
-keepattributes JavascriptInterface
