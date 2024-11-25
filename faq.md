---
description: Answers to questions specific to ObjectBox for Java and Dart
---

# FAQ

## **Does ObjectBox support Kotlin? RxJava?**

ObjectBox comes with full [Kotlin support](https://docs.objectbox.io/kotlin-support) including data classes. And yes, it supports [RxJava and reactive queries without RxJava](https://docs.objectbox.io/data-observers-and-rx).

## **Does ObjectBox support object relations?**

Yes. ObjectBox comes with strong relation support and offers features like “eager loading” for optimal performance.

## **Does ObjectBox support multi-module projects? Can entities be spread across modules?**

The ObjectBox Gradle plugin only looks for entities in the current module, it does not search library modules. However, you can have a separate database (`MyObjectBox` file) for each module. Just make sure to pass different database names when building your BoxStore.

## **Is ObjectBox a “zero copy” database? Are properties fetched lazily?**

It depends. Internally and in [the C API](https://github.com/objectbox/objectbox-c), ObjectBox does zero-copy reads. Java objects require a single copy only. However, copying data is only a minor factor in overall performance. In ObjectBox, objects are POJOs (plain objects), and all properties will be properly initialized. Thus, there is no run time penalty for accessing properties and values do not change in unexpected ways when the database updates.

## **Are there any threading constrictions?**

No. The objects you get from ObjectBox are POJOs (plain objects). You are safe to pass them around in threads.

## Should I use ObjectBox on the main thread (or UI thread)?

It depends. In most cases no IO operations (which is what ObjectBox does) should be run on the main thread. This avoids (even rare) hangs of your app.

However, in some cases it might be alright. While ObjectBox and the underlying OS and file system can give no hard guarantees, reading (e.g. Box.get(id)) small amounts of data is typically very fast and should have no notable impact on observed performance of your app. This is because in ObjectBox reads, unlike writes, are not blocked by other operations.

## **On which platforms does ObjectBox run?**

ObjectBox supports **Android 4.4 (API level 19)** or newer and works on most device architectures (armeabi-v7a, arm64-v8a, x86 and x86\_64; note that 64-bit is still only supported on Android 5 resp. API 21 or newer). Android is supported for Java/Kotlin or Dart/Flutter projects.

ObjectBox supports **iOS 12** or newer on **64-bit devices** only. An iOS library is available for [Flutter](https://pub.dev/packages/objectbox) or [Swift](https://objectbox.io/swift-database-for-ios/) projects.

ObjectBox also runs on Linux (x86\_64, arm64, armv7), Windows (x86\_64) and macOS 10.15 or newer (x86\_64, Apple M1) with support for [Kotlin, Java, Dart, Flutter, Go, C, Swift and Python](https://objectbox.io/offline-first-mobile-database/).

## **Can I use ObjectBox on the desktop/server?**

Yes, you can ObjectBox on the desktop/server side. Contact us for details if you are interested in running ObjectBox in client/server mode or containerized!

## **Can I use ObjectBox on smart IoT devices?**

Yes. You can run the ObjectBox database on any IoT device that runs Linux. We also offer Go and C APIs. Check our [cross-platform tutorial](https://objectbox.io/cross-platform-sync-example/) and see how easy it is to sync data across platforms in real time with ObjectBox.

## **How do I rename object properties or classes?**

If you only do a rename on the language level, ObjectBox will by default remove the old and add a new entity/property. [To do a rename, you must specify the UID](https://docs.objectbox.io/advanced/data-model-updates).

## **How much does ObjectBox add to my APK size?**

The Google Play **download size** increases by around 2.3 MB (checked for ObjectBox 3.0.0) as a native library for each [supported architecture](faq.md#on-which-platforms-does-objectbox-run) is packaged. If you [build multiple APKs](https://developer.android.com/studio/build/configure-apk-splits) split by ABI or use [Android App Bundle](https://developer.android.com/guide/app-bundle/) it only increases around 0.6 MB.

{% hint style="info" %}
Tip: Open your APK or AAB in Android Studio and have a look at the lib folder to see the raw file size and download size added.
{% endhint %}

When building with minimum API level 23 (Android 6.0), the **raw file (APK or AAB) size** increases more, by around 6.1 MB. This is because the Android Plugin adds `extractNativeLibs="false"` to your `AndroidManifest.xml` [as recommended by Google](https://developer.android.com/topic/performance/reduce-apk-size#extract-false). This turns off compression. However, this allows Google Play to optimally compress APKs before downloading them to each device (see download size above) and reduces the size of your app updates (on Android 6.0 or newer). [Read this Android developers post for details](https://medium.com/androiddevelopers/smallerapk-part-8-native-libraries-open-from-apk-fc22713861ff). It also avoids issues that might occur when extracting the libraries.

If you rather have a smaller APK/App Bundle instead of smaller app downloads and updates (e.g. when distributing in other stores) you can override the flag in your `AndroidManifest.xml`:

{% hint style="info" %}
This is also [currently recommended](https://docs.flutter.dev/deployment/android#building-the-app-for-release) in any case **when building a Flutter** app with minimum API level 23 (Android 6.0).
{% endhint %}

```
<application
    ...
    // not recommended for non-Flutter apps, increases app update size
    android:extractNativeLibs="true"
    tools:replace="android:extractNativeLibs"
    ...   
</applicaton>
```

More importantly, ObjectBox adds little to the APK method count since it’s mostly written in native code.

## **Can I ship my app with a pre-built database?**

Yes. ObjectBox stores all data in a single database file. Thus, you just need to prepare a database file and copy it to the correct location on the first start of your app (before you touch ObjectBox’s API).

{% hint style="info" %}
For Java, there is an **experimental** `initialDbFile()` method when building BoxStore. [Let us know](https://github.com/objectbox/objectbox-java/issues/310) if this is useful!
{% endhint %}

The database file is called `data.mdb` and is typically located in a subdirectory called `objectbox` (or any name you passed to BoxStoreBuilder). On Android, the DB file is located inside the app’s files directory inside `objectbox/objectbox/`. Or `objectbox/<yourname>` if you assigned the custom name `<yourname>` using BoxStoreBuilder.

## How does ObjectBox use disk space? And, can I reclaim disk space?

In most cases, ObjectBox uses disk space quite optimally. Only once you add more data, the database file grows as required. When you delete data, file areas are marked as unused internally and will be reused by ObjectBox. Note that re-using existing file areas is much more efficient than shrinking and growing the file. In practice, once used file storage will be used again in the future; especially considering that stored data has the tendency to get more over time.

ObjectBox relies on multi-version concurrency storage based on "copy on write". This allows e.g. to read the previous state while a write transaction is active. A counter-intuitive consequence is that deleting data can actually increase disk usage because the old data is still referenced. But of course, forthcoming transactions can reuse the internally reclaimed space.

{% hint style="info" %}
The storage layout on disk is optimized for performance. Database structures and concepts like B+ trees, multi-version concurrency and indexes use more space than storing data e.g. in a text file. Advantages like scalable data operations easily make up for it. Also keep in mind that in many cases data stored in a database is a small proportion compared to media files.
{% endhint %}

Non-standard use cases may require a temporary peak in data storage space that is followed by a permanent drop of storage space. To reclaim disk space for those cases, you need to delete the database files and restore them later; e.g. from the cloud or from a second store, which you set up to put the objects you want to keep.

{% hint style="warning" %}
Deleting the database files deletes the contained data permanently. If you want to restore old data, it's your responsibility to backup and restore.
{% endhint %}

While we don't recommend deleting the entire database, the API offers some methods to do so: first, `close()` the `BoxStore` and then delete the database files using `BoxStore.deleteAllFiles(objectBoxDirectory)`. To avoid having to close `BoxStore` delete files before building it, e.g. during app start-up.

```java
// If BoxStore is in use, close it first.
store.close();

BoxStore.deleteAllFiles(new File(BoxStoreBuilder.DEFAULT_NAME));

// TODO Build a new BoxStore instance.
```

{% hint style="info" %}
`BoxStore.removeAllObjects()` does not reclaim disk space. It keeps the allocated disk space so it returns fast and to avoid the performance hit of having to allocate the same disk space when data is put again.
{% endhint %}

## **Answers to other questions**

{% content-ref url="troubleshooting.md" %}
[troubleshooting.md](troubleshooting.md)
{% endcontent-ref %}

Questions that apply to all supported platforms and languages are answered in the [general ObjectBox FAQ](https://objectbox.io/faq/).

If you believe to have found a bug or missing feature, please create an issue.

For Java/Kotlin: [https://github.com/objectbox/objectbox-java/issues](https://github.com/objectbox/objectbox-java/issues)

For Flutter/Dart: [https://github.com/objectbox/objectbox-dart/issues](https://github.com/objectbox/objectbox-dart/issues)

If you have a usage question regarding ObjectBox, please post on Stack Overflow. [https://stackoverflow.com/questions/tagged/objectbox](https://stackoverflow.com/questions/tagged/objectbox)
