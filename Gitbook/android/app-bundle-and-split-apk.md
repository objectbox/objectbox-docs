---
description: >-
  Troubleshoot or avoid crashes when using ObjectBox db and Android App Bundle
  or due to buggy devices. Google-certified devices prevent this crash.
---

# App Bundle, split APKs and LinkageError

Your app might observe crashes due to `UnsatisfiedLinkError` or (since ObjectBox 2.3.4) `LinkageError` on some devices. This has mainly two reasons:

* If your app uses the [App Bundle](https://developer.android.com/guide/app-bundle) format, the legacy split APK feature or [Multidex](https://developer.android.com/studio/build/multidex) the native library can't be found.
* Or if your app's minimum SDK level is below API 23 (Marshmallow), there are known bugs in Android's native library loading code.

Let us know if the below suggestions do not resolve your crashes in [GitHub issue 605](https://github.com/objectbox/objectbox-java/issues/605).

## App Bundle and split APKs

When using an App Bundle or split APKs Google Play only delivers the split APKs required for each user's device configuration, including its architecture (ABI). If users bypass Google Play to install your app (**"sideloading"**) they might not install all of the required split APKs. If the split APK containing the ObjectBox native library required for the device ABI is missing, your app will crash with `LinkageError` when building BoxStore.

### Using the Play Core library to check for missing splits

{% hint style="info" %}
**Update August 2020:** Google-certified devices (those running Google Play Services) or those running Android 10 (API level 29) or higher prevent users from sideloading split APKs, preventing this crash. Adding the below check is no longer necessary for these devices.
{% endhint %}

Add the [Play Core library](https://developer.android.com/guide/playcore) to the dependencies block:

```java
implementation 'com.google.android.play:core:1.7.3'
```

In the `Application` class add the missing split APKs check before calling `super.onCreate()`:

```java
public class App extends Application {

    @Override
    public void onCreate() {
        if (MissingSplitsManagerFactory.create(this).disableAppIfMissingRequiredSplits()) {
            return; // Skip app initialization.
        }
        super.onCreate();
        // ...
    }
}
```

If a broken installation is detected, users will see a message and Reinstall button asking them to re-install the app from Google Play.

See [how we updated our example app](https://github.com/objectbox/objectbox-examples/pull/53) to use the Play Core library detection.

If the Play Core library should not be used, there are two alternatives:

### Alternative: Catch exception and inform users

You can guard the MyObjectBox build call and for example display an activity with an info message (e.g. direct users to reinstall the app from Google Play, send you an error report, ...):

```java
// guard the build call and set some flag (here setting the boxStore field null)
try {
    boxStore = MyObjectBox.builder()
            .androidContext(context.getApplicationContext())
            .build();
} catch (LinkageError e) {
    boxStore = null;
    Log.e(App.TAG, "Failed to load ObjectBox: " + e.getMessage());
}


// then for example in the main activity check the flag in onCreate and 
// direct to an info/error message without the app crashing:
if (ObjectBox.get() == null) {
    startActivity(new Intent(this, ErrorActivity.class));
    finish();
    return;
}
```

As an example see [how we added this to our Android app example](https://github.com/objectbox/objectbox-examples/commit/e3af09d91181eea11db8959ceddf360f7b35a602).

### Alternative: turn off splitting by ABI

The simplest solution is to always include native libraries for all supported ABIs. However, this will increase the download size of your app for all users.

```
android {
    bundle {
        abi {
            // This property is set to true by default.
            enableSplit = false
        }
    }
}
```

Source: [Android Developers](https://developer.android.com/studio/projects/dynamic-delivery/configure-base#disable\_config\_apks)

## Buggy devices (API 22 or lower)

On some devices and if your **minimum SDK is below API 23** (Android 6.0 Marshmallow), loading the native library may fail with `LinkageError` due to known bugs in Android's native library loading code. To counter this ObjectBox includes support for the [ReLinker](https://github.com/KeepSafe/ReLinker) tool which will try to extract the native library manually if loading it normally fails.

To enable this, just add ReLinker to your dependencies:

```
// https://github.com/KeepSafe/ReLinker/releases
implementation 'com.getkeepsafe.relinker:relinker:1.4.1'
```

{% hint style="warning" %}
ObjectBox is calling ReLinker via reflection. If you are using ProGuard or Multidex, make sure to add keep rules so that ReLinker code is not stripped from the final app or is not in the primary dex file.
{% endhint %}

For ProGuard add this line:

```
-keep class com.getkeepsafe.relinker.** { *; }
```

For Multidex add a multiDexKeepProguard file to your build file:

```
android {
    buildTypes {
        release {
            multiDexKeepProguard file('multidex-config.pro')
        }
    }
}
```

And in the multidex-config.pro file add the same rule as above:

```
-keep class com.getkeepsafe.relinker.** { *; }
```

{% hint style="info" %}
[Multidex supports two file formats to keep files](https://developer.android.com/studio/build/multidex#keep). We are using the ProGuard format (multiDexKeepProguard property). You can also use the multiDexKeepFile property, but make sure to adapt the rule above to that format.
{% endhint %}

### Enable ReLinker debug log

To enable debug logs for ReLinker you can pass a custom `ReLinkerInstance` when building `BoxStore`:

```java
boxStore = MyObjectBox.builder()
    .androidContext(App.this)
    .androidReLinker(ReLinker.log(new ReLinker.Logger() {
        @Override
        public void log(String message) { Log.d(TAG, message); }
    }))
    .build();
```

