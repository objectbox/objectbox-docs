---
description: >-
  ObjectBox fully supports Kotlin for Android. Learn what to look out for when
  using ObjectBox with Kotlin, how to use the built-in Kotlin extension
  functions.
---

# Kotlin Support

## ObjectBox and Kotlin

ObjectBox comes with full Kotlin support for Android. This allows entities to be modeled in Kotlin classes (regular and data classes). With Kotlin support you can build faster apps even faster.

{% hint style="info" %}
This page assumes that you have added ObjectBox to your project and that you are familiar with basic functionality. The Getting Started page will help you out if you are not. This page discusses additional capabilities for Kotlin only.
{% endhint %}

{% content-ref url="getting-started.md" %}
[getting-started.md](getting-started.md)
{% endcontent-ref %}

## Kotlin Entities

ObjectBox supports **regular and data classes for entities**. However, **`@Id` properties must be var** (not val) because ObjectBox assigns the ID after putting a new entity. They also should be of non-null type `Long` with the special value of zero for marking entities as new.

Can **sealed classes** be entities? Not directly. [Sealed classes](https://kotlinlang.org/docs/reference/sealed-classes.html) are abstract and can't be instantiated. But subclasses of a sealed class should work.

To learn how to create entities, look at these pages:

{% content-ref url="getting-started.md" %}
[getting-started.md](getting-started.md)
{% endcontent-ref %}

{% content-ref url="entity-annotations.md" %}
[entity-annotations.md](entity-annotations.md)
{% endcontent-ref %}

## Defining Relations in Kotlin Entities

When [defining relations](relations.md) in Kotlin, keep in mind that **relation properties must be `var`**. Otherwise they can not be initialized as described in the [relations docs](relations.md#initialization-magic). To avoid null checks use a lateinit modifier. When using a data class this requires the relation property to be moved to the body.

{% hint style="warning" %}
For non-Android projects, i.e. if you are using Kotlin for desktop apps, there's an additional setup for for entities necessary, please see [https://docs.objectbox.io/relations#initialization-magic](https://docs.objectbox.io/relations#initialization-magic) for details. In the future, we hope to eliminate this requirement.
{% endhint %}

See the Relations page for examples.

{% content-ref url="relations.md" %}
[relations.md](relations.md)
{% endcontent-ref %}

{% hint style="info" %}
Two data classes that have the same property values (excluding those defined in the class body) [are equal and have the same hash code](https://kotlinlang.org/docs/reference/data-classes.html). Keep this in mind when working with ToMany which uses a HashMap to keep track of changes. E.g. adding the same data class multiple times has no effect, it is treated as the same entity.
{% endhint %}

## Using the provided extension functions

To simplify your code, you might want to use the Kotlin extension functions provided by ObjectBox. The library containing them is added automatically if the Gradle plugin detects a Kotlin project.

To add it manually, modify the dependencies section in your app's `build.gradle` file:

```java
dependencies {
    implementation("io.objectbox:objectbox-kotlin:$objectboxVersion")
}
```

Now have a look at what is possible with the extensions compared to standard Kotlin idioms:

Get a box:

```kotlin
// Regular:
val box = store.boxFor(DataClassEntity::class.java)

// With extension:
val box: Box<DataClassEntity> = store.boxFor()
```

### Queries

{% hint style="info" %}
The [new Query API](queries.md#new-query-api-java-kotlin-3.0) makes below extensions functions unnecessary.
{% endhint %}

Build a query:

```kotlin
// Regular:
val query = box.query().run {
    equal(property, value)
    order(property)
    build()
}

// With extension:
val query = box.query {
    equal(property, value)
    order(property)
}
```

Use the in filter of a query:

```kotlin
// Regular:
val query = box.query().`in`(property, array).build()

// With extension:
val query = box.query().inValues(property, array).build()
```

### Relations

Modify a [ToMany](relations.md#to-many-relations):

```kotlin
// Regular:
toMany.apply { 
    reset()
    add(entity)
    removeById(id)
    applyChangesToDb()
}

// With extension:
toMany.applyChangesToDb(resetFirst = true) { // default is false
    add(entity)
    removeById(id)
}
```

### Flow

Get a Flow from a Box or Query subscription (behind the scenes this is based on a [Data Observer](data-observers-and-rx.md)):

```kotlin
// Listen to all changes to a Box
val flow = store.subscribe(TestEntity::class.java).toFlow()
// Get the latest query results on any changes to a Box
val flow = box.query().subscribe().toFlow()
```



Something missing? [Let us know](https://github.com/objectbox/objectbox-java/issues/446) what other extension functions you want us to add.

## Coroutines

To run Box operations on a separate Dispatcher wrap them using `withContext`:

```kotlin
suspend fun putNote(
    note: Note, 
    dispatcher: CoroutineDispatcher
) = withContext(dispatcher) {
    boxStore.boxFor(Note::class.java).put(note)
}
```

BoxStore provides an async API to run transactions. There is an extension function available that wraps it in a coroutine:

```kotlin
// Calls callInTxAsync behind the scenes.
val id = boxStore.awaitCallInTx {
    box.put(Note("Hello", 1))
}
```

## Next Steps

* Check out the [Kotlin example on GitHub](https://github.com/objectbox/objectbox-examples/tree/master/android-app-kotlin).
* Continue with [Getting Started](getting-started.md).
