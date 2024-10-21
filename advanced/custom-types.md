---
description: >-
  Which types are supported by default in ObjectBox, how to store types that are
  not, recommendations for storing enums.
---

# Custom Types

## ObjectBox - Supported Types

With ObjectBox you can store pretty much any type (class), given that it can be converted to any of the built-in types.

ObjectBox can store the following built-in types without a converter:

{% tabs %}
{% tab title="Java" %}
```java
boolean, Boolean
int, Integer
short, Short
long, Long
float, Float
double, Double
byte, Byte
char, Character
String

// Strings
String[]
List<String>
Map<String, String>

// integer arrays
byte[]
char[]
short[]
int[]
long[]

// floating point arrays
float[]
double[]

// Stored as time (long) with millisecond precision.
java.util.Date

// Stored as time (long) with nanosecond precision.
@Type(DatabaseType.DateNano) long, Long 

// Flex properties, see important notes below
Object
Map<String, Object>
List<Object>
```
{% endtab %}

{% tab title="Kotlin" %}
```kotlin
// The nullable variants are supported as well
Boolean
Int
Short
Long
Float
Double
Byte
Char
String

// Kotlin unsigned integer types
// https://kotlinlang.org/docs/unsigned-integer-types.html
// are stored as their signed Java equivalent.
// These are just Kotlin inline value classes, so to make their
// getter visible to Java, need to annotate them with @JvmName.
// https://kotlinlang.org/docs/inline-classes.html#calling-from-java-code
@get:JvmName("getUnsignedByte")
var unsignedByte: UByte = 0u
@get:JvmName("getUnsignedShort")
var unsignedShort: UShort = 0u
@get:JvmName("getUnsignedInt")
var unsignedInt: UInt = 0u
@get:JvmName("getUnsignedLong")
var unsignedLong: ULong = 0u

// The same applies for other Kotlin inline value classes
@JvmInline
value class Custom(val i: Long)

@get:JvmName("getCustom")
var custom: Custom = Custom(0)

// Strings
Array<String>
MutableList<String>
MutableMap<String, String>

// integer arrays
ByteArray
CharArray
ShortArray
IntArray
LongArray

// floating point arrays
FloatArray
DoubleArray

// Stored as time (Long) with millisecond precision.
java.util.Date

// Stored as time (Long) with nanosecond precision.
@Type(DatabaseType.DateNano) Long?

// Flex properties, see important notes below
Any
MutableMap<String, Any>
MutableList<Any>
```
{% endtab %}

{% tab title="Dart" %}
```dart
// all fields are supported as both nullable and non-nullable

bool
int // 64-bit, see below to store as smaller integer
double // 64-bit, see below to store as smaller floating-point
String
List<String>

// Time with millisecond precision.
// Note: always restored in default time zone.
@Property(type: PropertyType.date)
DateTime date;

// Time with millisecond precision restored in UTC time zone.
@Transient()
DateTime utcDate;

int get dbUtcDate => utcDate.millisecondsSinceEpoch;

set dbUtcDate(int value) {
  utcDate = DateTime.fromMillisecondsSinceEpoch(value, isUtc: true);
}

// Time with nanosecond precision.
@Property(type: PropertyType.dateNano)
DateTime nanoDate;

// integer
@Property(type: PropertyType.byte)
int byte; // 8-bit
@Property(type: PropertyType.short)
int short; // 16-bit
@Property(type: PropertyType.char)
int char; // 16-bit unsigned
@Property(type: PropertyType.int)
int int32; // 32-bit
int int64; // 64-bit

// floating point
@Property(type: PropertyType.float)
double float; // 32-bit
double float64; // 64-bit

// 8-bit integer vector
@Property(type: PropertyType.byteVector)
List<int> byteList;
Int8List int8List;
Uint8List uint8List;

// 16-bit unsigned integer vector
@Property(type: PropertyType.charVector)
List<int>? charList;

// 16-bit integer vector
@Property(type: PropertyType.shortVector)
List<int>? shortList;
Int16List? int16List;
Uint16List? uint16List;

// 32-bit integer vector
@Property(type: PropertyType.intVector)
List<int>? intList;
Int32List? int32List;
Uint32List? uint32List;

// 64-bit integer vector
List<int>? longList;
Int64List? int64List;
Uint64List? uint64List;

// 32-bit floating point vector
@Property(type: PropertyType.floatVector)
List<double>? floatList;
Float32List? float32List;

// 64-bit floating point vector
List<double>? doubleList;
Float64List? float64List;
```
{% endtab %}

{% tab title="Python" %}
```python
Bool
Int8
Int16
Int32
Int64
Float32
Float64
Bytes
String
BoolVector
Int8Vector
Int16Vector
Int32Vector
Int64Vector
Float32Vector
Float64Vector
CharVector
BoolList
Int8List
Int16List
Int32List
Int64List
Float32List
Float64List
CharList
Date
DateNano
Flex
```
{% endtab %}
{% endtabs %}

### Flex properties

{% hint style="info" %}
Only Java/Kotlin
{% endhint %}

ObjectBox supports properties where the type is not known at compile time using `Object` in Java or `Any?` in Kotlin. These "flex properties" can store types like integers, floating point values, strings and byte arrays. Or lists and maps (using string keys) of those. In the database these properties are stored as byte arrays.&#x20;

Some **important limitations** apply, see the [FlexObjectConverter](https://objectbox.io/docfiles/java/current/io/objectbox/converter/FlexObjectConverter.html) class documentation for details.

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
    
    // TODO getters and setters
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
{% endtabs %}

To **override the default converter** chosen by ObjectBox, use `@Convert`. For example to use another built-in `FlexObjectConverter` subclass:

{% tabs %}
{% tab title="Java" %}
<pre class="language-java"><code class="lang-java">// StringLongMapConverter restores any integers always as Long
@Convert(converter = StringLongMapConverter.class, dbType = byte[].class)
<strong>@Nullable Map&#x3C;String, Object> stringMap;
</strong></code></pre>
{% endtab %}

{% tab title="Kotlin" %}
```kotlin
// StringLongMapConverter restores any integers always as Long
@Convert(converter = StringLongMapConverter::class, dbType = ByteArray::class)
var stringMap: MutableMap<String, Any>? = null
```
{% endtab %}
{% endtabs %}

You can also write a custom converter like shown below.

## Convert annotation and property converter

To add support for a custom type, you need to provide a conversion to one of the ObjectBox built-in types. For example, you could define a color in your entity using a custom `Color` class and map it to an `Integer`. Or you can map the popular `org.joda.time.DateTime` from Joda Time to a `Long`.

Here is an example mapping an `enum` to an integer:

{% tabs %}
{% tab title="Java" %}
```java
@Entity
public class User {
    @Id
    public long id;
    
    @Convert(converter = RoleConverter.class, dbType = Integer.class)
    public Role role;
    
    public enum Role {
        DEFAULT(0), AUTHOR(1), ADMIN(2);
        
        final int id;
        
        Role(int id) {
            this.id = id;
        }
    }

    public static class RoleConverter implements PropertyConverter<Role, Integer> {
        @Override
        public Role convertToEntityProperty(Integer databaseValue) {
            if (databaseValue == null) {
                return null;
            }
            for (Role role : Role.values()) {
                if (role.id == databaseValue) {
                    return role;
                }
            }
            return Role.DEFAULT;
        }
    
        @Override
        public Integer convertToDatabaseValue(Role entityProperty) {
            return entityProperty == null ? null : entityProperty.id;
        }
    }
}
```
{% endtab %}

{% tab title="Kotlin" %}
```kotlin
@Entity
data class User(
        @Id
        var id: Long = 0,
        @Convert(converter = RoleConverter::class, dbType = Int::class)
        var role: Role? = null
)

enum class Role(val id: Int) {
    DEFAULT(0), AUTHOR(1), ADMIN(2);
}

class RoleConverter : PropertyConverter<Role?, Int?> {
    override fun convertToEntityProperty(databaseValue: Int?): Role? {
        if (databaseValue == null) {
            return null
        }
        for (role in Role.values()) {
            if (role.id == databaseValue) {
                return role
            }
        }
        return Role.DEFAULT
    }

    override fun convertToDatabaseValue(entityProperty: Role?): Int? {
        return entityProperty?.id
    }
}
```
{% endtab %}

{% tab title="Dart" %}
```dart
enum Role {
  unknown,
  author,
  admin
}

@Entity()
class User {
  int id;

  // The Role type is not supported by ObjectBox.
  // So ignore this field...
  @Transient()
  Role? role;

  // ...and define a field with a supported type,
  // that is backed by the role field.
  int? get dbRole {
    _ensureStableEnumValues();
    return role?.index;
  }

  set dbRole(int? value) {
    _ensureStableEnumValues();
    if (value == null) {
      role = null;
    } else {
      role = Role.values[value]; // throws a RangeError if not found

      // or if you want to handle unknown values gracefully:
      role = value >= 0 && value < Role.values.length
          ? Role.values[value]
          : Role.unknown;
    }
  }

  User(this.id);

  void _ensureStableEnumValues() {
    assert(Role.unknown.index == 0);
    assert(Role.author.index == 1);
    assert(Role.admin.index == 2);
  }
}
```
{% endtab %}
{% endtabs %}

### Things to look out for

If you define your custom type or converter **inside a Java or Kotlin entity class**, it must be **static or respectively not an inner class**.

Don’t forget to **handle null values** correctly – usually, you should return null if the input is null.

Database types in the sense of the converter are the primitive (built-in) types offered by ObjectBox, as mentioned in the beginning. It is recommended to **use a primitive type that is easily convertible** (int, long, byte array, String, …).

You must **not interact with the database** (such as using `Box` or `BoxStore`) inside the converter. The converter methods are called within a transaction, so for example, getting or putting entities to a box will fail.

{% hint style="info" %}
Note: For optimal performance, **ObjectBox will use a single converter instance** for all conversions. Make sure the converter does not have any other constructor besides the parameter-less default constructor. Also, make it thread-safe, because it might be called concurrently on multiple entities.
{% endhint %}

## List/Array types

You can use a converter with List types. For example, you could convert a List of Strings to a JSON array resulting in a single string for the database. At the moment it is not possible to use an array with converters (you can track this [feature request](https://github.com/greenrobot/ObjectBox/issues/42)).

{% hint style="info" %}
ObjectBox (Java, Dart) has built-in support for String lists. ObjectBox for Java also has built-in support for String arrays.
{% endhint %}

## How to convert Enums correctly

Enums are popular with data objects like entities. When persisting enums, there are a couple of best practices:

* **Do not persist the enum’s ordinal or name:** Both are unstable, and can easily change the next time you edit your enum definitions.
* **Use stable ids:** Define a custom property (integer or string) in your enum that is guaranteed to be stable. Use this for your persistence mapping.
* **Prepare for the unknown:** Define an UNKNOWN enum value. It can serve to handle null or unknown values. This will allow you to handle cases like an old enum value getting removed without crashing your app.

## Custom types in queries

`QueryBuilder` is unaware of custom types. You have to **use the primitive DB type for queries**.

So for the Role example above you would get users with the role of admin with the query condition `.equal(UserProperties.Role, 2)`.
