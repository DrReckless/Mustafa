#!/usr/bin/env bash
# Beylik APK derleme betiği (Gradle gerektirmez; sadece Android SDK + JDK)
# Kullanım: ./build_apk.sh   → çıktı: dist/Beylik.apk
set -euo pipefail
cd "$(dirname "$0")"
SDK="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-/opt/android-sdk}}"
BT="$SDK/build-tools/35.0.0"
PLAT="$SDK/platforms/android-34/android.jar"
VERSION_CODE="${VERSION_CODE:-4}"
VERSION_NAME="${VERSION_NAME:-0.4}"

# 1) 3D motoru paketle
if [ -d tools/node_modules ]; then (cd tools && node build.mjs); fi

rm -rf build && mkdir -p build/gen build/classes build/assets dist
cp -r www build/assets/www

# 2) Kaynaklar ve manifest
"$BT/aapt2" compile --dir android/res -o build/res.zip
"$BT/aapt2" link -o build/base.apk -I "$PLAT" \
  --manifest android/AndroidManifest.xml -A build/assets build/res.zip \
  --java build/gen --min-sdk-version 24 --target-sdk-version 34 \
  --version-code "$VERSION_CODE" --version-name "$VERSION_NAME" \
  -0 jpg -0 png -0 hdr

# 3) Java → dex
javac -nowarn -source 8 -target 8 -classpath "$PLAT" -d build/classes \
  $(find android/src build/gen -name '*.java') 2>&1 | grep -v "warning" || true
"$BT/d8" --min-api 24 --lib "$PLAT" --output build $(find build/classes -name '*.class')
cp build/base.apk build/unsigned.apk
(cd build && zip -q -j unsigned.apk classes.dex)

# 4) Hizala ve imzala
"$BT/zipalign" -f -p 4 build/unsigned.apk build/aligned.apk
if [ ! -f android/beylik.keystore ]; then
  keytool -genkeypair -keystore android/beylik.keystore -alias beylik -keyalg RSA -keysize 2048 \
    -validity 10000 -storepass beylik123 -keypass beylik123 -dname "CN=Beylik, O=Mustafa, C=TR"
fi
"$BT/apksigner" sign --ks android/beylik.keystore --ks-key-alias beylik \
  --ks-pass pass:beylik123 --key-pass pass:beylik123 --out dist/Beylik.apk build/aligned.apk
"$BT/apksigner" verify dist/Beylik.apk
ls -lh dist/Beylik.apk
