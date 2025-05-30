---
description: >-
  Discover ObjectBox: The Lightning-Fast Mobile Database for Persistent Object
  Storage. Streamline Your Workflow, Eliminate Repetitive Tasks, and Enjoy a
  User-Friendly Data Interface.
---

# Getting started

## Add ObjectBox to your project

{% tabs %}
{% tab title="Java/Kotlin (Android)" %}
{% embed url="https://www.youtube.com/watch?v=flmAeYY-u9I" %}
Video Tutorial on Getting Started with ObjectBox for Android and Java
{% endembed %}

{% hint style="info" %}
Prefer to look at example code? Check out [our examples repository](https://github.com/objectbox/objectbox-examples).
{% endhint %}

ObjectBox tools and dependencies are available on [the Maven Central repository](https://central.sonatype.com/namespace/io.objectbox).

To add ObjectBox to your Android project, follow these steps:

1. Open the Gradle build file of your root project (not the ones for your app or module subprojects) and add a global variable for the version and the ObjectBox Gradle plugin:

{% code title="/build.gradle(.kts)" %}
```java
buildscript {
    ext.objectboxVersion = "4.3.0" // For Groovy build scripts
    // val objectboxVersion by extra("4.3.0") // For KTS build scripts
    
    repositories {
        mavenCentral()
    }
    
    dependencies {
        // Android Gradle Plugin 8.0 or later supported
        classpath("com.android.tools.build:gradle:8.0.2")
        classpath("io.objectbox:objectbox-gradle-plugin:$objectboxVersion")
    }
}
```
{% endcode %}

2. Open the Gradle build file for your app or module subproject and, after the `com.android.application` plugin, apply the `io.objectbox` plugin:

{% code title="/app/build.gradle(.kts)" %}
```java
// Using plugins syntax:
plugins {
    id("com.android.application")
    id("kotlin-android") // Only for Kotlin projects
    id("kotlin-kapt") // Only for Kotlin projects
    id("io.objectbox") // Apply last
}

// Or using the old apply syntax:
apply plugin: "com.android.application"
apply plugin: "kotlin-android" // Only for Kotlin projects
apply plugin: "kotlin-kapt" // Only for Kotlin projects
apply plugin: "io.objectbox" // Apply last
```
{% endcode %}

{% hint style="info" %}
If you encounter any problems in this or later steps, check out the [FAQ](faq.md) and [Troubleshooting](troubleshooting.md) pages.
{% endhint %}

3. Then do "Sync Project with Gradle Files" in Android Studio so the Gradle plugin automatically adds the required ObjectBox libraries and code generation tasks.
4. Your project can now use ObjectBox, continue by defining entity classes.
{% endtab %}

{% tab title="Java/Kotlin (JVM)" %}
{% hint style="info" %}
Prefer to look at example code? Check out [our examples repository](https://github.com/objectbox/objectbox-examples).
{% endhint %}

The ObjectBox Java SDK and runtime libraries support applications:

* running on the JVM on Linux (x86\_64, arm64, armv7), Windows (x86\_64) and macOS 10.15 or newer (x86\_64, Apple M1)
* written in Java or Kotlin
* targeting at least Java 8
* built with Gradle or Maven

ObjectBox tools and dependencies are available on [the Maven Central repository](https://central.sonatype.com/namespace/io.objectbox).

#### Maven projects

To set up a Maven project, see the [README of the Java Maven example project](https://github.com/objectbox/objectbox-examples/blob/main/java-main-maven/README.md).

#### Gradle projects

{% hint style="info" %}
The instructions assume a [multi-project build](https://docs.gradle.org/current/userguide/multi_project_builds.html) is used.
{% endhint %}

1. Open the Gradle build script of your root project and
   1. add a global variable to store the common version of ObjectBox dependencies and
   2. add the [ObjectBox Gradle plugin](https://github.com/objectbox/objectbox-java-generator):

{% code title="/build.gradle(.kts)" %}
```groovy
buildscript {
    ext.objectboxVersion = "4.3.0" // For Groovy build scripts
    // val objectboxVersion by extra("4.3.0") // For KTS build scripts
    
    repositories {
        mavenCentral()
    }
    
    dependencies {
        classpath("io.objectbox:objectbox-gradle-plugin:$objectboxVersion")
    }
}
```
{% endcode %}

2. Open the Gradle build file for your application subproject and, after other plugins, apply the `io.objectbox` plugin:

{% code title="/app/build.gradle(.kts)" %}
```groovy
// Using plugins syntax:
plugins {
    id("java-library") // or org.jetbrains.kotlin.jvm for Kotlin projects.
    id("io.objectbox") // Apply last.
}

// Or using the old apply syntax:
apply plugin: "java-library" // or org.jetbrains.kotlin.jvm for Kotlin projects.
apply plugin: "io.objectbox" // Apply last.
```
{% endcode %}

{% hint style="info" %}
Using your IDE of choice with a Gradle project might require additional configuration. E.g.

* For IntelliJ IDEA see the [help page for Gradle](https://www.jetbrains.com/help/idea/gradle.html).
* For Eclipse see the [Buildship ](https://projects.eclipse.org/projects/tools.buildship)project and [Getting Started](https://www.vogella.com/tutorials/EclipseGradle/article.html) article.
{% endhint %}

3. **Optionally**, add a runtime library for each platform that your application should run on and instead apply the Gradle plugin after the dependencies block:

```groovy
dependencies {
    // ObjectBox platform-specific runtime libraries
    // Add or remove them as needed to match what your application supports
    // Linux (x64)
    implementation("io.objectbox:objectbox-linux:$objectboxVersion")
    // macOS (Intel and Apple Silicon)
    implementation("io.objectbox:objectbox-macos:$objectboxVersion")
    // Windows (x64)
    implementation("io.objectbox:objectbox-windows:$objectboxVersion")

    // Additional ObjectBox runtime libraries
    // Linux (32-bit ARM)
    implementation("io.objectbox:objectbox-linux-arm64:$objectboxVersion")       
    // Linux (64-bit ARM)
    implementation("io.objectbox:objectbox-linux-armv7:$objectboxVersion")
}

// When manually adding ObjectBox dependencies, the plugin must be
// applied after the dependencies block so it can detect them.
// Using Groovy build scripts
apply plugin: "io.objectbox"
// Using KTS build scripts
apply(plugin = "io.objectbox")
```

{% hint style="info" %}
The ObjectBox database runs mostly in native code written in C/C++ for optimal performance. Thus, ObjectBox will load a runtime library: a “.dll” on Windows, a “.so” on Linux, and a “.dylib” on macOS.\


By default, the Gradle plugin adds a runtime library (only) for your current operating system. It also adds the Java SDK (objectbox-java) and if needed the ObjectBox Kotlin extension functions (objectbox-kotlin).
{% endhint %}

{% hint style="info" %}
ObjectBox only supports 64-bit systems for best performance going forward. Talk to us if you require 32-bit support.
{% endhint %}

3. Your project can now use ObjectBox, continue by defining entity classes.
{% endtab %}

{% tab title="Flutter" %}
{% embed url="https://www.youtube.com/watch?v=AxYbdriXKI8" %}
Video Tutorial on Getting Started with ObjectBox for Flutter
{% endembed %}

{% hint style="info" %}
You can watch these video tutorials as well 😀:

* [Event Management app](https://youtu.be/6YPSQPS_bhU)
* [Restaurant: chef and order apps](https://youtu.be/r9Lc2r22KBk)
* [Task-list app (in Spanish)](https://youtu.be/osUq6B92-BY)
{% endhint %}

{% hint style="info" %}
Prefer to look at example code? Check out our [examples directory](https://github.com/objectbox/objectbox-dart/tree/main/objectbox/example).
{% endhint %}

To add ObjectBox to your Flutter project:

1. Run these commands:

```
flutter pub add objectbox objectbox_flutter_libs:any
flutter pub add --dev build_runner objectbox_generator:any
```

Or to use [ObjectBox Sync](https://objectbox.io/sync/) (requires access to the Sync feature) instead run:

```
flutter pub add objectbox objectbox_sync_flutter_libs:any
flutter pub add --dev build_runner objectbox_generator:any
```

{% hint style="info" %}
**To run unit tests on your machine**, download the latest native ObjectBox library for your machine by running this script in a bash shell (e.g. Git Bash on Windows):

`bash <(curl -s https://raw.githubusercontent.com/objectbox/objectbox-dart/main/install.sh)`

To get a variant of the library that supports **ObjectBox Sync**, append the `--sync` argument to above command.
{% endhint %}

2. This should add lines like this to your `pubspec.yaml`:

```yaml
dependencies:
  objectbox: ^4.3.0
  objectbox_flutter_libs: any
  # If you run the command for ObjectBox Sync it should add instead:
  # objectbox_sync_flutter_libs: any

dev_dependencies:
  build_runner: ^2.4.11
  objectbox_generator: any
```

3. If you added the above lines manually, then install the packages with `flutter pub get`.

{% hint style="info" %}
**For Android** increase the NDK version:

{% code title="/android/app/build.gradle" %}
```groovy
android {
    // ObjectBox: Flutter defaults to NDK 23.1.7779620, but
    // - objectbox_flutter_libs requires Android NDK 25.1.8937393
    // - path_provider_android requires Android NDK 25.1.8937393
    // Until Flutter uses a newer version (https://github.com/flutter/flutter/commit/919bed6e0a18bd5b76fb581ede10121f8c14a6f7)
    // manually set the required one:
    // ndkVersion flutter.ndkVersion
    ndkVersion = "25.1.8937393"
}   
```
{% endcode %}
{% endhint %}

{% hint style="info" %}
**For all macOS apps** need to target macOS 10.15: in `Podfile` change the platform and in the `Runner.xcodeproj/poject.pbxproj` file update `MACOSX_DEPLOYMENT_TARGET`.
{% endhint %}

{% hint style="info" %}
**For Linux Desktop apps:** the **Flutter snap** ships with an outdated version of CMake. [**Install Flutter manually**](https://docs.flutter.dev/get-started/install/linux#install-flutter-manually) **instead** to use the version of CMake installed on your system.
{% endhint %}
{% endtab %}

{% tab title="Dart Native" %}
{% hint style="info" %}
Prefer to look at example code? Check out our [examples directory](https://github.com/objectbox/objectbox-dart/tree/main/objectbox/example).
{% endhint %}

1. Run these commands:

```
dart pub add objectbox
dart pub add --dev build_runner objectbox_generator:any
```

2. This should add lines like this to your `pubspec.yaml`:

```yaml
dependencies:
  objectbox: ^4.3.0

dev_dependencies:
  build_runner: ^2.4.11
  objectbox_generator: any
```

3. If you added the above lines manually, then install the packages with `dart pub get`
4. Install the [ObjectBox C library](https://github.com/objectbox/objectbox-c) for your system (on Windows you can use "Git Bash"):

```
bash <(curl -s https://raw.githubusercontent.com/objectbox/objectbox-dart/main/install.sh)
```

Or to use [ObjectBox Sync](https://objectbox.io/sync/) (requires access to the Sync feature) instead run:

```
bash <(curl -s https://raw.githubusercontent.com/objectbox/objectbox-dart/main/install.sh) --sync
```

{% hint style="info" %}
By default the library is downloaded into the `lib` subdirectory of the working directory. It's not necessary to install the library system-wide. This also allows to use different versions for different projects. For details see below.
{% endhint %}

**Deploying Dart Native projects**

Natively compiled Dart applications that use ObjectBox Dart require a reference to the [objectbox-c](https://github.com/objectbox/objectbox-c) library. Hence, the shared library file downloaded with `install.sh` needs to be shipped with the executable.

The `install.sh` script downloads the library by default to the `lib` subdirectory of the working directory. An executable using ObjectBox Dart looks for the library in this `lib` directory.

If it is not found there, it falls back to using system directories (using Dart's `DynamicLibrary.open`):

* Windows: working directory and `%WINDIR%\system32`.
* macOS: `/usr/local/lib` (and maybe others).
* Linux: `/lib` and `/usr/lib` (again, possibly others).


{% endtab %}

{% tab title="Python" %}
{% hint style="info" %}
Prefer to look at example code? Check out our [examples directory](https://github.com/objectbox/objectbox-python/tree/main/example).
{% endhint %}

ObjectBox for Python is available via PyPI:\
\
Stable Version (4.0.0):

```sh
pip install --upgrade objectbox
```
{% endtab %}
{% endtabs %}

## Define Entity Classes

Define your data model by creating **a class with at least an ID property**, a so called entity.

A simple entity representing a user with an ID and a name property could look like this:

{% tabs %}
{% tab title="Java" %}
{% code title="User.java" %}
```java
@Entity
public class User {
    @Id 
    public long id;
    public String name;
}
```
{% endcode %}
{% endtab %}

{% tab title="Kotlin" %}
{% code title="models.kt" %}
```kotlin
@Entity
data class User(
        @Id 
        var id: Long = 0,
        var name: String? = null
)
```
{% endcode %}

{% hint style="warning" %}
When using a data class, **add default values for all parameters**. This will ensure your data class will have a constructor that can be called by ObjectBox. (Technically this is only required if adding properties to the class body, like custom or transient properties or relations, but it's a good idea to do it always.)
{% endhint %}

{% hint style="warning" %}
**Avoid naming properties like reserved Java keywords, like `private` and `default`.** ObjectBox tooling works with the Java representation of your Kotlin code to be compatible with both Java and Kotlin. It will ignore such properties.
{% endhint %}
{% endtab %}

{% tab title="Dart" %}
{% code title="models.dart" %}
```dart
@Entity()
class User {
  @Id()
  int id = 0;
  
  String? name;
}
```
{% endcode %}

You can have multiple entities in the same file (here `models.dart`), or you can have them spread across multiple files in your package's `lib` directory.
{% endtab %}

{% tab title="Python" %}
{% code title="model.py" %}
```python
from objectbox import Entity, Id, String

@Entity()
class User:
  id = Id
  name = String
  
```
{% endcode %}
{% endtab %}
{% endtabs %}

**Important:**

* **Entities must have exactly one 64-bit integer ID property** (a Java `long`, Kotlin `Long`, Dart `int`). If you need another type for the ID, like a string, [see the @Id annotation docs](entity-annotations.md#object-ids-id) for some tips. Also, the ID property must have **non-private visibility** (or non-private getter and setter methods).
* **Entities must also have a no-argument constructor**, or for better performance, a constructor with all properties as arguments. In the above examples, a default, no-argument constructor is generated by the compiler.

[Support for many property types](advanced/custom-types.md) is already built-in, but almost any type can be stored [with a converter](advanced/custom-types.md#convert-annotation-and-property-converter).

For more details about entities, like how to create an index or a relation, check the [entity-annotations.md](entity-annotations.md "mention") page.

You can also [learn more about the ObjectBox model](advanced/meta-model-ids-and-uids.md).

{% hint style="info" %}
ObjectBox also supports changing your model at a later point. You can **add and remove properties in entities** and the database model is updated **automatically** (after re-generating some code, see section below). There is no need to write migration code.

**To rename entities or properties, change the type of a property** and more details in general see [data-model-updates.md](advanced/data-model-updates.md "mention").
{% endhint %}

## Generate ObjectBox code

Next, we generate some binding code based on the model defined in the previous step.

{% tabs %}
{% tab title="Java/Kotlin" %}
**Build your project** to generate the `MyObjectBox` class and other classes required to use ObjectBox, for example using **Build > Make Project** in Android Studio.

{% hint style="info" %}
Note: If you make significant changes to your entities, e.g. by moving them or modifying annotations, make sure to **rebuild** the project so generated ObjectBox code is updated.
{% endhint %}

To change the package of the `MyObjectBox` class, see the annotation processor options on the [advanced-setup.md](advanced/advanced-setup.md "mention") page.
{% endtab %}

{% tab title="Flutter/Dart Native" %}
To generate the binding code required to use ObjectBox run

`dart run build_runner build`

ObjectBox generator will look for all `@Entity` annotations in your `lib` folder and create

* a single database definition `lib/objectbox-model.json` and
* supporting code in `lib/objectbox.g.dart`.

To customize the directory where generated files are written see [advanced-setup.md](advanced/advanced-setup.md "mention").

{% hint style="info" %}
If you **make changes to your entities**, e.g. by adding a property or modifying annotations, or after the **ObjectBox library has updated** make sure to **re-run the generator** so generated ObjectBox code is updated.
{% endhint %}

{% hint style="success" %}
You typically commit the generated code file `objectbox.g.dart` to your version control system (e.g. git) to avoid having to re-run the generator unless there are changes.
{% endhint %}

{% hint style="info" %}
Actually we lied above. The generator will process `lib` and `test` folders separately and generate files for each one (if `@Entity` classes exist there). This allows to create a separate test database that does not share any of the entity classes with the main database.
{% endhint %}
{% endtab %}

{% tab title="Python" %}
{% hint style="info" %}
Python bindings offer a convenient default Model to which Entity definitions are automatically associated if not specified otherwise.\
Similar to the other bindings, a JSON model file is also used for management of Schema history (i.e. to handle add/remove/rename of Entity and Property).
{% endhint %}
{% endtab %}
{% endtabs %}

Among other files ObjectBox generates a JSON **model file**, by default to

* `app/objectbox-models/default.json` for Android projects,
* `lib/objectbox-model.json` for Dart/Flutter projects, or
* `<user-module-dir>/objectbox-model.json` for Python projects

To change the model file path, see [advanced-setup.md](advanced/advanced-setup.md "mention").

{% hint style="info" %}
In Android Studio you might have to switch the _Project view_ from _Android_ to _Project_ to see the `default.json` model file.\
\
Python checks for the call-stack to determine the user-module directory in which the JSON file is stored.
{% endhint %}

This JSON file changes when you change your entity classes (or sometimes with a new version of ObjectBox).

**Keep this JSON file**, commit the changes to version control!

This file keeps track of unique IDs assigned to your entities and properties. This ensures that an older version of **your database can be smoothly upgraded if your entities or properties change**.

{% hint style="success" %}
The model file also enables you to keep data [when renaming entities or properties](advanced/data-model-updates.md) or to [resolve conflicts](https://docs.objectbox.io/advanced/meta-model-ids-and-uids) when two of your developers make changes at the same time.
{% endhint %}

## Create a Store

[**BoxStore**](https://objectbox.io/files/objectbox-java/current/io/objectbox/BoxStore.html) (Java) or [**Store**](https://pub.dev/documentation/objectbox/latest/objectbox/Store-class.html) (Dart) is the entry point for using ObjectBox. It is the direct interface to the database and manages Boxes. Typically, you want to only have a single Store (single database) and keep it open while your app is running, not closing it explicitly.

{% tabs %}
{% tab title="Java (Android)" %}
Create it using the builder returned by the generated `MyObjectBox` class, for example in a small helper class like this:

```java
public class ObjectBox {
    private static BoxStore store;

    public static void init(Context context) {
        store = MyObjectBox.builder()
                .androidContext(context)
                .build();
    }

    public static BoxStore get() { return store; }
}
```

{% hint style="warning" %}
If you encounter `UnsatisfiedLinkError` or `LinkageError` on the build call, see [App Bundle, split APKs and Multidex](android/app-bundle-and-split-apk.md) for solutions.
{% endhint %}

The best time to initialize ObjectBox is when your app starts. We suggest to do it in the `onCreate` method of your [Application class](https://developer.android.com/reference/android/app/Application):

```java
public class ExampleApp extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        ObjectBox.init(this);
    }
}
```
{% endtab %}

{% tab title="Kotlin (Android)" %}
Create it using the builder returned by the generated MyObjectBox class, for example in a small helper class like this:

```kotlin
object ObjectBox {
    lateinit var store: BoxStore
        private set

    fun init(context: Context) {
        store = MyObjectBox.builder()
                .androidContext(context)
                .build()
    }
}
```

{% hint style="warning" %}
If you encounter `UnsatisfiedLinkError` or `LinkageError` on the build call, see [App Bundle, split APKs and Multidex](android/app-bundle-and-split-apk.md) for solutions.
{% endhint %}

The best time to initialize ObjectBox is when your app starts. We suggest to do it in the `onCreate` method of your [Application class](https://developer.android.com/reference/android/app/Application):

```kotlin
class ExampleApp : Application() {
    override fun onCreate() {
        super.onCreate()
        ObjectBox.init(this)
    }
}
```
{% endtab %}

{% tab title="JVM" %}
```java
public class ObjectBox {
    private static BoxStore store;

    public static void init(Context context) {
        store = MyObjectBox.builder()
                .name("objectbox-notes-db")
                .build();
    }

    public static BoxStore get() { return store; }
}
```

The best time to initialize ObjectBox is when your app starts. For a command line app this is typically inside the main method.
{% endtab %}

{% tab title="Flutter" %}
**Create it** using the generated `openStore()` method, for example in a small helper class like this:

```dart
import 'package:path/path.dart' as p;
import 'package:path_provider/path_provider.dart';
import 'objectbox.g.dart'; // created by `flutter pub run build_runner build`

class ObjectBox {
  /// The Store of this app.
  late final Store store;
  
  ObjectBox._create(this.store) {
    // Add any additional setup code, e.g. build queries.
  }

  /// Create an instance of ObjectBox to use throughout the app.
  static Future<ObjectBox> create() async {
    final docsDir = await getApplicationDocumentsDirectory();
    // Future<Store> openStore() {...} is defined in the generated objectbox.g.dart
    final store = await openStore(directory: p.join(docsDir.path, "obx-example"));
    return ObjectBox._create(store);
  }
}
```

{% hint style="info" %}
**For sandboxed macOS apps** also pass `macosApplicationGroup` to `openStore()`. See the notes about "macOS application group" in [the constructor documentation](https://pub.dev/documentation/objectbox/latest/objectbox/Store/Store.html) of the `Store` class.

For example:

`openStore(macosApplicationGroup: "FGDTDLOBXDJ.demo")`
{% endhint %}

{% hint style="info" %}
**On mobile devices or sandboxed apps** data should be stored in the app's documents directory. See [Flutter: read & write files](https://flutter.dev/docs/cookbook/persistence/reading-writing-files) for more info. This is exactly what `openStore()`does, if the `directory` argument is not specified.

**On desktop systems** it is recommended to specify a `directory` to create a custom sub-directory to avoid conflicts with other apps.

If your code passes a directory that the application can't write to, you get an error that looks somewhat like this: `failed to create store: 10199 Dir does not exist: objectbox (30)`.
{% endhint %}

The best time to **initialize ObjectBox** is when your app starts. We suggest to do it in your app's `main()` function:

```dart
/// Provides access to the ObjectBox Store throughout the app.
late ObjectBox objectbox;

Future<void> main() async {
  // This is required so ObjectBox can get the application directory
  // to store the database in.
  WidgetsFlutterBinding.ensureInitialized();

  objectbox = await ObjectBox.create();

  runApp(MyApp());
}
```

{% hint style="info" %}
**When using Dart isolates,** note that [each Dart isolate has its own global fields](https://dart.dev/language/concurrency#isolates), they do not share state on the Dart level.

However, as ObjectBox runs on the native or process level (so one native instance shared across all isolates), instead of creating a new Store in another isolate your code should instead [attach to the open native store](https://pub.dev/documentation/objectbox/latest/objectbox/Store/Store.attach.html).
{% endhint %}
{% endtab %}

{% tab title="Dart Native" %}
Create it using the generated `openStore()` method, for example like this:

```dart
import 'objectbox.g.dart'; // created by `dart pub run build_runner build`

void main() {
  // Store openStore() {...} is defined in the generated objectbox.g.dart
  final store = openStore();

  // your app code ...

  store.close(); // don't forget to close the store
}
```

The above minimal example omits the argument to `(directory: )`, using the default - `./objectbox` - in the current working directory.

{% hint style="info" %}
**When using Dart isolates,** note that [each Dart isolate has its own global fields](https://dart.dev/language/concurrency#isolates), they do not share state on the Dart level.

However, as ObjectBox runs on the native or process level (so one native instance shared across all isolates), instead of creating a new Store in another isolate your code should instead [attach to the open native store](https://pub.dev/documentation/objectbox/latest/objectbox/Store/Store.attach.html).
{% endhint %}
{% endtab %}

{% tab title="Python" %}
```python
from objectbox import Store
  
store = Store()
```
{% endtab %}
{% endtabs %}

It is possible to specify various options when building a store. Notably for testing or caching, to use an **in-memory database** that does not create any files:

{% tabs %}
{% tab title="Java" %}
<pre class="language-java"><code class="lang-java"><strong>BoxStore inMemoryStore = MyObjectBox.builder()
</strong>        .androidContext(context)
        .inMemory("test-db")
        .build();
</code></pre>
{% endtab %}

{% tab title="Dart" %}
```dart
 final inMemoryStore =
     Store(getObjectBoxModel(), directory: "memory:test-db");
```
{% endtab %}

{% tab title="Python" %}
```python
store = Store(directory="memory:testdata")
```
{% endtab %}
{% endtabs %}

For **more store configuration options:** for Java see the [BoxStoreBuilder](https://objectbox.io/docfiles/java/current/io/objectbox/BoxStoreBuilder.html) and for Dart the [Store](https://pub.dev/documentation/objectbox/latest/objectbox/Store/Store.html) documentation. (Python APIs will be published soon)

## Basic Box operations

The[ Box class](https://objectbox.io/files/objectbox-java/current/io/objectbox/Box.html) is likely the class you interact with most. A Box instance gives you access to objects of a particular type. For example, if you have `User` and `Order` entities, you need a Box object to interact with each:

{% tabs %}
{% tab title="Java" %}
```java
Box<User> userBox = store.boxFor(User.class);
Box<Order> orderBox = store.boxFor(Order.class);
```
{% endtab %}

{% tab title="Kotlin" %}
```kotlin
val userBox = store.boxFor(User::class)
val orderBox = store.boxFor(Order::class)
```
{% endtab %}

{% tab title="Dart" %}
```dart
final userBox = store.box<User>();
final orderBox = store.box<Order>();
```
{% endtab %}

{% tab title="Python" %}
```python
user_box = store.box(User)
order_box = store.box(Order)
```
{% endtab %}
{% endtabs %}

These are some of the operations offered by the Box class:

**put** inserts a new object or updates an existing one (with the same ID). When inserting, an ID will be assigned to the just inserted object (this will be explained below) and returned. `put` also supports putting multiple objects, which is more efficient.

{% tabs %}
{% tab title="Java" %}
```java
User user = new User("Tina");
userBox.put(user);

List<User> users = getNewUsers();
userBox.put(users);
```
{% endtab %}

{% tab title="Kotlin" %}
```kotlin
val user = User(name = "Tina")
userBox.put(user)

val users: List<User> = getNewUsers()
userBox.put(users)
```
{% endtab %}

{% tab title="Dart" %}
```dart
final user = User(name: 'Tina');
userBox.put(user);

final users = getNewUsers();
userBox.putMany(users);
```
{% endtab %}

{% tab title="Python" %}
```python
user = User(name="Tina")
user_box.put(user)

users = get_new_users()
user_box.put(*users)
```
{% endtab %}
{% endtabs %}

**get and getAll:** Given an object’s ID, `get` reads it from its box. To get all objects in the box use `getAll` .

{% tabs %}
{% tab title="Java" %}
```java
User user = userBox.get(userId);

List<User> users = userBox.getAll();
```
{% endtab %}

{% tab title="Kotlin" %}
```kotlin
val user = userBox[userId]

val users = userBox.all
```
{% endtab %}

{% tab title="Dart" %}
```dart
final user = userBox.get(userId);

final users = userBox.getMany(userIds);

final users = userBox.getAll();
```
{% endtab %}

{% tab title="Python" %}
```python
user = user_box.get(user_id)

users = user_box.get_all()
```
{% endtab %}
{% endtabs %}

**query:** Starts building a query to return objects from the box that match certain conditions. See [queries](queries.md) for details.

{% tabs %}
{% tab title="Java" %}
```java
Query<User> query = userBox
    .query(User_.name.equal("Tom"))
    .order(User_.name)
    .build();
List<User> results = query.find();
query.close();
```
{% endtab %}

{% tab title="Kotlin" %}
```kotlin
val query = userBox
    .query(User_.name.equal("Tom"))
    .order(User_.name)
    .build()
val results = query.find()
query.close()
```
{% endtab %}

{% tab title="Dart" %}
```dart
final query =
    (userBox.query(User_.name.equals('Tom'))..order(User_.name)).build();
final results = query.find();
query.close();
```
{% endtab %}

{% tab title="Python" %}
```python
query = user_box \
    .query(User.name.equals('Tom')) \
    .build()
results = query.find()
```
{% endtab %}
{% endtabs %}

**remove and removeAll:** Remove a previously put object from its box (deletes it). `remove` also supports removing multiple objects, which is more efficient. `removeAll` removes (deletes) all objects in a box.

{% tabs %}
{% tab title="Java" %}
```java
boolean isRemoved = userBox.remove(userId);

userBox.remove(users);
// alternatively:
userBox.removeByIds(userIds);

userBox.removeAll();
```
{% endtab %}

{% tab title="Kotlin" %}
```kotlin
val isRemoved = userBox.remove(userId)

userBox.remove(users)
// alternatively:
userBox.removeByIds(userIds)

userBox.removeAll()
```
{% endtab %}

{% tab title="Dart" %}
```dart
final isRemoved = userBox.remove(userId);

userBox.removeMany(userIds);

userBox.removeAll();
```
{% endtab %}

{% tab title="Python" %}
```python
is_removed = user_box.remove(user_id)

user_box.remove_all()
```
{% endtab %}
{% endtabs %}

**count:** Returns the number of objects stored in this box.

{% tabs %}
{% tab title="Java" %}
```java
long userCount = userBox.count();
```
{% endtab %}

{% tab title="Kotlin" %}
```kotlin
val userCount = userBox.count()
```
{% endtab %}

{% tab title="Dart" %}
```dart
final userCount = userBox.count();
```
{% endtab %}

{% tab title="Python" %}
```
user_box.count()
```
{% endtab %}
{% endtabs %}

For a complete list of methods available in the Box class, check the API reference documentation for [Java](https://objectbox.io/files/objectbox-java/current/io/objectbox/Box.html) or [Dart](https://pub.dev/documentation/objectbox/latest/objectbox/Box-class.html).

### Asynchronous operations

ObjectBox has built-in support to run (typically multiple or larger) database operations asynchronously.

{% tabs %}
{% tab title="Java" %}
**runInTxAsync** and **callInTxAsync:** runs the given Runnable/Callable in a transaction on a background thread (the internal ObjectBox thread pool) and calls the given callback once done. In case of callInTxAsync the callback also receives the returned result.

```java
store.callInTxAsync(() -> {
    Box<User> box = store.boxFor(User.class);
    String name = box.get(userId).name;
    box.remove(userId);
    return text;
}, (result, error) -> {
    if (error != null) {
        System.out.println("Failed to remove user with id " + userId);
    } else {
        System.out.println("Removed user with name: " + result);
    }
});
```

**awaitCallInTx (Kotlin Coroutines only):** wraps callInTxAsync in a coroutine that suspends until the transaction has completed. Likewise, on success the return value of the given callable is returned, on failure an exception is thrown.

```kotlin
try {
    val name = store.awaitCallInTx {
        val box = store.boxFor(User::class.java)
        val name = box.get(userId).name
        box.remove(userId)
        name
    }
    println("Removed user with name $name")
} catch (e: Exception) {
    println("Failed to remove user with id $userId")
}
```
{% endtab %}

{% tab title="Dart" %}
**Most Box methods do have async versions** which run the operation in a worker isolate.

For example **putAsync:** asynchronously inserts a new object or updates an existing one (with the same ID). The returned future completes when the object is successfully written to the database.

```dart
final user = User(name: 'Tina');
Future<int> idFuture = userBox.putAsync(user);

...

final id = await idFuture;
userBox.get(id); // after the future completed, the object is inserted
```

**To run multiple operations,** it is more efficient to wrap the synchronous calls in an asynchronous transaction with **runInTransactionAsync (**[**API reference**](https://pub.dev/documentation/objectbox/latest/objectbox/Store/runInTransactionAsync.html)**):** run a callback with multiple database operations within a write or read transaction in the background without blocking the user interface. Can return results.

```dart
// The callback must be a function that can be sent to an isolate: 
// either a top-level function, static method or a closure that only
// captures objects that can be sent to an isolate.
String? readNameAndRemove(Store store, int objectId) {
  var box = store.box<User>();
  final nameOrNull = box.get(objectId)?.name;
  box.remove(objectId);
  return nameOrNull;
}
final nameOrNull = 
  await store.runInTransactionAsync(TxMode.write, readNameAndRemove, objectId);
```

There is also **runAsync (**[**API reference**](https://pub.dev/documentation/objectbox/latest/objectbox/Store/runAsync.html)**):** like runInTransactionAsync but does not start a transaction, leaving that to your callback code. This allows to supply a callback that is an async function.

If it is necessary to **call put many times** in a row, take a look at **putQueued:** Schedules the given object to be put later on, by an asynchronous queue, returns the id immediately even though the object may not have been written yet. You can use Store's `awaitQueueCompletion()` or `awaitQueueSubmitted()` to wait for the async queue to finish.

```dart
for (int i = 0; i < 100; i++) {
  userBox.putQueued(User(name: 'User $i'));
}

// Optional: wait until submitted items are processed.
store.awaitQueueSubmitted();
expect(userBox.count(), equals(100));
```
{% endtab %}

{% tab title="Python" %}
{% hint style="info" %}
Currently work in progress.
{% endhint %}
{% endtab %}
{% endtabs %}

## Object IDs

By default **IDs for new objects are assigned by ObjectBox**. When a new object is put, it will be assigned the next highest available ID:

{% tabs %}
{% tab title="Java" %}
```java
User user = new User();
// user.id == 0
box.put(user);
// user.id != 0
long id = user.id;
```
{% endtab %}

{% tab title="Kotlin" %}
```kotlin
val user = User()
// user.id == 0
box.put(user)
// user.id != 0
val id = user.id
```
{% endtab %}

{% tab title="Dart" %}
```dart
final user = User();
// user.id == 0
box.put(user);
// user.id != 0
final id = user.id;
```
{% endtab %}

{% tab title="Python" %}
```
user = User()
box.put(user)
id: int = user.id
```
{% endtab %}
{% endtabs %}

For example, if there is an object with ID 1 and another with ID 100 in a box, the next new object that is put will be assigned ID 101.

If you try to assign a new ID yourself and put the object, ObjectBox will throw an error.

{% hint style="info" %}
If you **need to assign IDs by yourself,** have a look at [how to switch to self-assigned IDs](advanced/object-ids.md#self-assigned-object-ids) and what side effects apply.
{% endhint %}

### Reserved Object IDs

Object IDs **can not be**:

* **`0` (zero) or `null` (if using java.lang.Long)** As said above, when putting an object with ID zero it will be assigned an unused ID (not zero).
* **`0xFFFFFFFFFFFFFFFF` (-1 in Java)** Reserved for internal use.

For a detailed explanation see the page on [Object IDs](advanced/object-ids.md).

## Transactions

While ObjectBox offers powerful transactions, it is sufficient for many apps to consider just some basics guidelines about transactions:

* A `put` runs an implicit transaction.
* Prefer `put` bulk overloads for lists (like `put(entities)`) when possible.
* For a high number of DB interactions in loops, consider explicit transactions, such as using `runInTx()`.

For more details check the separate [transaction documentation](transactions.md).

## Have an app with greenDAO? DaoCompat is for you!

DaoCompat is a compatibility layer that gives you a greenDAO like API for ObjectBox. It makes switching from greenDAO to ObjectBox simple. Have a look at [the documentation](http://greenrobot.org/greendao/documentation/objectbox-compat/) and [the example](https://github.com/objectbox/objectbox-examples/tree/master/android-app-daocompat). [Contact us](https://github.com/objectbox/objectbox-java/issues) if you have any questions!

## Next steps

* Check out the [ObjectBox example projects on GitHub](https://github.com/objectbox/objectbox-examples/).
* Learn about [Queries](queries.md) and [Relations](relations.md).
* Learn [how to write unit tests](android/android-local-unit-tests.md).
* To enable debug mode and for advanced use cases, see the [advanced-setup.md](advanced/advanced-setup.md "mention") page.
