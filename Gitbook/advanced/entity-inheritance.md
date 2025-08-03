---
description: How to inherit properties from entity super classes.
---

# Entity Inheritance

## ObjectBox - Entity Super Classes

{% hint style="info" %}
Only available for Java/Kotlin at the moment
{% endhint %}

ObjectBox allows entity inheritance to share persisted properties in super classes. The base class can be an entity or non-entity class. For this purpose the `@Entity`  annotation is complemented by the `@BaseEntity`  annotation. There are three types of super classes, which are defined via annotations:

* **No annotation:** The base class and its properties are not considered for persistence.
* **@BaseEntity:** Properties are considered for persistence in sub classes, but the base class itself cannot be persisted.
* **@Entity:** Properties are considered for persistence in sub classes, and the base class itself is a normally persisted entity.

For example:

{% tabs %}
{% tab title="Java" %}
```java
// Superclass:
@BaseEntity
public abstract class Base {
    
    @Id long id;
    String baseString;
    
    public Base() {
    }
    
    public Base(long id, String baseString) {
        this.id = id;
        this.baseString = baseString;
    }
}

// Subclass:
@Entity
public class Sub extends Base {
    
    String subString;
    
    public Sub() {
    }
    
    public Sub(long id, String baseString, String subString) {
        super(id, baseString);
        this.subString = subString;
    }
}
```
{% endtab %}

{% tab title="Kotlin" %}
```kotlin
// Note: Kotlin data classes do not support inheritance,
// so this example uses regular Kotlin classes.

// Superclass:
@BaseEntity
abstract class Base {
    @Id
    var id: Long = 0
    var baseString: String? = null

    constructor()
    constructor(id: Long, baseString: String?) {
        this.id = id
        this.baseString = baseString
    }
}

// Subclass:
@Entity
class Sub : Base {
    var subString: String? = null

    constructor()
    constructor(id: Long, 
                baseString: String?,
                subString: String?) : super(id, baseString) {
        this.subString = subString
    }
}
```
{% endtab %}
{% endtabs %}

The model for Sub, Sub\_, will now include all properties: `id` , `baseString`  and `subString` .

It is also possible to inherit properties from another entity:

{% tabs %}
{% tab title="Java" %}
```java
// Entities inherit properties from super entities.
@Entity
public class SubSub extends Sub {
    
    String subSubString;
    
    public SubSub() {
    }
    
    public SubSub(long id, String baseString,
                  String subString, String subSubString) {
        super(id, baseString, subString);
        this.subSubString = subSubString;
    }
}
```
{% endtab %}

{% tab title="Kotlin" %}
```kotlin
// Entities inherit properties from super entities.
@Entity
class SubSub : Sub {
    var subSubString: String? = null

    constructor()
    constructor(id: Long,
                baseString: String?,
                subString: String?,
                subSubString: String?) : super(id, baseString, subString) {
        this.subSubString= subSubString
    }
}
```
{% endtab %}
{% endtabs %}



## Notes on usage

* It is possible to have classes in the inheritance chain that are not annotated with @BaseEntity. Their properties will be ignored and will not become part of the entity model.
* It is not generally recommend to have a base entity class consisting of an ID property only. E.g. Java imposes an additional overhead to construct objects with a sub class.
* Depending on your use case using interfaces may be more straightforward.

## Restrictions

* Superclasses annotated with **@BaseEntity can not be part of a library**.
* There are **no polymorphic queries** (e.g. you cannot query for a base class and expect results from sub classes).
* Currently any superclass, whether it is an @Entity or @BaseEntity, **can not have any relations** (like a ToOne or ToMany property).

{% tabs %}
{% tab title="Java" %}
```java
// THIS DOES NOT WORK
@BaseEntity
public abstract class Base {
    @Id long id;
    ToOne<OtherEntity> other; 
    ToMany<OtherEntity> others; 
}
```
{% endtab %}

{% tab title="Kotlin" %}
```kotlin
// THIS DOES NOT WORK
@BaseEntity
abstract class Base {
    @Id
    var id: Long = 0
    lateinit var other: ToOne<OtherEntity>
    lateinit var others: ToMany<OtherEntity>
}
```
{% endtab %}
{% endtabs %}

