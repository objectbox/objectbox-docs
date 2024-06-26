---
description: Explanation of Object IDs and how they are used and assigned in ObjectBox.
---

# Object IDs

## ObjectBox - Object IDs

**Objects must have an ID property of type `long`.** You are free to use the wrapper type `java.lang.Long`, but we advise against it in most cases. `long` IDs are enforced to make ObjectBox very efficient internally.

If your application requires other ID types (such as a string UID given by a server), you can model them as standard properties and use [queries](../queries.md) to look up entities by your application-specific ID.

## Object ID: new vs. persisted entities

When you create new entity objects (on the language level), they are not persisted yet and their ID is (zero). Once an entity is put (persisted), ObjectBox will assign an ID to the entity. You can access the ID property right after the call to `put()`.

Those are also applied the other way round: ObjectBox uses the **ID as a state indication** of whether an entity is new (zero) or already persisted (non-zero). This is used internally, e.g. for relations that heavily rely on IDs.

## Special Object IDs

Object IDs may be any `long` value, with two exceptions:

* **0 (zero):** Objects with an ID of zero (and `null` if the ID is of type `Long`) are considered new (not persisted before). Putting such an object will always insert a new object and assign an unused ID to it.
* **0xFFFFFFFFFFFFFFFF (-1 in Java):** This value is reserved for internal use by ObjectBox and may not be used by the app.

## Object ID assignment (default)

By default, object IDs are assigned by ObjectBox. For each new object, ObjectBox will assign an unused ID that is above the current highest ID value used in a box. For example, if there are two objects with ID 1 and ID 100 in a box the next object that is put will be assigned ID 101.

Also, note that this will mean in some circumstances IDs from deleted objects may be reused. So it is best to not rely on a specific ID getting assigned.

**By default, only ObjectBox may assign IDs.** If you try to put an object with an ID greater than the currently highest ID, ObjectBox will throw an error.

## Self-assigned Object IDs

{% hint style="info" %}
This is not recommended. Check if using a [unique indexed property](../entity-annotations.md#object-ids-id) is a viable alternative.
{% endhint %}

If your code **needs to assign IDs by itself** you can change the `@Id` annotation to:

{% tabs %}
{% tab title="Java" %}
```java
@Id(assignable = true)
long id;
```
{% endtab %}

{% tab title="Dart" %}
```dart
@Id(assignable: true)
int id = 0;
```
{% endtab %}
{% endtabs %}

This will allow putting an entity with any valid ID (see [#special-object-ids](object-ids.md#special-object-ids "mention")). If the `@Id` field is writable, it can still be set to zero to let ObjectBox auto-assign a new ID.

{% hint style="warning" %}
**Warning:** self-assigned IDs break automatic state detection (new vs. persisted entity based on the ID). Therefore, you should **put entities with self-assigned IDs immediately and may have to attach the box manually**, especially when working with relations.

For details see the documentation about [updating relations](../relations.md#updating-relations).
{% endhint %}

## String ID alias (future work)

&#x20;Check [this issue](https://github.com/objectbox/objectbox-java/issues/167) on Github for status.
