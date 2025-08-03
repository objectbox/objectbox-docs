---
description: How to rename entities and properties, change property types in ObjectBox.
---

# Data Model Updates

## ObjectBox - Data Model Updates

ObjectBox manages its data model (schema) mostly automatically. The data model is defined by the entity classes you define. When you **add or remove** entities or properties of your entities, **ObjectBox takes care** of those changes without any further action from you.

For other changes like **renaming or changing the type**, ObjectBox needs **extra information** to make things unambiguous. This is done by setting a unique ID (UIDs) as an annotation, as we will see below.

## UIDs

ObjectBox keeps track of entities and properties by assigning them unique IDs (UIDs). All those UIDs are stored in a file `objectbox-models/default.json` (Java, Kotlin) or `lib/objectbox-model.json` (Dart) which you should add to your version control system (e.g. git). If you are interested, we have [in-depth documentation on UIDs and concepts](meta-model-ids-and-uids.md). But let’s continue with how to rename entities or properties.

**In short:** To make UID-related changes, put an  `@Uid` annotation (Java, Kotlin) or `@Entity(uid: 0)/@Property(uid: 0)` (Dart) on the entity or property and build the project to get further instructions. Repeat for each entity or property to change.

## Renaming Entities and Properties

So why do we need that UID annotation? If you simply rename an entity class, ObjectBox only sees that the old entity is gone and a new entity is available. This can be interpreted in two ways:

* The old entity is removed and a new entity should be added, the old data is discarded. This is the **default behavior** of ObjectBox.
* The entity was renamed, the old data should be re-used.

So to tell ObjectBox to do a rename instead of discarding your old entity and data, you need to make sure it knows that this is the same entity and not a new one. You do that by attaching the internal UID to the entity.

The same is true for properties.

Now let’s walk through how to do that. The process works the same if you want to rename a property:

### How-to and Example (Java/Kotlin and Dart)

**Step 1:** Add an empty  UID to the entity/property you want to rename:

{% tabs %}
{% tab title="Java/Kotlin" %}
```java
@Entity
@Uid
public class MyName { ... }
```
{% endtab %}

{% tab title="Dart" %}
```dart
@Entity(uid: 0)
class MyName { ... }
```
{% endtab %}
{% endtabs %}

**Step 2:** Build the project (in Dart, run `pub run build_runner build`). The build will fail with an error message that gives you the current UID of the entity/property:

{% tabs %}
{% tab title="Java/Kotlin" %}
```
error: [ObjectBox] UID operations for entity "MyName": 
  [Rename] apply the current UID using @Uid(6645479796472661392L) -
  [Change/reset] apply a new UID using @Uid(4385203238808477712L)
```
{% endtab %}

{% tab title="Dart" %}
```
@Entity(uid: 0) found on "MyName" - you can choose one of the following actions:
    [Rename] apply the current UID using @Entity(uid: 6645479796472661392)
    [Change/reset] apply a new UID using @Entity(uid: 4385203238808477712)
```
{% endtab %}
{% endtabs %}

**Step 3:** Apply the UID from the \[Rename] section of the error message to your entity/property:

{% tabs %}
{% tab title="Java/Kotlin" %}
```java
@Entity
@Uid(6645479796472661392L)
public class MyName { ... }
```
{% endtab %}

{% tab title="Dart" %}
```dart
@Entity(uid: 6645479796472661392)
class MyName { ... }
```
{% endtab %}
{% endtabs %}

**Step 4:** The last thing to do is the actual rename on the language level (Java, Kotlin, etc.):

{% tabs %}
{% tab title="Java/Kotlin" %}
```java
@Entity
@Uid(6645479796472661392L)
public class MyNewName { ... }
```
{% endtab %}

{% tab title="Dart" %}
```dart
@Entity(uid: 6645479796472661392)
class MyNewName { ... }
```
{% endtab %}
{% endtabs %}

**Step 5:** Build the project again, it should now succeed. You can now use your renamed entity/property as expected and all existing data will still be there.

**Repeat** the steps above to rename another entity or property.

{% hint style="info" %}
Note: Instead of the above you can also find the UID of the entity/property in the model JSON mentioned in the introduction. You can add the UID value to the annotation yourself, before renaming the entity/property, and skip the intermediate error where ObjectBox just prints it for you. This can be **faster when renaming multiple properties**.
{% endhint %}

### How-to and Example (Python)

Since in Python there isn't a build step, the steps for renaming an Entity are different. Say we want to rename the Entity `MyName` to `MyNewName`:

```python
@Entity()
class MyName:
    id = Id
    some_property = Int
```

**Step 1**: Find out the UID of the entity `MyName`:

<pre class="language-python"><code class="lang-python"><strong>print(MyName._uid)
</strong># 6645479796472661392
</code></pre>

**Step 2**: Rename `MyName` to `MyNewName` and explicitly specify the old UID:

```python
@Entity(uid=6645479796472661392)
class MyNewName:
    id = Id
    some_property = Int
```

This makes possible for Objectbox to associate the old entity to the new one, and retain persisted data. If you don't specify the old UID, Objectbox will discard the old data and add a fresh new entity called `MyNameName` to the schema.

## Changing Property Types

{% hint style="warning" %}
ObjectBox does not support migrating existing property data to a new type. You will have to take care of this yourself, e.g. by keeping the old property and adding some migration logic.
{% endhint %}

There are two solutions to changing the type of a property:

* Add a new property with a different name (this only works if the property has no @Uid annotation already):

```java
// old:
String year;
// new:
int yearInt;
```

* Set a new UID for the property so ObjectBox treats it as a new property. Let’s walk through how to do that:

### How-to and Example

**Step 1:** Add the  `@Uid` annotation to the property where you want to change the type:

{% tabs %}
{% tab title="Java/Kotlin" %}
```java
@Uid
String year;
```
{% endtab %}

{% tab title="Dart" %}
```dart
@Property(uid: 0)
String year;
```
{% endtab %}
{% endtabs %}

**Step 2:** Build the project. The build will fail with an error message that gives you a newly created UID value:

{% tabs %}
{% tab title="Java/Kotlin" %}
```
error: [ObjectBox] UID operations for property "MyEntity.year": 
  [Rename] apply the current UID using @Uid(6707341922395832766L) -
  [Change/reset] apply a new UID using @Uid(9204131405652381067L)
```
{% endtab %}

{% tab title="Dart" %}
```
@Property(uid: 0) found on "year" - you can choose one of the following actions:
    [Rename] apply the current UID using @Property(uid: 6707341922395832766)
    [Change/reset] apply a new UID using @Property(uid: 9204131405652381067)
```
{% endtab %}
{% endtabs %}

**Step 3:** Apply the UID from the \[Change/reset] section to your property:

{% tabs %}
{% tab title="Java/Kotlin" %}
```java
@Uid(9204131405652381067L)
int year;
```
{% endtab %}

{% tab title="Dart" %}
```dart
@Property(uid: 9204131405652381067)
String year;
```
{% endtab %}
{% endtabs %}

**Step 4:** Build the project again, it should now succeed. You can now use the property in your entity as if it were a new one.

**Repeat** the steps above to change the type of another property.
