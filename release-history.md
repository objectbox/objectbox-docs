---
description: Release notes for ObjectBox 1.5.0 and older.
---

# Java Release History (<= v1.5)

### **V2.0 and later: check the** [**changelog on the homepage**](./#objectbox-changelog)

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
