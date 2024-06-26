---
description: Solutions for common issues with ObjectBox for Java and Dart
---

# Troubleshooting

## **Unresolved reference: MyObjectBox (class not found, etc.)**

MyObjectBox is a generated class, so make sure the project builds successfully. Resolve any other build errors.

Check that the [project is configured correctly](getting-started.md#adding-objectbox-to-your-android-project). E.g. for Kotlin, check that the kapt plugin is applied (`apply plugin: 'kotlin-kapt'`) before the ObjectBox plugin.

`android-apt` is known to cause problems, try to remove it.

## **Merge conflict or** DbSchemaException **after concurrent data model modifications**

If your team makes concurrent modifications to the data model (e.g. adding/removing entities or properties) it may clash with your changes. Read the [meta model docs](advanced/meta-model-ids-and-uids.md#resolving-meta-model-conflicts) on how to resolve the conflicts.

## DbSchemaException: incoming ID does not match existing UID

Creating a Store throws a `DbSchemaException` and a message like

* Incoming _entity_ ID does not match existing UID
* Incoming _property_ ID does not match existing UID
* Incoming _index_ ID does not match existing UID

This means there is a conflict between the data model defined in your code (using `@Entity` classes) and the data model of the existing database file.

For example for an entity, this message indicates the unique identifier (UID) of an entity is not the same as before. Entity UIDs are auto-assigned by ObjectBox and stored in `objectbox-models/default.json` for Java or `lib/objectbox-model.json` for Dart. Look for the `id` property which contains the UID in the second part, the first part is the ID (the format is `ID:UID`).

Read the [meta model docs](advanced/meta-model-ids-and-uids.md#resolving-meta-model-conflicts) on why this can happen and how to resolve such conflicts.

## DbSchemaException **after switching git branch (no concurrent data model modifications)**

See below.

## DbSchemaException: DB's last ID is higher

Creating a Store throws a `DbSchemaException` and a message like

* DB's last _entity_ ID is higher than from model
* DB's last _property_ ID is higher than the incoming one
* DB's last _index_ ID is higher than from model
* DB's last _relation_ ID is higher than from model

This means, there is a conflict between the data model defined in your code (using `@Entity` classes) and the data model of the existing database file.

For example for an entity, this message indicates that the database already contains one or more entities with IDs higher than the lowest one of the model in your code. Entity IDs are auto-assigned by ObjectBox and stored in `objectbox-models/default.json` for Java or `lib/objectbox-model.json` for Dart. Look for the `lastEntityId` value, the highest used entity ID is contained in the first part, the second part is the UID (the format is `ID:UID`).

Read the [meta model docs](advanced/meta-model-ids-and-uids.md#resolving-meta-model-conflicts) on why this can happen and how to resolve such conflicts.

## DbFullException: Could not put

This is thrown when applying a transaction (e.g. putting an object) would exceed the [maxSizeInKByte](https://objectbox.io/docfiles/java/current/io/objectbox/BoxStoreBuilder.html#maxSizeInKByte\(long\)) (Java)/[maxDBSizeInKB](https://pub.dev/documentation/objectbox/latest/objectbox/Store/Store.html) (Dart) configured for the store.

By default, this is 1 GB, which should be sufficient for most applications. In general, a maximum size prevents the database from growing indefinitely when something goes wrong (for example data is put in an infinite loop).

This value can be changed, so increased or also decreased, each time when opening a store:

{% tabs %}
{% tab title="Java" %}
```kotlin
MyObjectBox.builder()
    .androidContext(context)
    .maxSizeInKByte(1024 * 1024 /* 1 GB */)
    .build()
```
{% endtab %}

{% tab title="Dart" %}
```dart
Store(getObjectBoxModel(), maxDBSizeInKB: 1024 * 1024 /* 1 GB */);
```
{% endtab %}
{% endtabs %}

## **Couldn’t find “libobjectbox.so”**

This can have various reasons. In general **check your ABI filter setup** [or add one](https://google.github.io/android-gradle-dsl/current/com.android.build.gradle.internal.dsl.NdkOptions.html#com.android.build.gradle.internal.dsl.NdkOptions:abiFilters) in your Gradle build file.

If your app explicitly **ships code for "armeabi"**: For Android, ObjectBox comes with binaries for “armeabi-v7a” and “arm64-v8a” ABIs. We consider “armeabi” to be outdated and thus do not support it. Check if you have a Gradle config like abiFilters "armeabi", which is causing the problem (e.g. remove it or change it to “armeabi-v7a”).

If your app uses **split APKs or App Bundle**: some users might have sideloaded your APK that includes the library for a platform that is incompatible with the one of their device. See [App Bundle, split APKs and Multidex](android/app-bundle-and-split-apk.md) for workarounds.

## **Version conflict with ‘com.google.code.findbugs:jsr305’**

If you are doing Android instrumentation (especially with Espresso), you may get a warning like this:\
`Error:Conflict with dependency ‘com.google.code.findbugs:jsr305’ in project ‘:app’. Resolved versions for app (3.0.2) and test app (2.0.1) differ. See` [`http://g.co/androidstudio/app-test-app-conflict`](http://g.co/androidstudio/app-test-app-conflict) `for details.`

You can easily resolve the version conflict by adding this Gradle dependency: `androidTestCompile 'com.google.code.findbugs:jsr305:3.0.2'`&#x20;

[Background info](https://github.com/objectbox/objectbox-java/issues/73).

## **Incompatible property type**

Check the[ data model migration guide](https://docs.objectbox.io/advanced/data-model-updates) if you get an exception like:\
`io.objectbox.exception.DbException: Property […] is not compatible to its previous definition. Check its type.`

or

&#x20;`Cannot change the following flags for Property`

## Flutter iOS builds for armv7 fail with "ObjectBox does not contain that architecture"

[Only 64-bit iOS devices are supported.](faq.md#on-which-platforms-does-objectbox-run) To resolve the build error, configure Architectures in your Xcode project like described in [Getting Started](getting-started.md) for Flutter.

## **Error Codes**

Sometimes you might get an error code along with a error message. Typically, you will find error codes in parenthesis. Example:

`Could not prepare directory: objectbox (30)`

This error code comes from the OS, and gives you additional information; e.g. 30 tells that you tried to init a database in a read-only location of the file system, which cannot work.

Here's the list of typical OS errors:

| Error code | Errno   | Description                         |
| :--------: | ------- | ----------------------------------- |
|      1     | EPERM   | Operation not permitted             |
|      2     | ENOENT  | No such file or directory           |
|      3     | ESRCH   | No such process                     |
|      4     | EINTR   | Interrupted system call             |
|      5     | EIO     | I/O error                           |
|      6     | ENXIO   | No such device or address           |
|      7     | E2BIG   | Argument list too long              |
|      8     | ENOEXEC | Exec format error                   |
|      9     | EBADF   | Bad file number                     |
|     10     | ECHILD  | No child processes                  |
|     11     | EAGAIN  | Try again                           |
|     12     | ENOMEM  | Out of memory                       |
|     13     | EACCES  | Permission denied                   |
|     14     | EFAULT  | Bad address                         |
|     15     | ENOTBLK | Block device required               |
|     16     | EBUSY   | Device or resource busy             |
|     17     | EEXIST  | File exists                         |
|     18     | EXDEV   | Cross-device link                   |
|     19     | ENODEV  | No such device                      |
|     20     | ENOTDIR | Not a directory                     |
|     21     | EISDIR  | Is a directory                      |
|     22     | EINVAL  | Invalid argument                    |
|     23     | ENFILE  | File table overflow                 |
|     24     | EMFILE  | Too many open files                 |
|     25     | ENOTTY  | Not a typewriter                    |
|     26     | ETXTBSY | Text file busy                      |
|     27     | EFBIG   | File too large                      |
|     28     | ENOSPC  | No space left on device             |
|     29     | ESPIPE  | Illegal seek                        |
|     30     | EROFS   | Read-only file system               |
|     31     | EMLINK  | Too many links                      |
|     32     | EPIPE   | Broken pipe                         |
|     33     | EDOM    | Math argument out of domain of func |
|     34     | ERANGE  | Math result not representable       |

## **Help with other issues**

{% content-ref url="faq.md" %}
[faq.md](faq.md)
{% endcontent-ref %}

If you believe to have found a bug or missing feature, please create an issue.

For Java/Kotlin: [https://github.com/objectbox/objectbox-java/issues](https://github.com/objectbox/objectbox-java/issues)

For Flutter/Dart: [https://github.com/objectbox/objectbox-dart/issues](https://github.com/objectbox/objectbox-dart/issues)

If you have a usage question regarding ObjectBox, please post on Stack Overflow. [https://stackoverflow.com/questions/tagged/objectbox](https://stackoverflow.com/questions/tagged/objectbox)

