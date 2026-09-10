---
description: >-
  ObjectBox supports a variety of data types inside the stored objects including
  various list types and even special "flex" types for dynamic and schema-less
  data.
---

# Property Types

ObjectBox stores data as objects, which are instances of entity classes you define. Objects consist of properties, which are the individual fields that hold your data, like a user's name or age. This page covers the property types ObjectBox supports:

* **Standard types** for single values of a fixed type
* **List/Vector types** for collections of values of a fixed type
* **The flex type** for dynamic and schema-less data

## Standard Types

Standard types include boolean, integers, floating point types, string, and date types. These are the most common types you will use in typical applications.

### Quick Reference

| Category         | ObjectBox Type | Stored as      |
| ---------------- | -------------- | -------------- |
| Boolean          | Bool           | 1 byte         |
| Integer (8-bit)  | Byte           | 1 byte         |
| Integer (16-bit) | Short          | 2 bytes        |
| Integer (32-bit) | Int            | 4 bytes        |
| Integer (64-bit) | Long           | 8 bytes        |
| To-One Relation  | Relation       | 8 bytes        |
| Float (32-bit)   | Float          | 4 bytes        |
| Float (64-bit)   | Double         | 8 bytes        |
| Text Character   | Char           | 2 bytes        |
| String           | String         | UTF-8 bytes    |
| Date (ms)        | Date           | 8 bytes (long) |
| Date (ns)        | DateNano       | 8 bytes (long) |

{% hint style="info" %}
**Nullable types:** All ObjectBox property types support null values. In Java, use wrapper classes (`Integer` vs `int`) for nullable types. In Kotlin, Dart, and Python, nullability is part of the type system.
{% endhint %}

### Integers

ObjectBox supports all standard integer types, from 8-bit to 64-bit. Rule of thumb: use large enough integer types that are safe for your use case in the future. Use smaller types only if you are certain about the range of values as you cannot change the type of an existing property later.

{% tabs %}
{% tab title="Java" %}
```java
@Entity
public class Sensor {
    @Id public long id;
    
    public byte status;        // -128 to 127
    public short temperature;  // -32,768 to 32,767  
    public int count;          // ~2 billion range
    public long timestamp;     // Large numbers, IDs
}
```
{% endtab %}

{% tab title="Kotlin" %}
```kotlin
@Entity
data class Sensor(
    @Id var id: Long = 0,
    var status: Byte = 0,
    var temperature: Short = 0,
    var count: Int = 0,
    var timestamp: Long = 0
)
```

Kotlin unsigned types (`UByte`, `UShort`, `UInt`, `ULong`) are also supported—they're stored as their signed equivalents.
{% endtab %}

{% tab title="Dart" %}
Note: Dart just has `int` and does not differentiate between the integer types. You can still use ObjectBox types to pick the storage type and align with other languages (e.g. when using Sync).

```dart
@Entity()
class Sensor {
  @Id()
  int id = 0;
  
  @Property(type: PropertyType.byte)
  int status = 0;  // 8-bit
  
  @Property(type: PropertyType.short)
  int temperature = 0;  // 16-bit
  
  @Property(type: PropertyType.int)
  int count = 0;  // 32-bit
  
  int timestamp = 0;  // 64-bit (default)
}
```
{% endtab %}

{% tab title="Python" %}
```python
@Entity()
class Sensor:
    id = Id
    status = Int8
    temperature = Int16
    count = Int32
    timestamp = Int64
```
{% endtab %}
{% endtabs %}

### Floating Point

Choose 32-bit floats for memory efficiency when \~7 digits of precision is enough. Use 64-bit doubles when you need \~15 digits.

{% tabs %}
{% tab title="Java" %}
```java
public float score;      // 32-bit, ~7 significant digits
public double precise;   // 64-bit, ~15 significant digits
```
{% endtab %}

{% tab title="Dart" %}
```dart
@Property(type: PropertyType.float)
double score = 0;  // stored as 32-bit

double precise = 0;  // 64-bit (default)
```
{% endtab %}
{% endtabs %}

### Strings

Strings are stored as UTF-8 encoded bytes without a length limit.

```java
public String name;
public String description;  // Can be very long
```

### Dates and Times

ObjectBox stores dates as 64-bit integers ("timestamps") representing time since the Unix epoch (January 1, 1970, 00:00:00 UTC). Choose your precision:

| Precision    | ObjectBox Type     | Use case                  |
| ------------ | ------------------ | ------------------------- |
| Milliseconds | Date (the default) | Most applications         |
| Nanoseconds  | DateNano           | High-precision timestamps |

Note: while DateNano values are always stored as nanoseconds, the actual precision of the values depends on the platform and programming language. For example, Dart uses only microsecond precision (the last three digits of the nanosecond are "truncated").

{% tabs %}
{% tab title="Java" %}
```java
// Millisecond precision (default)
public Date createdAt;

// Nanosecond precision
@Type(DatabaseType.DateNano)
public long preciseTimestamp;
```
{% endtab %}

{% tab title="Dart" %}
```dart
// Millisecond precision (default), inits a local-time DateTime
@Property(type: PropertyType.date)
DateTime? createdAt;

// Same stored value, inits UTC DateTime (isUtc == true)
@Property(type: PropertyType.dateUtc)
DateTime? createdAtUtc;

// Stored with nanosecond precision; however,
// Dart uses only microsecond precision!
@Property(type: PropertyType.dateNanoUtc)
DateTime? preciseTimestamp;
```

{% hint style="info" %}
All date types store as UTC timestamps in ObjectBox.
What differs is the Dart side: `date` and `dateNano` use a local-time `DateTime`,
while `dateUtc` and `dateNanoUtc` (ObjectBox 5.1 and later) return a UTC one.
A `DateTime` field without an annotation defaults to `date`,
but since 5.1 the generator warns about it, so state the type explicitly.

On a similar note: Dart's `==` on `DateTime` also compares the time zone flag,
so a local `DateTime` stored via `dateUtc` is not equal to the value read back, although both mark the same instant.
Use `isAtSameMomentAs` where that matters, and note that the millisecond types drop microseconds.
{% endhint %}
{% endtab %}
{% endtabs %}

### IDs and Relations

Every ObjectBox entity must have exactly one **ID property** of type Long (64-bit integer). See [Entity Annotations](entity-annotations.md#object-ids-id) for details.

**"Relation"** is used for one of two relation types available in ObjectBox. It's a 64-bit integer that references the ID of another object. Depending on the programming language you use, it may translate to a "to-one" construct. See [Relations](relations.md) for complete documentation.

## Lists and Arrays

Store collections of values directly; no special tables or joins required. The internal type names are "vectors", but they may translate to lists or arrays in the programming language you use.

{% hint style="info" %}
**Binary data** is stored as a `ByteVector`. In other databases, this is may be called a "BLOB" (Binary Large Object).
{% endhint %}

### Quick Reference

| ObjectBox Type | Description                                       |
| -------------- | ------------------------------------------------- |
| BoolVector     | Bool values (stored using one byte per value)     |
| ByteVector     | Byte values (8-bit integers), binary data, BLOB   |
| ShortVector    | Short values (16-bit integers)                    |
| CharVector     | Char values (16-bit characters)                   |
| IntVector      | Int values (32-bit integers)                      |
| LongVector     | Long values (64-bit integers)                     |
| FloatVector    | Float values (32-bit floating point)              |
| DoubleVector   | Double values (64-bit floating point)             |
| StringVector   | String values (UTF-8 encoded strings)             |
| DateVector     | Date values (64-bit timestamp)                    |
| DateNanoVector | DateNano values (high precision 64-bit timestamp) |

### Language Examples

{% tabs %}
{% tab title="Java" %}
```java
// Primitive arrays
public byte[] imageData;
public int[] scores;
public double[] measurements;

// String collections
public String[] tags;
public List<String> categories;
```
{% endtab %}

{% tab title="Kotlin" %}
```kotlin
var imageData: ByteArray? = null
var scores: IntArray? = null
var measurements: DoubleArray? = null

var tags: Array<String>? = null
var categories: MutableList<String>? = null
```
{% endtab %}

{% tab title="Dart" %}
```dart
// Typed lists for efficiency
Uint8List? imageData;
Int32List? scores;
Float64List? measurements;

// String list
List<String>? tags;
```
{% endtab %}

{% tab title="Python" %}
```python
image_data = Int8Vector
scores = Int32Vector
measurements = Float64Vector
```
{% endtab %}
{% endtabs %}

{% hint style="info" %}
**For vector search:** Float vectors used for embeddings and similarity search have special indexing support. See [On-Device Vector Search](on-device-vector-search.md).
{% endhint %}

## Flex Properties

Flex properties can hold data values of various types, including complex structures, in a single property. They serve two main purposes:

* Dynamic data: you want to process JSON-like data dynamically
* Nested objects: as an alternative to relations, you can embed map-like data directly

{% hint style="info" %}
When syncing with MongoDB, flex properties can hold nested documents.
{% endhint %}

{% tabs %}
{% tab title="Java" %}
```java
@Entity
public class Customer {
    @Id long id;

    // Stores any supported type at runtime
    @Nullable Object tag;

    // Or explicitly use a String map
    @Nullable Map<String, Object> stringMap;

    // Or a list
    @Nullable List<Object> flexList;
    
    public Customer(Object tag) {
        this.id = 0;
        this.tag = tag;
    }
    
    public Customer() {} // For ObjectBox
}

Customer customerStrTag = new Customer("string-tag");
Customer customerIntTag = new Customer(1234);
box.put(customerStrTag, customerIntTag);
```

See [FlexObjectConverter](https://objectbox.io/docfiles/java/current/io/objectbox/converter/FlexObjectConverter.html) for Java/Kotlin additional notes.
{% endtab %}

{% tab title="Kotlin" %}
```kotlin
@Entity
data class Customer(
    @Id var id: Long = 0,

    // Stores any supported type at runtime
    var tag: Any? = null,

    // Or explicitly use a String map
    var stringMap: MutableMap<String, Any?>? = null

    // Or a list
    var flexList: MutableList<Any?>? = null
)

val customerStrTag = Customer(tag = "string-tag")
val customerIntTag = Customer(tag = 1234)
box.put(customerStrTag, customerIntTag)
```

See [FlexObjectConverter](https://objectbox.io/docfiles/java/current/io/objectbox/converter/FlexObjectConverter.html) for Java/Kotlin additional notes.
{% endtab %}

{% tab title="Dart/Flutter" %}
```dart
@Entity()
class Customer {
  @Id()
  int id = 0;
  
  // Stores any supported type at runtime
  dynamic tag;
  
  // Or explicitly use a String map (JSON-like)
  Map<String, dynamic>? stringMap;
  
  // Or a list with mixed types
  List<dynamic>? flexList;
  
  // Or a list of maps
  List<Map<String, dynamic>>? nestedList;
}

final customerStrTag = Customer()..tag = "string-tag";
final customerIntTag = Customer()..tag = 1234;
box.putMany([customerStrTag, customerIntTag]);
```
{% endtab %}
{% endtabs %}

## Custom Types

If the existing property types do not fully cover your use case, check [custom types and converters](advanced/custom-types.md).
