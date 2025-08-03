---
description: How to create ObjectBox local unit tests for Android projects.
---

# Android Local Unit Tests

## Android Local Unit Tests

ObjectBox supports local unit tests. This gives you the full ObjectBox functionality for running super fast test directly on your development machine.

On [Android, unit tests](https://developer.android.com/training/testing/unit-testing/index.html) can either run on an Android device (or emulator), so called instrumented tests, or they can run on your local development machine. Running local unit tests is typically much faster.

To learn how local unit tests for Android work in general have a look at the Android developers documentation on [Building Local Unit Tests](https://developer.android.com/training/testing/unit-testing/local-unit-tests.html). Read along to learn how to use ObjectBox in your local unit tests.

{% hint style="success" %}
This page also applies to writing unit tests for desktop projects.
{% endhint %}

## Set Up Your Testing Environment

{% hint style="info" %}
**The setup step is only required for ObjectBox 1.4 or older** (or if you want to manually add the dependencies)**.** In newer versions the ObjectBox plugin automatically adds the native ObjectBox library required for your current operating system.
{% endhint %}

Add the native ObjectBox library for your operating system to your existing test dependencies in your app’s `build.gradle` file:

```java
dependencies {
    // Required -- JUnit 4 framework
    testImplementation("junit:junit:4.12")
    // Optional -- manually add native ObjectBox library to override auto-detection
    testImplementation("io.objectbox:objectbox-linux:$objectboxVersion")
    testImplementation("io.objectbox:objectbox-macos:$objectboxVersion")
    testImplementation("io.objectbox:objectbox-windows:$objectboxVersion")
    // Not added automatically:
    // Since 2.9.0 we also provide ARM support for the Linux library
    testImplementation("io.objectbox:objectbox-linux-arm64:$objectboxVersion")       
    testImplementation("io.objectbox:objectbox-linux-armv7:$objectboxVersion")
}
```

{% hint style="info" %}
The ObjectBox native libraries currently only support 64-bit desktop operating systems.
{% endhint %}

{% hint style="info" %}
On Windows you might have to install the [Microsoft Visual C++ 2015 Redistributable (x64)](https://www.microsoft.com/en-US/download/details.aspx?id=48145) packages to use the native library.
{% endhint %}

## Create a Local Unit Test Class

You create your local unit test class as usual under `module-name/src/test/java/`. To use ObjectBox in your test methods you need to build a BoxStore instance using the generated MyObjectBox class of your project. You can use the [directory(File) method](http://objectbox.io/files/objectbox-java/current/io/objectbox/BoxStoreBuilder.html#directory-java.io.File-) on the BoxStore builder to ensure the test database is stored in a specific folder on your machine. To start with a clean database for each test you can delete the existing database using [BoxStore.deleteAllFiles(File)](http://objectbox.io/files/objectbox-java/current/io/objectbox/BoxStore.html#deleteAllFiles-java.io.File-).

The following example shows how you could implement a local unit test class that uses ObjectBox:

{% tabs %}
{% tab title="Java" %}
```java
public class NoteTest {
    
    private static final File TEST_DIRECTORY = new File("objectbox-example/test-db");
    private BoxStore store;
    
    @Before
    public void setUp() throws Exception {
        // Delete any files in the test directory before each test to start with a clean database.
        BoxStore.deleteAllFiles(TEST_DIRECTORY);
        store = MyObjectBox.builder()
                // Use a custom directory to store the database files in.
                .directory(TEST_DIRECTORY)
                // Optional: add debug flags for more detailed ObjectBox log output.
                .debugFlags(DebugFlags.LOG_QUERIES | DebugFlags.LOG_QUERY_PARAMETERS)
                .build();
    }
    
    @After
    public void tearDown() throws Exception {
        if (store != null) {
            store.close();
            store = null;
        }
        BoxStore.deleteAllFiles(TEST_DIRECTORY);
    }
    
    @Test
    public void exampleTest() {
        // get a box and use ObjectBox as usual
        Box<Note> noteBox = store.boxFor(Note.class);
        assertEquals(...);
    }
    
}
```


{% endtab %}

{% tab title="Kotlin" %}
```kotlin
open class NoteTest {

    private var _store: BoxStore? = null
    protected val store: BoxStore
        get() = _store!!

    @Before
    fun setUp() {
        // Delete any files in the test directory before each test to start with a clean database.
        BoxStore.deleteAllFiles(TEST_DIRECTORY)
        _store = MyObjectBox.builder()
            // Use a custom directory to store the database files in.
            .directory(TEST_DIRECTORY)
            // Optional: add debug flags for more detailed ObjectBox log output.
            .debugFlags(DebugFlags.LOG_QUERIES or DebugFlags.LOG_QUERY_PARAMETERS)
            .build()
    }

    @After
    fun tearDown() {
        _store?.close()
        _store = null
        BoxStore.deleteAllFiles(TEST_DIRECTORY)
    }
    
    @Test
    fun exampleTest() {
        // Get a box and use ObjectBox as usual
        val noteBox = store.boxFor(Note::class.java)
        assertEquals(...)
    }

    companion object {
        private val TEST_DIRECTORY = File("objectbox-example/test-db")
    }
}
```


{% endtab %}
{% endtabs %}

{% hint style="info" %}
To help diagnose issues you can enable log output for ObjectBox actions, such as queries, by specifying one or more [debug flags](http://objectbox.io/files/objectbox-java/current/io/objectbox/BoxStoreBuilder.html#debugFlags-int-) when building BoxStore.
{% endhint %}

## Base class for tests

It’s usually a good idea to extract the setup and tear down methods into a base class for your tests. E.g.:

{% tabs %}
{% tab title="Java" %}
```java
public class AbstractObjectBoxTest {

    private static final File TEST_DIRECTORY = new File("objectbox-example/test-db");

    protected BoxStore store;

    @Before
    public void setUp() throws Exception {
        // Delete any files in the test directory before each test to start with a clean database.
        BoxStore.deleteAllFiles(TEST_DIRECTORY);
        store = MyObjectBox.builder()
                // Use a custom directory to store the database files in.
                .directory(TEST_DIRECTORY)
                // Optional: add debug flags for more detailed ObjectBox log output.
                .debugFlags(DebugFlags.LOG_QUERIES | DebugFlags.LOG_QUERY_PARAMETERS)
                .build();
    }

    @After
    public void tearDown() throws Exception {
        if (store != null) {
            store.close();
            store = null;
        }
        BoxStore.deleteAllFiles(TEST_DIRECTORY);
    }
}
```


{% endtab %}

{% tab title="Kotlin" %}
```kotlin
open class AbstractObjectBoxTest {

    private var _store: BoxStore? = null
    protected val store: BoxStore
        get() = _store!!

    @Before
    fun setUp() {
        // Delete any files in the test directory before each test to start with a clean database.
        BoxStore.deleteAllFiles(TEST_DIRECTORY)
        _store = MyObjectBox.builder()
            // Use a custom directory to store the database files in.
            .directory(TEST_DIRECTORY)
            // Optional: add debug flags for more detailed ObjectBox log output.
            .debugFlags(DebugFlags.LOG_QUERIES or DebugFlags.LOG_QUERY_PARAMETERS)
            .build()
    }

    @After
    fun tearDown() {
        _store?.close()
        _store = null
        BoxStore.deleteAllFiles(TEST_DIRECTORY)
    }

    companion object {
        private val TEST_DIRECTORY = File("objectbox-example/test-db")
    }
}
```
{% endtab %}
{% endtabs %}

## Testing Entities with Relations

{% hint style="info" %}
Kotlin desktop projects only. Since 3.0.0 this is no longer necessary for Android projects (either Kotlin or Java), initialization magic works for them now as well.
{% endhint %}

To test entities that have [relations](../relations.md), like **ToOne or ToMany** properties, on the local JVM you must initialize them and add a transient BoxStore field.

**See the** [**documentation about "initialization magic"**](../relations.md#initialization-magic) for an example and what to look out for.

Background: the "initialization magic" is normally done by the ObjectBox plugin using the Android Gradle Plugin Transform API or a Gradle task running after the Java compiler which allows to modify byte-code. However, this does currently not work for Kotlin code in Kotlin desktop projects.
