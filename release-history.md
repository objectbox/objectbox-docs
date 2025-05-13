---
description: Release notes for ObjectBox 1.5.0 and older.
---

# Release History before 4.0.3

Although this is technically the changelog for Java, this is also a good reference of what changed in the ObjectBox C++ core.

### 4.0.2 - 2024-08-20

* Add convenience `oneOf` and `notOneOf` conditions that accept `Date` to avoid manual conversion using `getTime()`.
* When `BoxStore` is closing, briefly wait on active transactions to finish.
* Guard against crashes when `BoxStore` was closed, but database operations do still occur concurrently (transactions are still active).

### 4.0.1 - 2024-06-03

* Examples: added [Vector Search example](https://github.com/objectbox/objectbox-examples/tree/main/java-main-vector-search) that demonstrates how to perform on-device [approximate nearest neighbor (ANN) search](https://docs.objectbox.io/on-device-vector-search).
* Revert deprecation of `Box.query()`, it is still useful for queries without any condition.
* Add note on old query API methods of `QueryBuilder` that they are not recommended for new projects. Use [the new query APIs](https://docs.objectbox.io/queries) instead.
* Update and expand documentation on `ToOne` and `ToMany`.

### 4.0.0 - Vector Search - 2024-05-16

**ObjectBox now supports** [**Vector Search**](https://docs.objectbox.io/ann-vector-search) to enable efficient similarity searches.

This is particularly useful for AI/ML/RAG applications, e.g. image, audio, or text similarity. Other use cases include semantic search or recommendation engines.

Create a Vector (HNSW) index for a floating point vector property. For example, a `City` with a location vector:

```java
@Entity
public class City {

    @HnswIndex(dimensions = 2)
    float[] location;
    
}
```

Perform a nearest neighbor search using the new `nearestNeighbors(queryVector, maxResultCount)` query condition and the new "find with scores" query methods (the score is the distance to the query vector). For example, find the 2 closest cities:

```java
final float[] madrid = {40.416775F, -3.703790F};
final Query<City> query = box
        .query(City_.location.nearestNeighbors(madrid, 2))
        .build();
final City closest = query.findWithScores().get(0).get();
```

For an introduction to Vector Search, more details and other supported languages see the [Vector Search documentation](https://docs.objectbox.io/ann-vector-search).

* BoxStore: deprecated `BoxStore.sizeOnDisk()`. Instead use one of the new APIs to determine the size of a database:
  * `BoxStore.getDbSize()` which for a file-based database returns the file size and for an in-memory database returns the approximately used memory,
  * `BoxStore.getDbSizeOnDisk()` which only returns a non-zero size for a file-based database.
* Query: add properly named `setParameter(prop, value)` methods that only accept a single parameter value, deprecated the old `setParameters(prop, value)` variants.
* Sync: add `SyncCredentials.userAndPassword(user, password)`.
* Gradle plugin: the license of the [Gradle plugin](https://github.com/objectbox/objectbox-java-generator) has changed to the GNU Affero General Public License (AGPL).

### V3.8.0 - 2024-02-13

*   Support creating file-less in-memory databases, e.g. for caching and testing. To create one use `inMemory()` when building a `BoxStore`:

    ```java
    store = MyObjectBox.builder()
            .androidContext(context)
            .inMemory("test-db")
            .build();
    ```

    See the `BoxStoreBuilder.inMemory()` documentation for details.
* Change `BoxStore.deleteAllFiles()` to support deleting an in-memory database.
* The `maxDataSizeInKByte()` option when building a store is ready for production use. This is different from the existing `maxSizeInKByte()` option in that it is possible to remove data after reaching the limit and continue to use the database. See its documentation for more details.
* Admin will now print a warning when it does not have permission to show the Admin notification. When testing your app on a device with Android 13 or newer, developers should manually turn on notifications to make use of the Admin notification.
* Added examples on how to use Kotlin's unsigned integer types to [Custom types](advanced/custom-types.md).
* Restore compatibility with Kotlin 1.5. However, need to exclude `kotlin-stdlib` 1.8 from `objectbox-kotlin` as it includes classes previously in the -jdk7/-jdk8 libraries to avoid duplicate class file errors. So if not absolutely needed, we still recommend to use at least Kotlin 1.8.

### V3.7.1 - 2023/11/07

* Throw an exception instead of crashing when trying to create a query on a closed store. [#1154](https://github.com/objectbox/objectbox-java/issues/1154)
* The Gradle plugin now requires at least Gradle 7.0 and Android Gradle Plugin 4.1.
* The Android library now requires Android 4.4 (API 19) or newer.

### V3.7.0 - 2023/08/22

* A new key/value validation option `validateOnOpenKv()` is available on `MyObjectBox.builder()` to help diagnose `FileCorruptException: Corrupt DB, min key size violated` issues. If enabled, the `build()` call will throw a `FileCorruptException` if corruption is detected with details on which key/value is affected. [#1143](https://github.com/objectbox/objectbox-java/issues/1143)
* Admin: integer and floating point arrays introduced with the previous release are now nicely displayed and collapsed if long.
* Admin: the data table again displays all items of a page. [#1135](https://github.com/objectbox/objectbox-java/issues/1135)
* The `__cxa_pure_virtual` crash should not occur anymore; if you get related exceptions, they should contain additional information to better diagnose this issue. Let us know details in [#1131](https://github.com/objectbox/objectbox-java/issues/1131)
* Queries: all expected results are now returned when using a less-than or less-or-equal condition for a String property with index type `VALUE`. Reported via [objectbox-dart#318](https://github.com/objectbox/objectbox-dart/issues/318)
* Queries: when combining multiple conditions with OR and adding a condition on a related entity ("link condition") the combined conditions are now properly applied. Reported via [objectbox-dart#546](https://github.com/objectbox/objectbox-dart/issues/546)
* Some flags classes have moved to the new `config` package:
  * `io.objectbox.DebugFlags` is deprecated, use `io.objectbox.config.DebugFlags` instead.
  * `io.objectbox.model.ValidateOnOpenMode` is deprecated, use `io.objectbox.config.ValidateOnOpenModePages` instead.

### V3.6.0 - 2023/05/16

*   **Support for integer and floating point arrays**: store

  * `short[]`, `char[]`, `int[]`, `long[]` and
  * `float[]` and `double[]`

    (or their Kotlin counterparts, e.g. `FloatArray`) without a converter.

    A simple example is a shape entity that stores a palette of RGB colors:

    ```java
    @Entity
    public class Shape {

        @Id public long id;

        // An array of RGB color values that are used by this shape.
        public int[] palette;

    }

    // Find all shapes that use red in their palette
    try (Query<Shape> query = store.boxFor(Shape.class)
            .query(Shape_.palette.equal(0xFF0000))
            .build()) {
            query.findIds();
    }
    ```

    This can also be useful to store vector embeddings produced by machine learning, e.g.:

    ```java
    @Entity
    public class ImageEmbedding {

        @Id public long id;

        // Link to the actual image, e.g. on Cloud storage
        public String url;

        // The coordinates computed for this image (vector embedding)
        public float[] coordinates;

    }
    ```
* Fix incorrect Cursor code getting generated when using `@Convert` to convert to a `String` array.
* The `io.objectbox.sync` plugin now also automatically adds a Sync-enabled JNI library on macOS and Windows (previously on Linux x64 only; still need to [add manually for Linux on ARM](https://sync.objectbox.io/sync-client#objectbox-sync-enabled-library)).

### V3.5.1 - 2023/01/31

* Fixes writes failing with "error code -30786", which may occur in some corner cases on some devices. [#1099](https://github.com/objectbox/objectbox-java/issues/1099)
* Add docs to `DbSchemaException` on how to resolve its typical causes.

### V3.5.0 - 2022/12/05

**This release includes breaking changes to generated code. If you encounter build errors, make sure to clean and build your project (e.g. Build > Rebuild project in Android Studio).**

* **Add `Query.copy()` and `QueryThreadLocal`** to obtain a `Query` instance to use in different threads. [Learn more about re-using queries](https://docs.objectbox.io/queries#reusing-queries-and-parameters). [#1071](https://github.com/objectbox/objectbox-java/issues/1071)
* **Add `relationCount` query condition** to match objects that have a certain number of related objects pointing to them. E.g. `Customer_.orders.relationCount(2)` will match all customers with two orders, `Customer_.orders.relationCount(0)` will match all customers with no associated order. This can be useful to find objects where the relation was dissolved, e.g. after the related object was removed.
* Allow using a relation target ID property with a [property query](https://docs.objectbox.io/queries#propertyquery). E.g. `query.property(Order_.customerId)` will map results to the ID of the customer of an order. [#1028](https://github.com/objectbox/objectbox-java/issues/1028)
* Add docs on `DbFullException` about [why it occurs and how to handle it](https://docs.objectbox.io/troubleshooting#dbfullexception-could-not-put).
* Do not fail to transform an entity class that contains a transient relation field when using Android Gradle Plugin 7.1 or lower.
* Restore compatibility for Android projects using Gradle 6.1. **The minimum supported version for Gradle is 6.1 and for the Android Gradle Plugin 3.4.** This should make it easier for older projects to update to the latest version of ObjectBox.

**Using Sync?** This release uses a new Sync protocol which improves efficiency. Reach out via your existing contact to check if any actions are required for your setup.

### V3.4.0 - 2022/10/18

* **Add `findFirstId()` and `findUniqueId()`** to `Query` which just return the ID of a matching object instead of the full object.
* Experimental support for setting a maximum data size via the `maxDataSizeInKByte` property when building a Store. This is different from the existing `maxSizeInKByte` property in that it is possible to remove data after reaching the limit and continue to use the database. See its documentation for more details.
* Fix a crash when querying a value-based index (e.g. `@Index(type = IndexType.VALUE)`) on Android 32-bit ARM devices. [#1105](https://github.com/objectbox/objectbox-java/issues/1105)
* Various small improvements to the native libraries.

**Using Sync?** There is no Sync version for this release, please continue using version 3.2.1.

### V3.3.1 - 2022/09/05

**Note: V3.3.0 contains a bug preventing correct transformation of some classes, please use V3.3.1 instead.**

* Gradle plugin: use new transform API with Android Plugin 7.2.0 and newer. Builds should be slightly faster as only entity and cursor classes and only incremental changes are transformed. [#1078](https://github.com/objectbox/objectbox-java/issues/1078)
* Gradle plugin: improve detection of applied Android plugins, improve registration of byte-code transform for non-Android Java projects, add check for minimum supported version of Gradle.

**Using Sync?** There is no Sync version for this release, please continue using version 3.2.1.

### V3.2.1 - 2022/07/05

* Resolve an issue that prevented resources from getting cleaned up after closing `BoxStore`, causing the reference table to overflow when running many instrumentation tests on Android. [#1080](https://github.com/objectbox/objectbox-java/issues/1080)
* Plugin: support Kotlin 1.7. [#1085](https://github.com/objectbox/objectbox-java/issues/1085)

### V3.2.0 - 2022/06/20

* Query: throw `IllegalStateException` when query is closed instead of crashing the virtual machine. [#1081](https://github.com/objectbox/objectbox-java/issues/1081)
* BoxStore and Query now throw `IllegalStateException` when trying to subscribe but the store or query is closed already.
* Various internal improvements including minor optimizations for binary size and performance.

### V3.1.3 - 2022/05/10

* **The Data Browser has been renamed to** [**ObjectBox Admin**](https://docs.objectbox.io/data-browser)**.** Deprecated `AndroidObjectBrowser`, use `Admin` instead. `AndroidObjectBrowser` will be removed in a future release.
* Windows: using a database directory path that contains unicode (UTF-8) characters does not longer create an additional, unused, directory with garbled characters.
* Query: when using a negative offset or limit display a helpful error message.
* Processor: do not crash, but error if ToOne/ToMany type arguments are not supplied (e.g. `ToOne` instead of `ToOne<Entity>`).

### V3.1.2 - 2022/02/21

This release only contains bug fixes for the Android library when used with ObjectBox for Dart/Flutter.

### V3.1.1 - 2022/01/26

* Fix incorrect unique constraint violation if an entity contains at least two unique properties with a certain combination of non-unique indexes.
* **Data Browser/Admin: improved support when running multiple on the same host**, but a different port (e.g. `localhost:8090` and `localhost:8091`).

### V3.1.0 - 2021/12/15

[Read the blog post with more details](https://objectbox.io/objectbox-java-database-flex-type/) and code examples for the new flex properties and query conditions.

* [**Support Flex properties**](advanced/custom-types.md#flex-properties)**.** Expanding on the string and flexible map support in `3.0.0`, it is now possible to add a property using `Object` in Java or `Any?` in Kotlin. These "flex properties" allow to store values of various types like integers, floating point values, strings and byte arrays. Or lists and maps (using string keys) of those.
* **The `containsElement` query condition now matches keys of string map properties.** It also matches string or integer elements of a Flex list.
* **New `containsKeyValue` query condition to match key/value combinations** of string map and Flex map properties containing strings and integers. Also added matching `Query.setParameters` overload.
* Add ProGuard/R8 rule to not warn about `SuppressFBWarnings` annotation. #1011
* Add more detailed error message when loading the native library fails on Android. #1024
* **Data browser: byte arrays are now correctly displayed in Base64 encoding.** #1033

#### Kotlin

* **Add `BoxStore.awaitCallInTx` suspend function** which wraps `BoxStore.callInTx`.

#### Gradle plugin

* Do not crash trying to add dependencies to Java desktop projects that only apply the Gradle `application` plugin.

### V3.0.0 - 2021/10/19

{% hint style="info" %}
**2021/10/19: Released version 3.0.1**, which contains a fix for Android Java projects.
{% endhint %}

*   [**A new Query API**](https://docs.objectbox.io/queries#new-query-api) is available that works similar to the [ObjectBox for Dart/Flutter](https://pub.dev/packages/objectbox) Query API and makes it **easier to create nested conditions**. #201

    ```kotlin
    // equal AND (less OR oneOf)
    val query = box.query(
          User_.firstName equal "Joe"
                  and (User_.age less 12
                  or (User_.stamp oneOf longArrayOf(1012))))
          .order(User_.age)
          .build()
    ```
*   **For the existing Query API, String property conditions now require to explicitly specify case.** See the documentation of [`StringOrder`](https://objectbox.io/docfiles/java/current/io/objectbox/query/QueryBuilder.StringOrder.html) for which one to choose (typically `StringOrder.CASE_INSENSITIVE`).

    ```kotlin
    // Replace String conditions like
    query().equal(User_.firstName, "Joe")
    // With the one accepting a StringOrder
    query().equal(User_.firstName, "Joe", StringOrder.CASE_INSENSITIVE)
    ```
* **Subscriptions now publish results in serial instead of in parallel** (using a single thread vs. multiple threads per publisher). Publishing in parallel could previously lead to outdated results getting delivered after the latest results. As a side-effect transformers now run in serial instead of in parallel as well (on the same single thread per publisher). #793
*   **Support annotating a single property with `@Unique(onConflict = ConflictStrategy.REPLACE)`** to replace an existing Object if a conflict occurs when doing a put. #509

    ```kotlin
    @Entity
    data class Example(
            @Id
            var id: Long = 0,
            @Unique(onConflict = ConflictStrategy.REPLACE)
            var uniqueKey: String? = null
    )
    ```
* Support [`@Unsigned`](https://objectbox.io/docfiles/java/current/io/objectbox/annotation/Unsigned.html) to indicate that values of an integer property (e.g. `Integer` and `Long` in Java) should be treated as unsigned when doing queries or creating indexes.
*   Store time in nanoseconds using the new `@Type` annotation for compatibility with other ObjectBox language bindings:

    ```kotlin
    @Type(DatabaseType.DateNano)
    var timeInNanos: Long;
    ```
* **Package FlatBuffers version into library to avoid conflicts with apps or other libraries using FlatBuffers.** #894
* **Kotlin: add `Flow` extension functions for `BoxStore` and `Query`.** #900
* Data browser: display query results if a property has a `NaN` value. #984
* **Android 12: support using Data Browser if targeting Android 12 (SDK 31).** #1007

#### New supported property types

*   **String arrays** (Java `String[]` and Kotlin `Array<String>`) **and lists** (Java `List<String>` and Kotlin `MutableList<String>`). Using the new `containsElement("item")` condition, it is also possible to query for entities where "item" is equal to one of the elements.

    ```kotlin
    @Entity
    data class Example(
            @Id
            var id: Long = 0,
            var stringArray: Array<String>? = null,
            var stringMap: MutableMap<String, String>? = null
    )

    // matches [“first”, “second”, “third”]
    box.query(Example_.stringArray.containsElement(“second”)).build()
    ```
* **String maps** (Java `Map<String, String>` or Kotlin `MutableMap<String, String>`). Stored internally as a byte array using FlexBuffers.
* **Flexible maps:**
  * map keys must all have the same type,
  * map keys or values must not be null,
  * map values must be one of the supported database type, or a list of them (e.g. String, Boolean, Integer, Double, byte array...).

#### Sync

* The generated JSON model file no longer contains Java-specific flags that would lead to errors if used with Sync server.
* Additional checks when calling client or server methods.

### V2.9.2-RC4 - 2021/08/19

**Note: this is a preview release. Future releases may add, change or remove APIs.**

* [A new experimental Query API](queries.md#new-query-api) provides support for nested AND and OR conditions. [#201](https://github.com/objectbox/objectbox-java/issues/201)
* Subscriptions now publish results in serial instead of in parallel (using a single thread vs. multiple threads per publisher). Publishing in parallel could previously lead to outdated results getting delivered after the latest results. As a side-effect transformers now run in serial instead of in parallel as well (on the same single thread per publisher). [#793](https://github.com/objectbox/objectbox-java/issues/793)
* Add documentation that string property conditions ignore case by default. Point to using case-sensitive conditions for high-performance look-ups, e.g. [when using string UIDs](https://docs.objectbox.io/entity-annotations#object-ids-id).
* Support annotating a single property with `@Unique(onConflict = ConflictStrategy.REPLACE)` to replace an existing Object if a conflict occurs when doing a put. [#509](https://github.com/objectbox/objectbox-java/issues/509)
* Support `@Unsigned` to indicate that values of an integer property (e.g. `Integer` and `Long` in Java) should be treated as unsigned when doing queries or creating indexes. See the Javadoc of the annotation for more details.
* Store time in nanoseconds by annotating a `Long` property with `@Type(DatabaseType.DateNano)`.
* Package FlatBuffers version into library to avoid conflicts if your code uses FlatBuffers as well. [#894](https://github.com/objectbox/objectbox-java/issues/894)
* Kotlin: add Flow extension functions for BoxStore and Query. [#900](https://github.com/objectbox/objectbox-java/pull/990)
* Data browser: display query results if a property has a NaN value. [#984](https://github.com/objectbox/objectbox-java/issues/984)

**New supported property types**

When adding new properties, a converter is no longer necessary to store these types:

* String arrays (Java `String[]` and Kotlin `Array<String>`). Using the new `containsElement("item")` condition, it is also possible to query for entities where "item" is equal to one of the array items.
* String maps (Java `Map<String, String>` or Kotlin `MutableMap<String, String>`). Stored internally as a byte array using FlexBuffers.

**Sync**

* The generated JSON model file no longer contains Java-specific flags that would lead to errors if used with Sync server.
* Additional checks when calling client or server methods.

### V2.9.1 - 2021/03/15

This is the first release **available on the Central repository** (Sonatype OSSRH). Make sure to adjust your `build.gradle` files accordingly:

```
repositories {
    mavenCentral()
}
```

Changes:

* Javadoc for `find(offset, limit)` of `Query` is more concrete on how offset and limit work.
* Javadoc for between conditions explicitly mentions it is inclusive of the two given values.
* Sync: Instead of the same name and a Maven classifier, Sync artifacts now use a different name. E.g. `objectbox-android:2.9.0:sync` is replaced with `objectbox-sync-android:2.9.1`.

### V2.9.0 - 2021/02/16

* Query: Add `lessOrEqual` and `greaterOrEqual` conditions for long, String, double and byte\[] properties.
*   Support Java applications on ARMv7 and AArch64 devices. [#657](https://github.com/objectbox/objectbox-java/issues/657)

    To use, add `implementation "io.objectbox:objectbox-linux-armv7:$objectboxVersion` or `implementation "io.objectbox:objectbox-linux-arm64:$objectboxVersion` to your dependencies. Otherwise the setup is identical with [Java Desktop Apps](https://docs.objectbox.io/java-desktop-apps#add-libraries-for-distribution).
* Resolve rare `ClassNotFoundException: kotlin.text.Charsets` when running processor. [#946](https://github.com/objectbox/objectbox-java/issues/946)
* Ensure Query setParameters works if running the x86 library on x64 devices (which could happen if ABI filters were set up incorrectly). [#927](https://github.com/objectbox/objectbox-java/issues/927)

### V2.8.1 - 2020/11/10

* Minor improvements to [Sync](https://objectbox.io/sync/) tooling.

See the 2.8.0 release notes below for the latest changes.

### **V2.8.0 - 2020/11/05**

* Added [Sync](https://objectbox.io/sync/) API.
* Fixed "illegal reflective access" warning in the plugin.
* The data browser notification is now silent by default, for quieter testing. [#903](https://github.com/objectbox/objectbox-java/issues/903)&#x20;
* Updated and improved API documentation in various places (e.g. on how `Query.findLazy()` and `Query.findLazyCached()` work with `LazyList` [#906](https://github.com/objectbox/objectbox-java/issues/906)).
* Print full name and link to element for `@Index` and `@Id` errors. [#902](https://github.com/objectbox/objectbox-java/issues/902)
* Explicitly allow to remove a `DbExceptionListener` by accepting null values for `BoxStore.setDbExceptionListener(listener)`.

### **V2.7.1 - 2020/08/19**

* Fix exception handling during `BoxStoreBuilder.build()` to allow retries. For example, after a `FileCorruptException` you could try to open the database again using the recently added `usePreviousCommit()` option.
* Add `PagesCorruptException` as a special case of `FileCorruptException`.
* `DbExceptionListener` is called more robustly.

### **V2.7.0 - 2020/07/30**

* Several database store improvements for`BoxStore` and `BoxStoreBuilder`
  * New configuration options to open the database, e.g. a new read-only mode and using the previous data snapshot (second last commit) to potentially recover data.
  * Database validation. We got a GitHub report indicating that some specific devices ship with a broken file system. While this is not a general concern (file systems should not be broken), we decided to detect some typical problems and provide some options to deal with these.&#x20;
  * Get the size on disk
* Add an efficient check if an object exist in a `Box` via `contains(id)`.
* Android improvements
  * Resolve Android Studio Build Analyzer warning about a prepare tasks not specifying outputs.
  * Data Browser drawables are no longer packaged in the regular Android library. [GitHub #857](https://github.com/objectbox/objectbox-java/issues/857)
* Fixes for one-to-many relations, e.g. allow removing both entity classes of a one-to-many relation. [GitHub #859](https://github.com/objectbox/objectbox-java/issues/859)

### **V2.6.0 - 2020/06/09**

* `@DefaultValue("")` annotation for properties to return an empty string instead of null. This is useful if a not-null property is added to an entity, but there are existing entities in the database that will return null for the new property. [GH#157](https://github.com/objectbox/objectbox-java/issues/157)
* [**RxJava 3 support library**](https://github.com/objectbox/objectbox-java/tree/master/objectbox-rxjava3) `objectbox-rxjava3`. Also includes Kotlin extension functions to more easily obtain Rx types, e.g. use `query.observable()` to get an `Observable`. [GH#83](https://github.com/objectbox/objectbox-java/issues/839)
* The annotation processor is incremental by default. [GH#620](https://github.com/objectbox/objectbox-java/issues/620)
* Fix error handling if ObjectBox can't create a Java entity (the proper exception is now thrown).
* Support setting an alias after combining conditions using `and()` or `or()`. [GH#83](https://github.com/objectbox/objectbox-java/issues/834)
* Turn on incremental annotation processing by default. [GH#620](https://github.com/objectbox/objectbox-java/issues/620)
* Add documentation that string property conditions ignore case by default. Point to using case-sensitive conditions for high-performance look-ups, e.g. [when using string UIDs](https://docs.objectbox.io/entity-annotations#object-ids-id).
* Repository Artifacts are signed once again.

Changes since 2.6.0-RC (released on 2020/04/28):

* Performance improvements with query links (aka "joins").\
  Note: the order of results has changed unless you explicitly specified properties to order by. Remember: you should not depend on any internal order. If you did, this is a good time to fix it.
* `objectbox-java` no longer exposes the greenrobot-essentials and FlatBuffers dependencies to consuming projects.
* Minor code improvements.

### **V3.0.0-alpha2 - 2020/03/24**

**Note: this is a preview release. Future releases may add, change or remove APIs.**

* Add Kotlin infix extension functions for creating conditions using the[ new Query API](queries.md#new-query-api). See [the documentation](queries.md#new-query-api) for examples.
* The old Query API now also supports setting an alias after combining conditions using `and()` or `or()`. [GH#834](https://github.com/objectbox/objectbox-java/issues/834)
* Add documentation that string property conditions ignore case by default. Point to using case-sensitive conditions for high-performance look-ups, e.g. [when using string UIDs](https://docs.objectbox.io/entity-annotations#object-ids-id).
* Java's `String[]` and Kotlin's `Array<String>` are now a supported database type. A converter is no longer necessary to store these types. Using the `arrayProperty.equal("item")` condition, it is possible to query for entities where "item" is equal to one of the array items.
* Support `@Unsigned` to indicate that values of an integer property (e.g. `Integer` and `Long` in Java) should be treated as unsigned when doing queries or creating indexes. See the Javadoc of the annotation for more details.
* Add [new library to support RxJava 3](https://github.com/objectbox/objectbox-java/tree/release-3.0.0-alpha2/objectbox-rxjava3), `objectbox-rxjava3`. In addition `objectbox-kotlin` adds extension functions to more easily obtain Rx types, e.g. use `query.observable()` to get an `Observable`. [GH#839](https://github.com/objectbox/objectbox-java/issues/839)

To use this release change the version of `objectbox-gradle-plugin` to `3.0.0-alpha2`. The plugin now properly adds the preview version of `objectbox-java` to your dependencies.

```groovy
buildscript {
    dependencies {
        classpath "io.objectbox:objectbox-gradle-plugin:3.0.0-alpha2"
    }
}

dependencies {
    // Artifacts with native code remain at 2.5.1.
    implementation "io.objectbox:objectbox-android:2.5.1"
}
```

The `objectbox-android`, `objectbox-linux`, `objectbox-macos` and `objectbox-windows` artifacts shipping native code remain at version 2.5.1 as there have been no changes. If you explicitly include them, make sure to specify their version as `2.5.1`.

### **V3.0.0-alpha1 - 2020/03/09**

**Note: this is a preview release. Future releases may add, change or remove APIs.**

* [A new Query API](queries.md#new-query-api) provides support for nested AND and OR conditions. See [the documentation](queries.md#new-query-api) for examples and notable changes. [GH#201](https://github.com/objectbox/objectbox-java/issues/201)
* Subscriptions now publish results in serial instead of in parallel (using a single thread vs. multiple threads per publisher). Publishing in parallel could previously lead to outdated results getting delivered after the latest results. As a side-effect transformers now run in serial instead of in parallel as well (on the same single thread per publisher). [GH#793](https://github.com/objectbox/objectbox-java/issues/793)
* Turn on incremental annotation processing by default. [GH#620](https://github.com/objectbox/objectbox-java/issues/620)

To use this release change the version of `objectbox-gradle-plugin` to `3.0.0-alpha1` and add a dependency on `objectbox-java` version `3.0.0-alpha1`.

```groovy
buildscript {
    dependencies {
        classpath "io.objectbox:objectbox-gradle-plugin:3.0.0-alpha1"
    }
}

dependencies {
    implementation "io.objectbox:objectbox-java:3.0.0-alpha1"
    // Artifacts with native code remain at 2.5.1.
    implementation "io.objectbox:objectbox-android:2.5.1"
}
```

The `objectbox-android`, `objectbox-linux`, `objectbox-macos` and `objectbox-windows` artifacts shipping native code remain at version 2.5.1 as there have been no changes. However, if your project explicitly depends on them they will pull in version 2.5.1 of `objectbox-java`. Make sure to add an explicit dependency on of `objectbox-java` version `3.0.0-alpha1` as mentioned above.

### **V2.5.1 - 2020/02/10**

* Support Android Gradle Plugin 3.6.0. [GH#817](https://github.com/objectbox/objectbox-java/issues/817)
* Support for incremental annotation processing. [GH#620](https://github.com/objectbox/objectbox-java/issues/620) It is off by default. To turn it on set  `objectbox.incremental` to `true` in `build.gradle` :

```groovy
android {
    defaultConfig {
        javaCompileOptions {
            annotationProcessorOptions {
                arguments = [ "objectbox.incremental" : "true" ]
            }
        }
    }
}
```

### **V2.5.0 - 2019/12/12**

#### Important bug fix - please update asap if you are using N:M relations!

* Fixed corner case for N:M ToMany (not the backlinks for ToOne) returning wrong results

#### Improvements and New Features

* Property queries compute sums and averages more precisely (improved algorithms and wider internal types)
* Query adds "describe" methods to obtain useful debugging information
* New method removeAllObjects() in BoxStore to clear the database of all data

### **V2.4.1 - 2019/10/29**

* More helpful error messages if annotations can not be combined.
* Improved documentation on various annotations.

### **V2.4.0 - 2019/10/15**

#### **Upgrade Notes**

* Android: the AAR libraries ship Java 8 bytecode. Your app will not build unless you upgrade com.android.tools.build:gradle to 3.2.1 or later.
* Android: the [ObjectBox LiveData](android/livedata-architecture-components.md) and [Paging integration](android/paging-architecture-components.md) migrated from Android Support Libraries to Jetpack (AndroidX) Libraries. If you are using them the library will not work unless you make the following changes in your app:
  * Upgrade com.android.tools.build:gradle to 3.2.1 or later.
  * Upgrade compileSdkVersion to 28 or later.
  * Update your app to use Jetpack (AndroidX); follow the instructions in [Migrating to AndroidX](https://developer.android.com/jetpack/androidx/migrate).
* Note: this version requires backwards-incompatible changes to the generated MyObjectBox file. Make sure to rebuild your project before running your app so the MyObjectBox file is re-generated.

#### Improvements & Fixes

V2.4.0 - 2019/10/15

* Class transformation works correctly if absolute path contains special characters. [GH#135](https://github.com/objectbox/objectbox-java/issues/135)

V2.4.0-RC - Release Candidate 2019/10/03

* Box: add `getRelationEntities`, `getRelationBacklinkEntities`,`getRelationIds` and `getRelationBacklinkIds` to directly access relations without going through ToMany.
* Box: add `putBatched` to put entities using a separate transaction for each batch.
* `Box.removeByKeys()` is now deprecated; use `removeByIds()` instead.
* Query: fixed performance regressions introduced in version 2.3 on 32 bit devices in combination with ordered results
* Fixed removing a relation and the related entity class. [GH#490](https://github.com/objectbox/objectbox-java/issues/490)
* Resolved issue to enable query conditions on the target ID property of a ToOne relation. [GH#537](https://github.com/objectbox/objectbox-java/issues/537)
* Box.getAll always returns a mutable list. [GH#685](https://github.com/objectbox/objectbox-java/pull/685)
* Do not overwrite existing objectbox-java or objectbox-kotlin dependency. [GH#693](https://github.com/objectbox/objectbox-java/issues/693)
* Resolved a corner case build time crash when parsing package elements. [GH#698](https://github.com/objectbox/objectbox-java/issues/698)
* When trying to find an appropriate get-method for a property, also check if the return type matches the property type. [GH#720](https://github.com/objectbox/objectbox-java/issues/720)
* Explicitly display an error if two entities with the same name are detected. [GH#744](https://github.com/objectbox/objectbox-java/issues/744)
* The code in MyObjectBox is split up by entity to make it less likely to run into the Java method size limit when using many @Entity classes. [GH#750](https://github.com/objectbox/objectbox-java/issues/750)
* Query: improved performance for ordered results with a limit. [GH#769](https://github.com/objectbox/objectbox-java/issues/769)
* Query: throw if a filter is used incorrectly with count or remove. [GH#771](https://github.com/objectbox/objectbox-java/issues/771)
* Documentation and internal improvements.

### **V2.3.4 - 2019/03/19** <a href="#v-2-2-2018-09-27" id="v-2-2-2018-09-27"></a>

* Avoid UnsatisfiedLinkError on Android devices that are not identifying as Android correctly
* Fix displaying large objects in Object Browser 32 bit
* Kotlin properties starting with "is" of any type are detected
* Add `objectbox-kotlin` to dependencies if `kotlin-android` plugin is applied (previously only for `kotlin` plugin)&#x20;
* @BaseEntity classes can be generic

### **V2.3.3 - 2019/02/14** <a href="#v-2-2-2018-09-27" id="v-2-2-2018-09-27"></a>

* Fixed a bug introduced by V2.3.2 affecting older Android versions 4.3 and below

### **V2.3.2 - 2019/02/04** <a href="#v-2-2-2018-09-27" id="v-2-2-2018-09-27"></a>

* Potential work around for UnsatisfiedLinkError probably caused by installation errors mostly in alternative app markets
* Support for Android Gradle Plugin 3.3.0: resolves deprecated API usage warnings.

### **V2.3.1 - 2019/01/08** <a href="#v-2-2-2018-09-27" id="v-2-2-2018-09-27"></a>

* Fixed a corner case for Box.getAll() after removeAll() to return a stale object if no objects are stored

### **V2.3 - 2018/12/30** <a href="#v-2-2-2018-09-27" id="v-2-2-2018-09-27"></a>

#### Improvements & Fixes

* Query improvements: findIds and LazyList also consider the order; offset and limit for findIds&#x20;
* Improved 32 bit support: Windows 32 version officially deployed, fixed a corner case crash
* Property queries for a boolean property now allow sum()
* Added Box.isEmpty()
* Supporting older Linux distributions (now starting  at e.g. Ubuntu 16.04 instead of 18.04)
* Fix for a corner case with Box.count() when using a maximum
* Minor improvements to the ObjectBox code generator
* Android: set extractNativeLibs to false to avoid issues with extracting the native library

### **V2.2 - 2018/09/27**

**Improvements & Fixes**

* _Fix:_ the unique check for string properties had false positives resulting in UniqueViolationException. This occurs only in combination with IndexType.HASH (the default) when hashes actually collide. We advise to update immediately to the newest version if you are using hashed indexes.
*   The release of new [ObjectBox C API](https://github.com/objectbox/objectbox-c) made us change name of the JNI library

    for better distinction. This should not affect you unless you depended on that (internal) name.
* Improved compatibility with class transformers like Jacoco
* Fixed query links for M:N backlinks
* Improved error messages for the build tools
* The Object Browser AAR now includes the required Android permissions

### **V2.1 - 2018/08/16**

#### Minor Improvements & Fixes

* Entity counts are now cached for better performance
* Deprecated aggregate function were removed (deprecation in 1.4 with introduction of PropertyQuery)
* Object browser hot fix: the hashed indexes introduced in 2.0 broke the object browser
* Object browser fixes: filters with long ints, improved performance in the schema view
* NPE fix in ToOne
* Added a specific NonUniqueResultException if a query did not return an expected unique result

### **V2.0 - 2018/07/25**

#### New Features/Improvements

ObjectBox 2.0 introduces [index types](entity-annotations.md#index-types-string) for String. Before, every index used the property **value** for all look-ups. Now, ObjectBox can also use a **hash** to build an index. Because `String` properties are typically taking more space than scalar values, ObjectBox **switched the default index type to hash for strings.**

**When migrating data from pre-2.0 ObjectBox versions**, for String properties with a plain @Index annotation this will update the indexes automatically: the old value-based indexes will be deleted and the new hash-bashed indexes will be built.

A side effect of this is that the database file might grow in the process. If you want to prevent this, you can instruct ObjectBox to keep using a value-based index for a `String` property by specifying the index `type` using `@Index(type = IndexType.VALUE)`.

Other changes:

* Links and relation completeness and other features already announced in the 2.0 beta
* Unique constraint for properties via [@Unique annotation](entity-annotations.md#unique-constraints)
* Support for char type (16 bit)
* [RX lib](data-observers-and-rx.md#objectbox-rxjava-extension-library) deployed in JCenter
* Rework of Query APIs: type safe properties (property now knows its owning entity)
* Allow query conditions of links using properties (without parameter alias)
* Query performance improvements when using order
* [Property based count](queries.md#aggregating-values): query for non-null or unique occurrences of entity properties (non-null and unique)&#x20;
* Additional query conditions for strings: "greater than", "less than", "in"
* Added query conditions for byte arrays
* Set query parameters for "in" condition (int\[] and long\[])

### **V2.0 beta** – 2018/06/26

#### New Features/Improvements

* Query across relation bounds [using links](queries.md#add-query-conditions-for-related-entities-links) (aka "join"): queries just got much more powerful. For example, query for orders that have a customer with an address on "Sesame Street". Or all persons, who have a grand parent called "Alice".
* [Backlinks for to-many relations](relations.md#access-many-to-many-in-the-reverse-direction): now ObjectBox is "relation complete" with a bi-directional many-to-many relation.
* Query performance improvements: getting min/max values of indexed properties in constant time
* Android: added [Paging library support](android/paging-architecture-components.md) (architecture components)
* [Kotlin extensions](kotlin-support.md#using-the-provided-extension-functions): more Kotlin fun with ObjectBox KTX
* [Query parameters aliases](queries.md#reusing-queries-and-parameters): helps setting query parameters in complex scenarios (e.g. for properties of linked entities)
* Improved query parameter verification
* Many internal improvements to keep us going fast in the future

### **V1.5.0** – 2018/04/17

#### New Features/Improvements

* Full support for [Android local tests](android/android-local-unit-tests.md): use full ObjectBox features in local tests
* New count method optimized for a given maximum count
* Gradle option to [define the package for MyObjectBox](advanced/advanced-setup.md#change-the-myobjectbox-package) explicitly
* Query condition startsWith now uses index if available for better performance

#### Fixes

* Fixed some static methods in BoxStore to ensure that the native lib is loaded
* Internal optimizations for 64 bit devices
* Some fixes for entities in the default package
* Entity can be named `Property`, no longer conflicts with ObjectBox Property class
* Property queries for strings crashed on some Android devices if there were more than 512 results
* Object Browser uses less threads
* Object Browser now displays negative int/long values correctly
* Changes to relations object in constructors were overwritten when constructors delegated to other constructors

### **V1.4.4** – 2018/03/08

#### New Features/Improvements

* Supply an initial database file using BoxStoreBuilder
* Gradle plugin detects [plain Java projects](java-desktop-apps.md#objectbox-embedded-database-for-java-desktop-apps) and configures dependencies
* Improved Box.removeAll() performance for entities that have indexes or relations

#### Fixes

* Fixed converting from arrays in entities
* Fixed @NameInDb
* Fixed Gradle “androidTestCompile is obsolete” warning

### **V1.4.3** – 2018/03/01

#### New Features

* macOS support: with Linux, Windows, and macOS, ObjectBox now supports all major desktop/server platforms. Use it for local unit tests or standalone Java applications.

#### Fixes

* Fixed BoxStore.close being stuck in rare scenarios
* Fixed an issue with char properties in entities

### **V1.4.2** – 2018/02/25

**Note: This release requires the** [**Android Gradle Plugin 3.0.0**](https://developer.android.com/studio/releases/gradle-plugin.html#3-0-0) **or higher.**

#### Improvements

* JCenter: we’ve moved the ObjectBox artifacts to the JCenter repository. This simplifies set up and improves accessibility (e.g. JCenter is not blocked from China).
* Instant App support (only with Android Gradle Plugin 3.0.0 or higher)

### **V1.4.1** – 2018/01/23

#### Improvements

* Added DbExceptionListener as a central place to listen for DB related exceptions
* Minor improvements for ToMany and generated Cursor classes

#### Fixes

* ToMany: fixed handling of duplicate entries (e.g. fixes swap and reverse operations)
* ToMany: fixed removal of non-persisted element for standalone relations

### **V1.4.0** – 2018/01/11

#### New Features

* Property queries that return individual properties only (including distinct values, unique, null values, primitive result arrays or scalars)
* Entity inheritance (non-polymorphic)
* 50% size reduction of native libraries

### **V1.3.4** – 2017/12/07

#### Improvements

* ToOne now implements equals() and hashCode() based on the targetId property
* Android ABI x86\_64 was added to the aar

#### Fixes

* ID verification does not complain about “resurrected” objects that were loaded, removed, and put again
* Fixed setting Query parameters for Date type
* Fixes for ObjectBox browser

### **V1.3.3 (1.3.x)** – 2017/12/04

Please update to the latest version. We made important changes and fixes under the hood to make ObjectBox perform better, generally, and especially in concurrent scenarios. In addition, 1.3.x comes with several improvements for developers.

#### Improvements

* [Flag for query parameter logging](http://objectbox.io/files/objectbox-java/current/io/objectbox/DebugFlags.html)
* Object browser lets you download all entities as JSON
* Object browser efficiency improvements: introduced streamed processing to reduce memory consumption and increase performance for large data sets
* Improved transaction logging, e.g. numbered transactions and waiting times for write transactions
* Closing the store (e.g. for tests, an app should just leave it open) will wait for any ongoing write transaction to finish
* Two additional [overloads for static BoxStore.deleteAllFiles()](http://objectbox.io/files/objectbox-java/current/io/objectbox/BoxStore.html#deleteAllFiles-java.io.File-)
* Added automatic retries for read transactions; also configurable for queries

#### Fixes

* Fixes for concurrent setups (multi threaded, in live apps with up to 100 threads); internally we improved our testing automation and CI infrastructure significantly
* Fix for sumDouble throwing an exception
* Fixed ProGuard rule for ToOne

### **V1.2.1** – 2017/11/10

#### Improvements

* Improved debug logging for transactions and queries: enable this using BoxStoreBuilder.debugFlags(…) with values from the [DebugFlags](http://objectbox.io/files/objectbox-java/current/io/objectbox/DebugFlags.html) class
* Improved package selection for MyObjectBox if you use entities in multiple packages (please check if you need to adjust your imports after the update)
* ObjectBox Browser’s UI is more compact and thus better usable on mobile devices

#### Fixes

* Fix for ObjectBoxLiveData firing twice

### **V1.2.0** – 2017/10/31

Compatibility note: We removed some Box.find methods, which were all tagged as @Temporary. Only the Property based ones remain (for now, also @Temporary).

#### New Features

* [ObjectBoxLiveData](android/livedata-architecture-components.md#objectbox-livedata-with-android-architecture-components): Implements LiveData from Android Architecture Components
* Object ID based methods for [ToMany](http://objectbox.io/files/objectbox-java/current/io/objectbox/relation/ToMany.html): getById, indexOfId, removeById
* More robust Android app directory detection that works around Android bugs
* Using the new official FlatBuffers Maven dependency (FlatBuffer is not anymore embedded in the artifact)
* UI improvements for ObjectBox browser
* Other minor improvements

#### Fixes

* Fixed query order by float and double
* Fixed an missing import if to-many relations referenced a entity in another package
* Other minor fixes

### **V1.1.0** – 2017/10/03

#### New Features

* Object Browser to view DB contents (Android)
* Plain Java support to run ObjectBox on Windows and Linux
* Added ToMany.hasA()/hasAll() to simplify query filters in Java
* Sort query result via Comparator
* Improved error messages on build errors
* Internal clean up, dropping legacy plugin

#### Fixes

* Annotation processor detects boolean getters starting with “is”
* Fixed a NPE with eager and findFirst() when there is no result

### **V1.0.1** – 2017/09/10

First bug fix release for [ObjectBox 1.0](http://objectbox.io/objectbox-1-0/).

#### New Features

* ToMany allows setting a Comparator to order the List (experimental)

#### Fixes

* Fix UID assignment process: use @Uid without value to see options (pin UID, reset/change)
* Fix relation code generation for entities in different packages
* Fix Kotlin extension functions in transformed (library) project
* Fix ToOne access if field is inaccessible (e.g. in Kotlin data classes if they are part of constructor – lateinit were OK)

### **V1.0.0** – 2017/09/04

ObjectBox is out of beta! See our [announcement blog post](http://objectbox.io/objectbox-1-0/) for details.

#### New Features

* Eager loading of relations via query builder
* Java filters as query post-processing
* Minor improvements like a new callInReadTx method and making Query.forEach breakable

#### Fixes

* Fixed two corner cases with queries

### V0.9.15 (beta) 2017/08/21 Hotfixes

#### Fixes

* Fixed: Android flavors in caused the model file (default.json) to be written into the wrong folder (inside the build folder) causing the build to fail
* Fixed: failed builds if entity constructor parameters are of specific types

### V0.9.14 (beta) 2017/08/14 Standalone relations, new build tools

For upgrade notes, please check the [announcement post](http://objectbox.io/objectbox-db-0-9-14/).

#### New Features

* No more in-place code generation: Java source code is all yours now. This is based on the new build tool chain introduced in 0.9.13. Thus Kotlin and Java share the same build system. The old Java-based plugin is still available (plugin ID “io.objectbox.legacy”) in this version.
* “Standalone” to-many relations (without backing to-one properties/relations)
* Gradle plugin tries to automatically add runtime dependencies (also (k)apt, but this does not always work!?)
* Improved error reporting

#### Fixes

* Fixed the issue causing a “Illegal state: Tx destroyed/inactive, writeable cursor still available” error log

### V0.9.13 (beta) 2017/07/12 Kotlin Support

#### New Features

* Kotlin support (based on a new annotation processor)
* Started “object-kotlin”, a sub-project for Kotlin extensions (tiny yet, let us know your ideas!)
* BoxStoreBuilder: added maxReaders configuration
* Get multiple entities by their IDs via Box methods (see get/getMap(Iterable))
* ToOne and ToMany are now serializable (which does not imply serializing is a good idea)
* ObjectBox may now opt to construct entities using the no-args constructor if the all-args constructor is absent
* Prevents opening two BoxStores for the same DB file, which may have side effects that are hard to debug
* Various minor and internal improvements and fixes

#### Fixes

* Fixed ToOne without an explicit target ID property
* Fixed type check of properties to allow ToMany (instead of List)
* Fixed @Convert in combination with List
* Fixed a race condition with cursor deletion when Java’s finalizer kicked in potentially resulting in a SIGSEGV
* Fixed a leak with potentially occurring with indexes

### V0.9.12 (beta) 2017/05/08 ToMany class

* **Update 2017/05/19:** We just released 0.9.12.1 for the Gradle plugin (only), which fixes two problems with parsing of to-many relations.
* Added the new list type ToMany which represents a to-many relation. A ToMany object will be automatically assigned to List types in the entity, eliminating a lot of generated code in the entity.
* ToMany comes with change tracking: all changes (add/remove) are automatically applied to the DB when its hosting entity is persisted via put(). Thus, the list content is synced to the DB, e.g. their relationship status is updated and new entities are put.
* Streamlined annotations (breaking API changes):\
  @Generated(hash = 123) becomes @Generated(123),\
  @Property was removed,\
  @NameInDb replaces attributes in @Entity and the former @Property,\
  Backlinking to-many relations require @Backlink (only),\
  @Relation is now only used for to-one relations (and is subject to change in the next version)

### V0.9.11 (beta) 2017/04/25: Various improvements

* Smarter to-one relations: if you put a new object that also has a new to-one relation object, the latter will also be put automatically.
* Getters and setters for properties are now only generated if no direct field access is possible
* JSR-305 annotations (@Nullable and others) to help the IDE find problems in your code
* @Uid(-1) will reassign IDs to simplify some migrations (docs will follow soon)
* No more getter for ToOne objects in favor of direct field access
* Quite a few internal improvements (evolved EntityInfo meta info object, etc.)

### V0.9.10 (beta) 2017/04/10: Bug Fixes and minor improvements

#### New features and improvements

* Breaking API: Replaced “uid” attribute of @Entity and @Property with @Uid annotation
* An empty @Uid will retrieve the current UID automatically
* Some minor efficency improvements for read transactions
* Better DB resources clean up for internal thread pool

#### Bug fixes

* Better compatibility with Android Gradle plugin
* Fixes for multithreaded reads of relation and index data
* Fixed compilation error in generated sources for Entities without non-ID properties

### V0.9.9 (beta) 2017/03/07: Bug Fixes

#### New features

* Query.forEach() to iterate efficiently over query result objects

#### Bug fixes

* Various bug fixes

### V0.9.8 (beta) 2017/02/22: Going Reactive

#### New features

* Data observers with reactive extensions for transformations, thread scheduling, etc.
* Optional RxJava 2 library
* OR conditions for QueryBuilder allow more powerful queries

#### Bug fixes

* Fixed: Changing the order of an entity’s properties could cause errors in some cases
* Fixed: Querying using relation IDs

### V0.9.7 (beta) 2017/02/10

#### New features

* LazyList returned by Query: another query option to defer getting actual objects until actually accessing them. This enables memory efficient iterations over large results. Also minimizes the time for a query to return. Note: LazyList cannot be combined with order specifications just yet.
* QueryBuilder and Query now support Date and boolean types directly
* QueryBuilder supports now a notIn opperator
* put() now uses entity fields directly unless they are private (can be more efficient than calling getters)

#### Breaking internal changes

At this early point in the beta we decided to break backward compatibility. This allowed us to make important improvements without worrying about rather complex migrations of previous versions. We believe this was a special situation and future versions will likely be backward compatible although we cannot make promises. If you intend to publish an app with ObjectBox it’s a good idea to contact us before.

* The internal data format was optimized to store data more compact. Previous database files are not compatible and should be deleted.
* We improved some details how IDs are used in the meta model. This affects the model file, which is stored in your project directory (objectbox-models/default.json). Files created by previous versions should be deleted.

### V0.9.6 (first public beta release) 2017/01/24

See [ObjectBox Announcement](http://greenrobot.org/announcement/introducing-objectbox-beta/)
