---
description: >-
  How to store types that are not built-in, recommendations for storing enums,
  and using property converters.
---

# Custom Types

ObjectBox supports a wide range of [built-in property types](../property-types.md). For types that aren't directly supported, you can use converters to map them to a built-in type.

## Flex property converters

In ObjectBox for Java/Kotlin, [Flex properties](../property-types.md#flex-properties) use converters internally.
You can exchange converters to fine-tune the conversion process.
To **override the default converter**, use `@Convert`.
For example to use another built-in `FlexObjectConverter` subclass:

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
ObjectBox has [built-in support for many list and array types](../property-types.md#lists-and-arrays), including String lists/arrays and typed numeric arrays.
{% endhint %}

## How to convert Enums correctly

Enums are popular with data objects like entities. When persisting enums, there are a couple of best practices:

* **Do not persist the enum’s ordinal or name:** Both are unstable, and can easily change the next time you edit your enum definitions.
* **Use stable ids:** Define a custom property (integer or string) in your enum that is guaranteed to be stable. Use this for your persistence mapping.
* **Prepare for the unknown:** Define an UNKNOWN enum value. It can serve to handle null or unknown values. This will allow you to handle cases like an old enum value getting removed without crashing your app.

## Custom types in queries

`QueryBuilder` is unaware of custom types. You have to **use the primitive DB type for queries**.

So for the Role example above you would get users with the role of admin with the query condition `.equal(UserProperties.Role, 2)`.
