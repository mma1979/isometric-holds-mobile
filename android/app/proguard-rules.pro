# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# react-native-reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# React Native
-keepclassmembers class * extends com.facebook.react.bridge.NativeModule {
    @com.facebook.react.bridge.ReactMethod *;
}
-keep class com.facebook.react.bridge.JavaScriptModule { *; }
-keep class * extends com.facebook.react.bridge.JavaScriptModule { *; }
-keepclassmembers class * {
    @com.facebook.react.uimanager.annotations.ReactProp *;
    @com.facebook.react.uimanager.annotations.ReactPropGroup *;
}

# React Native SVG
-keep public class com.horcrux.svg.** { *; }

# React Native WebView
-keep public class com.reactnativecommunity.webview.** { *; }

# Expo Modules Core
-keepclassmembers class * extends expo.modules.kotlin.modules.Module { *; }
-keep class expo.modules.** { *; }

# Async Storage
-keep class com.reactnativecommunity.asyncstorage.** { *; }

# Suppress harmless warnings for optional dependencies
-dontwarn okio.**
-dontwarn com.facebook.react.**
-dontwarn expo.modules.**
