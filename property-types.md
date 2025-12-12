---
description: >-
  ObjectBox supports a variety of data types inside the stored objects including
  various list types and even special "flex" types for dynamic and schema-less
  data.
---

# Property Types

ObjectBox stores data as objects, which are instances of entity classes you define.
Objects consist of properties, which are the individual fields that hold your data, like a user's name or age.
This page covers the property types ObjectBox supports:

* **Standard types** for single values of a fixed type
* **List/Vector types** for collections of values of a fixed type
* **The flex type** for dynamic and schema-less data

## Standard Types

Standard types include boolean, integers, floating point types, string, binary data, and date types.
These are the most common types you will use in typical applications.

### Quick Reference

| Category         | Java/Kotlin            | Dart                                                  | Python     | Stored as      |
|------------------|------------------------|-------------------------------------------------------|------------|----------------|
| Boolean          | `boolean` / `Boolean`  | `bool`                                                | `Bool`     | 1 byte         |
| Integer (8-bit)  | `byte` / `Byte`        | `int` + `@Property(type: PropertyType.byte)`          | `Int8`     | 1 byte         |
| Integer (16-bit) | `short` / `Short`      | `int` + `@Property(type: PropertyType.short)`         | `Int16`    | 2 bytes        |
| Integer (32-bit) | `int` / `Integer`      | `int` + `@Property(type: PropertyType.int)`           | `Int32`    | 4 bytes        |
| Integer (64-bit) | `long` / `Long`        | `int`                                                 | `Int64`    | 8 bytes        |
| Float (32-bit)   | `float` / `Float`      | `double` + `@Property(type: PropertyType.float)`      | `Float32`  | 4 bytes        |
| Float (64-bit)   | `double` / `Double`    | `double`                                              | `Float64`  | 8 bytes        |
| Character        | `char` / `Character`   | `int` + `@Property(type: PropertyType.char)`          | —          | 2 bytes        |
| String           | `String`               | `String`                                              | `String`   | UTF-8 bytes    |
| Binary data      | `byte[]`               | `Uint8List`                                           | `Bytes`    | Raw bytes      |
| Date (ms)        | `java.util.Date`       | `DateTime`                                            | `Date`     | 8 bytes (long) |
| Date (ns)        | `@Type(DateNano) long` | `DateTime` + `@Property(type: PropertyType.dateNano)` | `DateNano` | 8 bytes (long) |

{% hint style="info" %}
**Nullable types:** All ObjectBox property types support null values.
In Java, use wrapper classes (`Integer` vs `int`) for nullable types.
In Kotlin, Dart, and Python, nullability is part of the type system.
{% endhint %}

### Integers

ObjectBox supports all standard integer types, from 8-bit to 64-bit.
Rule of thumb: use large enough integer types that are safe for your use case in the future.
Use smaller types only if you are certain about the range of values as you cannot change the type of an existing property later.

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

Choose 32-bit floats for memory efficiency when ~7 digits of precision is enough.
Use 64-bit doubles when you need ~15 digits.

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

ObjectBox stores dates as integers representing time since Unix epoch.
Choose your precision:

| Precision    | Annotation                                  | Use case                  |
|--------------|---------------------------------------------|---------------------------|
| Milliseconds | Default for `Date`/`DateTime`               | Most applications         |
| Nanoseconds  | `@Type(DateNano)` / `PropertyType.dateNano` | High-precision timestamps |

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
// Millisecond precision (default)
@Property(type: PropertyType.date)
DateTime? createdAt;

// Nanosecond precision
@Property(type: PropertyType.dateNano)
DateTime? preciseTimestamp;
```

{% hint style="warning" %}
Dart `DateTime` is always restored in the device's local time zone.
For UTC handling, store as a transient property and convert manually.
{% endhint %}
{% endtab %}
{% endtabs %}

## Lists and Arrays

Store collections of values directly; no special tables or joins required.

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
**For vector search:** Float vectors used for embeddings and similarity search have special indexing support.
See [On-Device Vector Search](on-device-vector-search.md).
{% endhint %}

## Flex Properties

Flex properties can hold various types of data in a single property including complex structures.
They serve two main purposes:

* Dynamic data: you want to process JSON-like data dynamically
* Nested objects: for some reason you don't want to use relations, and want to embed map-like data directly 

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

Flex properties are stored as binary [FlexBuffers](https://google.github.io/flatbuffers/flexbuffers.html). See [FlexObjectConverter](https://objectbox.io/docfiles/java/current/io/objectbox/converter/FlexObjectConverter.html) for Java/Kotlin limitations.

## Custom Types

If the existing property types do not fully cover your use case, check [custom types and converters](advanced/custom-types.md).
