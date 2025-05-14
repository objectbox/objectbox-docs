---
description: Additional configuration options when creating an ObjectBox database.
---

# Advanced Setup

This page contains:

&#x20;[#objectbox-for-java-advanced-setup](advanced-setup.md#objectbox-for-java-advanced-setup "mention")&#x20;

&#x20;[#objectbox-for-flutter-dart-advanced-setup](advanced-setup.md#objectbox-for-flutter-dart-advanced-setup "mention")

## ObjectBox for Java - Advanced Setup

This page assumes you have [added ObjectBox ](../getting-started.md)to your project.

To then change the default behavior of the ObjectBox plugin and processor read on for advanced setup options.

### Manually Add Libraries

The ObjectBox Gradle plugin adds required libraries and the annotation processor to your projects dependencies automatically, but you can also add them manually.

Just make sure to apply the ObjectBox Gradle plugin after the dependencies block, so it does not replace manually added dependencies.

In your app's Gradle build script:

{% tabs %}
{% tab title="Android (Kotlin)" %}
```java
dependencies {
    // All below added automatically by the plugin:
    // Java library
    implementation("io.objectbox:objectbox-java:$objectboxVersion")
    // Kotlin extension functions
    implementation("io.objectbox:objectbox-kotlin:$objectboxVersion")
    // Annotation processor
    kapt("io.objectbox:objectbox-processor:$objectboxVersion")
    // Native library for Android
    implementation("io.objectbox:objectbox-android:$objectboxVersion")
}

// Apply plugin after dependencies block so they are not overwritten.
apply plugin: 'io.objectbox'
// Or using Kotlin DSL:
apply(plugin = "io.objectbox")
```


{% endtab %}

{% tab title="Android (Java)" %}
```java
dependencies {
    // All below added automatically by the plugin:
    // Java library
    implementation("io.objectbox:objectbox-java:$objectboxVersion")
    // Annotation processor
    annotationProcessor("io.objectbox:objectbox-processor:$objectboxVersion")
    // Native library for Android
    implementation("io.objectbox:objectbox-android:$objectboxVersion")
}

// Apply plugin after dependencies block so they are not overwritten.
apply plugin: 'io.objectbox'
// Or using Kotlin DSL:
apply(plugin = "io.objectbox")
```


{% endtab %}

{% tab title="JVM (Java)" %}
<pre class="language-groovy"><code class="lang-groovy">dependencies {
    // All below added automatically by the plugin:
<strong>    // Java library
</strong>    implementation("io.objectbox:objectbox-java:$objectboxVersion")
    // Annotation processor
    annotationProcessor("io.objectbox:objectbox-processor:$objectboxVersion")
    // One of the native libraries required for your system
    implementation("io.objectbox:objectbox-linux:$objectboxVersion")
    implementation("io.objectbox:objectbox-macos:$objectboxVersion")
    implementation("io.objectbox:objectbox-windows:$objectboxVersion")
    // Not added automatically:
    // Since 2.9.0 we also provide ARM support for the Linux library
    implementation("io.objectbox:objectbox-linux-arm64:$objectboxVersion")       
    implementation("io.objectbox:objectbox-linux-armv7:$objectboxVersion")
}

// Apply plugin after dependencies block so they are not overwritten.
apply plugin: "io.objectbox"
// Or using Kotlin DSL:
apply(plugin = "io.objectbox")
</code></pre>
{% endtab %}

{% tab title="JVM (Kotlin)" %}
```groovy
dependencies {
    // All below added automatically by the plugin:
    // Java library
    implementation("io.objectbox:objectbox-java:$objectboxVersion")
    // Kotlin extension functions
    implementation("io.objectbox:objectbox-kotlin:$objectboxVersion")
    // Annotation processor
    kapt("io.objectbox:objectbox-processor:$objectboxVersion")
    // One of the native libraries required for your system
    implementation("io.objectbox:objectbox-linux:$objectboxVersion")
    implementation("io.objectbox:objectbox-macos:$objectboxVersion")
    implementation("io.objectbox:objectbox-windows:$objectboxVersion")
    // Not added automatically:
    // Since 2.9.0 we also provide ARM support for the Linux library
    implementation("io.objectbox:objectbox-linux-arm64:$objectboxVersion")       
    implementation("io.objectbox:objectbox-linux-armv7:$objectboxVersion")
}

// Apply plugin after dependencies block so they are not overwritten.
apply plugin: "io.objectbox"
// Or using Kotlin DSL:
apply(plugin = "io.objectbox")
```
{% endtab %}
{% endtabs %}

### Add libraries for distribution

For JVM apps, by default, the ObjectBox Gradle plugin only adds the native (Linux, macOS or Windows) library **required to run on your current system**. If your app wants to support multiple platforms, **manually add all of the required native libraries** listed above when you **distribute** your app.

### **Processor Options**

In your app’s Gradle build script, the following processor options, explained below, are available:

{% tabs %}
{% tab title="Android (Kotlin)" %}
```java
kapt {
    arguments {
        arg("objectbox.modelPath", "$projectDir/schemas/objectbox.json")
        arg("objectbox.myObjectBoxPackage", "com.example.custom")
        arg("objectbox.debug", true)
    }
}
```
{% endtab %}

{% tab title="Android (Java)" %}
```java
// Groovy DSL (build.gradle)
android {
    defaultConfig {
        javaCompileOptions {
            annotationProcessorOptions {
                arguments = [ 
                        "objectbox.modelPath" : "$projectDir/schemas/objectbox.json".toString(),
                        "objectbox.myObjectBoxPackage" : "com.example.custom",
                        "objectbox.debug" : "true"
                ]
            }
        }
    }
}

// Kotlin DSL (build.gradle.kts)
android {
    defaultConfig {
        javaCompileOptions {
            annotationProcessorOptions {
                arguments.put("objectbox.modelPath", "$projectDir/schemas/objectbox.json")
                arguments.put("objectbox.myObjectBoxPackage", "com.example.custom")
                arguments.put("objectbox.debug", "true")
            }
        }
    }
}
```


{% endtab %}

{% tab title="JVM (Java)" %}
```groovy
// Groovy DSL
tasks.withType(JavaCompile) {
    options.compilerArgs += [ "-Aobjectbox.modelPath=$projectDir/schemas/objectbox.json" ]
    options.compilerArgs += [ "-Aobjectbox.myObjectBoxPackage=com.example.custom" ]
    options.compilerArgs += [ "-Aobjectbox.debug=true" ]
}

// Kotlin DSL
tasks.withType<JavaCompile>() {
    options.compilerArgs.add("-Aobjectbox.modelPath=$projectDir/schemas/objectbox.json")
    options.compilerArgs.add("-Aobjectbox.myObjectBoxPackage=com.example.custom")
    options.compilerArgs.add("-Aobjectbox.debug=true")
}
```
{% endtab %}

{% tab title="JVM (Kotlin)" %}
```groovy
kapt {
    arguments {
        arg("objectbox.modelPath", "$projectDir/schemas/objectbox.json")
        arg("objectbox.myObjectBoxPackage", "com.example.custom")
        arg("objectbox.debug", true)
    }
}
```
{% endtab %}
{% endtabs %}

#### Change the Model File Path

By default, the ObjectBox model file is stored in `module-name/objectbox-models/default.json`. You can change the file path and name by passing the `objectbox.modelPath` argument to the ObjectBox annotation processor.

#### Change the MyObjectBox package

{% hint style="info" %}
Since 1.5.0
{% endhint %}

By default, the MyObjectBox class is generated in the same or a parent package of your entity classes. You can define a specific package by passing the `objectbox.myObjectBoxPackage` argument to the ObjectBox annotation processor.

#### Enable Debug Mode

You can enable debug output for the annotation processor if you encounter issues while setting up your project and entity classes.

In your app’s `build.gradle` file, enable the `objectbox.debug` option and then run Gradle with the `--info` option to see the debug output.

To enable debug mode for the ObjectBox Gradle plugin:

```groovy
// Enable debug output for the plugin
// Groovy DSL
objectbox {
    debug = true
}

// Kotlin DSL
configure<io.objectbox.gradle.ObjectBoxPluginExtension> {
    debug.set(true)
}
```

### Enable DaoCompat mode

ObjectBox can help you migrate from greenDAO by generating classes with a greenDAO-like API.

See the [DaoCompat documentation](http://greenrobot.org/greendao/documentation/objectbox-compat/) on how to enable and use this feature.

## ObjectBox for Flutter/Dart - Advanced Setup

### Change the generated files directory

To customize the directory (relative to the package root) where the files generated by ObjectBox are written, add the following to your `pubspec.yaml`:

```
objectbox:
  # Writes objectbox-model.json and objectbox.g.dart to lib/custom (and test/custom).
  output_dir: custom
  # Or optionally specify the lib and test output folder separately.
  # output_dir:
  #   lib: custom
  #   test: other
```

