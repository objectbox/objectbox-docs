---
description: >-
  Discover how to use the Query API to create queries with ObjectBox DB. By
  utilizing these queries, you can retrieve stored objects that meet
  user-defined criteria.
---

# ObjectBox Queries

## Build a query

Use `box.query(condition)` and supply a `condition` on one or more properties to start building a query.

Create a `condition` by accessing a property via the underscore class of the entity, e.g. `User_.firstName.equal("Joe")`.

Use `build()` to create a re-usable query instance. To then retrieve all results use `find()` on the query. More options on retrieving results are discussed later in [#run-a-query](queries.md#run-a-query "mention").

Once done, `close()` the query to clean up resources.

Here is a full example to query for all users with the first name “Joe”:

{% tabs %}
{% tab title="Java" %}
```java
Query<User> query = userBox.query(User_.firstName.equal("Joe")).build();
List<User> joes = query.find();
query.close();
```
{% endtab %}

{% tab title="Kotlin" %}
```kotlin
val query = userBox.query(User_.firstName.equal("Joe")).build()
val joes = query.find()
query.close()
```
{% endtab %}

{% tab title="Dart" %}
```dart
Query<User> query = userBox.query(User_.firstName.equals('Joe')).build();
List<User> joes = query.find();
query.close();
```
{% endtab %}

{% tab title="Python" %}
```python
query = userBox.query(User.firstName.equals("Joe")).build()
joes = query.find()
```
{% endtab %}
{% endtabs %}

**To combine multiple conditions** use `and(condition)` and `or(condition)`. This implicitly adds parentheses around the combined conditions, e.g. `cond1.and(cond2)` is logically equivalent to `(cond1 AND cond2)`.

For example to get users with the first name “Joe” that are born later than 1970 and whose last name starts with “O”:

{% tabs %}
{% tab title="Java" %}
```java
Query<User> query = userBox.query(
        User_.firstName.equal("Joe")
                .and(User_.yearOfBirth.greater(1970))
                .and(User_.lastName.startsWith("O")))
        .build();
List<User> youngJoes = query.find();
query.close();
```
{% endtab %}

{% tab title="Kotlin" %}
```kotlin
val query = userBox.query(
        User_.firstName equal "Joe"
                and (User_.yearOfBirth greater 1970)
                and (User_.lastName startsWith "O")
        .build()
val youngJoes = query.find()
query.close()
```
{% endtab %}

{% tab title="Dart" %}
```dart
Query<User> query = userBox.query(
            User_.firstName.equal('Joe')
            .and(User_.yearOfBirth.greaterThan(1970))
            .and(User_.lastName.startsWith('O')))
        .build();
        
// or use operator overloads:
Query<User> query = userBox.query(
            User_.firstName.equal('Joe') &
            User_.yearOfBirth.greaterThan(1970) &
            User_.lastName.startsWith('O'))
        .build();
```
{% endtab %}

{% tab title="Python" %}
```python
query = userBox.query( 
  User.firstName.equals("Joe") & 
  User.yearOfBirth.greater_than(1970) & 
  User.lastName.starts_with('O')
).build()
joes = query.find()
```
{% endtab %}
{% endtabs %}

**To nest conditions** pass a combined condition to `and()` or `or()`:

{% tabs %}
{% tab title="Java" %}
```java
// equal AND (less OR oneOf)
Query<User> query = box.query(
        User_.firstName.equal("Joe")
                .and(User_.age.less(12)
                        .or(User_.stamp.oneOf(new long[]{1012}))))
        .order(User_.age)
        .build();
```
{% endtab %}

{% tab title="Kotlin" %}
```kotlin
// equal AND (less OR oneOf)
val query = box.query(
        User_.firstName equal "Joe"
                and (User_.age less 12
                or (User_.stamp oneOf longArrayOf(1012))))
        .order(User_.age)
        .build()        
```
{% endtab %}

{% tab title="Dart" %}
```dart
Query<User> query = box.query(
    User_.firstName.equal('Joe')
        .and(User_.age.lessThan(12)
        .or(User_.stamp.oneOf([1012]))))
    .order(User_.age)
    .build();
```
{% endtab %}

{% tab title="Python" %}
```python
query = userBox.query(
        (User.firstName.equals("Joe")
            & User.yearOfBirth.greater_than(1970)) | 
        User.lastName.starts_with('O')
    ).build()
joes = query.find()
```

{% hint style="info" %}
one\_of is not yet available in Python.
{% endhint %}
{% endtab %}
{% endtabs %}

#### Other notable features

* In Kotlin, instead of `condition1.and(condition2)` you can write `condition1`` `**`and`**` ``condition2` (similarly `condition1`` `**`or`**` ``condition2`).
* In Dart and Python, instead of `condition1.and(condition2)` you can write `condition1`` `**`&`**` ``condition2` (similarly `condition1`` `**`|`**` ``conditon2`).
* Use `condition.alias(aliasName)` to set an alias for a `condition` that can later be used to change the parameter value of the condition on the built query.

### Common conditions

Apart from the standard conditions like `equal()`, `notEqual()`, `greater()` and `less()` there are also additional conditions available:

* `isNull()` and `notNull()`,
* `between()` to filter for values that are between the given two,
* `oneOf()` and `notOneOf()` to filter for values that match any in the given array,
* `startsWith()`, `endsWith()` and `contains()` for extended String filtering.

See the API for a full list:

* Property conditions: [Java](https://objectbox.io/docfiles/java/current/io/objectbox/Property.html) and [Dart](https://pub.dev/documentation/objectbox/latest/objectbox/QueryProperty-class.html)
* Relation conditions: [Java](https://objectbox.io/docfiles/java/current/io/objectbox/relation/RelationInfo.html)

{% hint style="info" %}
**Dart only: DateTime caveat**

For Dart `DateTime` is stored as time in milliseconds internally in the database (or nanoseconds for `@Property(type: PropertyType.dateNano)`).

To avoid having to manually convert to `int` when creating a query condition, extra methods that accept `DateTime` exist.

For example, to query an `Order` entity with a `date` field to find all orders in 2023:

```dart
final query = box
    .query(Order_.date.betweenDate(DateTime.utc(2023),
        DateTime.utc(2024).subtract(Duration(milliseconds: 1))))
    .build();
```
{% endhint %}

### Nearest neighbor vector search

A special condition is available for vector properties with an HNSW index. See the dedicated page for details:

{% content-ref url="on-device-vector-search.md" %}
[on-device-vector-search.md](on-device-vector-search.md)
{% endcontent-ref %}

### Order results

In addition to specifying conditions, you can order the returned results using the `order()` method. By default this sorts ASCII characters in alphabetical order while ignoring case and numbers in ascending order.

{% tabs %}
{% tab title="Java" %}
```java
Query<User> query = userBox
    .query(User_.firstName.equal("Joe"))
    .order(User_.lastName) // in ascending order, ignoring case
    .build();
```
{% endtab %}

{% tab title="Kotlin" %}
```kotlin
val query = userBox
    .query(User_.firstName.equal("Joe"))
    .order(User_.lastName) // in ascending order, ignoring case
    .build()
```
{% endtab %}

{% tab title="Dart" %}
```dart
// in ascending order, ignoring case
final qBuilder = box.query(User_.firstName.equals('Joe').order(User_.lastName);
final query = qBuilder.build();
```
{% endtab %}

{% tab title="Python" %}
{% hint style="info" %}
Order results feature is not yet available in Python.
{% endhint %}
{% endtab %}
{% endtabs %}

You can also pass flags to `order()` to sort in descending order, to sort case sensitive or to specially treat null values. For example to sort the above results in descending order and case sensitive instead:

{% tabs %}
{% tab title="Java" %}
```java
.order(User_.lastName, QueryBuilder.DESCENDING | QueryBuilder.CASE_SENSITIVE)
```
{% endtab %}

{% tab title="Kotlin" %}
```kotlin
.order(User_.lastName, QueryBuilder.DESCENDING or QueryBuilder.CASE_SENSITIVE)
```
{% endtab %}

{% tab title="Dart" %}
```dart
.order(User_.lastName, flags: Order.descending | Order.caseSensitive)
```
{% endtab %}

{% tab title="Python" %}
{% hint style="info" %}
Order results feature is not yet available in Python.
{% endhint %}
{% endtab %}
{% endtabs %}

Order directives can also be chained. Check the method documentation ([Java](https://objectbox.io/files/objectbox-java/current/io/objectbox/query/QueryBuilder.html#order\(io.objectbox.Property,int\))) for details.

## Run a query

&#x20;[Queries](queries.md) are first created (and not yet executed) by calling `build()` on the `QueryBuilder`.

```java
Query<User> query = builder.build();
```

Once the query is created, it allows various operations, which we will explore in the following sub sections.

### Find objects

&#x20;There are a couple of find methods to retrieve objects matching the query:

```java
// return all entities matching the query
List<User> joes = query.find();

// return only the first result or null if none
User joe = query.findFirst();

// return the only result or null if none, throw if more than one result
User joe = query.findUnique();
```

To return all entities matching the query simply call `find()`.

To only return the first result, use `findFirst()`.

If you expect a unique result, call `findUnique()` instead. It will give you a single result or null, if no matching entity was found and throw an exception if there was more than one result.

### Remove objects

To remove all objects matching a query, call `query.remove()` .

### Reuse Queries and Parameters

If you frequently run the same query you should cache the `Query` object and re-use it. To make a `Query` more reusable you can change the values, or query parameters, of each condition you added even after the `Query` is built. Let's see how.

{% hint style="info" %}
Query is not thread safe. To use a query in a different thread, either build a new query or synchronize access to it. Alternatively, in Java use `query.copy()` or a `QueryThreadLocal` to obtain an instance for each thread.
{% endhint %}

Assume we want to find a list of `User` with specific `firstName` values. First, we build a regular `Query` with an `equal()` condition for `firstName`. Because we have to pass an initial parameter value to `equal()` but plan to override it before running the `Query` later, we just pass an empty string:

{% tabs %}
{% tab title="Java" %}
```java
// build a query
Query<User> query = userBox.query(User_.firstName.equal("")).build();
```
{% endtab %}

{% tab title="Kotlin" %}
```kotlin
// build a query
val query = userBox.query(User_.firstName.equal("")).build()
```
{% endtab %}

{% tab title="Dart" %}
```dart
// build a query
final query = userBox.query(User_.firstName.equals('')).build();
```
{% endtab %}

{% tab title="Python" %}
```python
# build a query
query = userBox.query(User.firstName.equals('')).build();
```
{% endtab %}
{% endtabs %}

Now at some later point, we want to run the `Query` with an actual value for the `equals` condition on`firstName` :

{% tabs %}
{% tab title="Java" %}
```java
// Change firstName parameter to "Joe" and get results
List<User> joes = query.setParameter(User_.firstName, "Joe").find();

// Change firstName parameter to "Jake" and get results
List<User> jakes = query.setParameter(User_.firstName, "Jake").find();
```
{% endtab %}

{% tab title="Kotlin" %}
```kotlin
// Change firstName parameter to "Joe" and get results
val joes = query.setParameter(User_.firstName, "Joe").find()

// Change firstName parameter to "Jake" and get results
val jakes = query.setParameter(User_.firstName, "Jake").find()
```
{% endtab %}

{% tab title="Dart" %}
```dart
// Change firstName parameter to "Joe" and get results
query.param(User_.firstName).value = 'Joe';
final joes = query.find();

// Change firstName parameter to "Jake" and get results
final jakes = (query..param(User_.firstName).value = 'Jake').find();
```
{% endtab %}

{% tab title="Python" %}
```python
# Change firstName parameter to "Joe" and get results
joes = query.set_parameter_string(User.firstName, "Joe").find()

# Change firstName parameter to "Jake" and get results
jakes = query.set_parameter_srting(User.firstName, "Jake").find()
```
{% endtab %}
{% endtabs %}

You might already be wondering what happens if you have more than one condition using `firstName`? For this purpose you can **assign each parameter an alias** while specifying the condition:

{% tabs %}
{% tab title="Java" %}
```java
// assign alias "name" to the equal query parameter
Query<User> query = userBox
    .query(User_.firstName.equal("").alias("name"));
```
{% endtab %}

{% tab title="Kotlin" %}
```kotlin
// assign alias "name" to the equal query parameter
val query = userBox
    .query(User_.firstName.equal("").alias("name"))
```
{% endtab %}

{% tab title="Dart" %}
```dart
// assign alias "name" to the equals query parameter
final query = userBox.query(User_.firstName.equals('', alias: 'name')).build();
```
{% endtab %}

{% tab title="Python" %}
```python
# Assign alias "name" to the equals query parameter
query = userBox.query(User.firstName.equals('').alias("name")).build();
```
{% endtab %}
{% endtabs %}

Then, when setting a new parameter value pass the alias instead of the property:

{% tabs %}
{% tab title="Java" %}
```java
// Change parameter with alias "name" to "Joe", get results
List<User> joes = query.setParameter("name", "Joe").find();
```
{% endtab %}

{% tab title="Kotlin" %}
```kotlin
// Change parameter with alias "name" to "Joe" and get results
val joes = query.setParameter("name", "Joe").find()
```
{% endtab %}

{% tab title="Dart" %}
```dart
// Change parameter with alias "name" to "Joe" and get results
final joes = (query..param(User_.firstName, alias: 'name').value = 'Joe').find();
```
{% endtab %}

{% tab title="Python" %}
```python
# Change parameter with alias "name" to "Joe" and get results
joes = query.set_parameter_alias_string("name", "Joe").find()
```
{% endtab %}
{% endtabs %}

### Limit, Offset, and Pagination

Sometimes you only need a subset of a query, for example, the first 10 elements to display in your user interface. This is especially helpful (and resource-efficient) when you have a high number of entities and you cannot limit the result using query conditions only.&#x20;

{% tabs %}
{% tab title="Java" %}
```java
// offset by 10, limit to at most 5 results
List<User> joes = query.find(10, 5);
```
{% endtab %}

{% tab title="Kotlin" %}
```kotlin
// offset by 10, limit to at most 5 results
val joes = query.find(10, 5)
```
{% endtab %}

{% tab title="Dart" %}
```dart
// offset by 10, limit to at most 5 results
query
  ..offset = 10
  ..limit = 5;
List<User> joes = query.find();
```
{% endtab %}

{% tab title="Python" %}
<pre class="language-python"><code class="lang-python"># Offset by 10, limit to at most 5 results
<strong>joes = query \
</strong><strong>    .offset(10)
</strong><strong>    .limit(5)
</strong><strong>    .find()
</strong></code></pre>
{% endtab %}
{% endtabs %}

`offset:` The first `offset` results are skipped.

`limit:` At most `limit` results are returned.

### Lazy-load results (Java)

{% hint style="info" %}
Only Java/Kotlin
{% endhint %}

To avoid loading query results right away, Query offers `findLazy()` and `findLazyCached()` which return a [`LazyList`](https://objectbox.io/files/objectbox-java/current/io/objectbox/query/LazyList.html) of the query results.

[LazyList](https://objectbox.io/files/objectbox-java/current/io/objectbox/query/LazyList.html) is a thread-safe, unmodifiable list that reads entities lazily only once they are accessed. Depending on the find method called, the lazy list will be cached or not. Cached lazy lists store the previously accessed objects to avoid loading entities more than once. Some features of the list are limited to cached lists (e.g. features that require the entire list). See the [LazyList class documentation](https://objectbox.io/files/objectbox-java/current/io/objectbox/query/LazyList.html) for more details.

### Stream results (Dart)

{% hint style="info" %}
Only Dart
{% endhint %}

Instead of reading the whole result (list of objects) using `find()` you can stream it using `stream()` :

{% tabs %}
{% tab title="Dart" %}
```dart
Query<User> query = userBox.query().build();
Stream<User stream = query.stream();
await stream.forEach((User user) => print(user));
query.close();
```
{% endtab %}
{% endtabs %}

## Query a single property

If you only want to return the values of a particular property and not a list of full objects you can use a [PropertyQuery](https://objectbox.io/files/objectbox-java/current/io/objectbox/query/PropertyQuery.html). After building a query, simply call `property(Property)`  to define the property followed by the appropriate find method.

For example, instead of getting all `User`s, to just get their email addresses:

{% tabs %}
{% tab title="Java" %}
```java
String[] emails = userBox.query().build()
    .property(User_.email)
    .findStrings();
    
// or use .findString() to return just the first result
```
{% endtab %}

{% tab title="Kotlin" %}
```kotlin
val emails = userBox.query().build()
    .property(User_.email)
    .findStrings()
    
// or use .findString() to return just the first result
```
{% endtab %}

{% tab title="Dart" %}
```dart
final query = userBox.query().build();
List<String> emails = query.property(User_.email).find();
query.close();
```
{% endtab %}
{% endtabs %}

{% hint style="info" %}
Note: the returned array of property values is **not in any particular order**, even if you did specify an order when building the query.
{% endhint %}

### Handle null values

**By default, null values are not returned.** However, you can specify a replacement value to return if a property is null:

{% tabs %}
{% tab title="Java" %}
```java
// includes 'unknown' for each null email
String[] emails = userBox.query().build()
    .property(User_.email)
    .nullValue("unknown")
    .findStrings();
```
{% endtab %}

{% tab title="Kotlin" %}
```kotlin
// includes 'unknown' for each null email
val emails = userBox.query().build()
    .property(User_.email)
    .nullValue("unknown")
    .findStrings()
```
{% endtab %}

{% tab title="Dart" %}
```dart
final query = userBox.query().build();
// includes 'unknown' for each null email
List<String> emails = query.property(User_.email).find(replaceNullWith: 'unknown');
query.close();
```
{% endtab %}
{% endtabs %}

### Distinct and unique results

The property query can also only return distinct values:

{% tabs %}
{% tab title="Java" %}
```java
PropertyQuery pq = userBox.query().build().property(User_.firstName);

// returns ['joe'] because by default, the case of strings is ignored.
String[] names = pq.distinct().findStrings();

// returns ['Joe', 'joe', 'JOE']
String[] names = pq.distinct(StringOrder.CASE_SENSITIVE).findStrings();

// the query can be configured to throw there is more than one value
String[] names = pq.unique().findStrings();
```
{% endtab %}

{% tab title="Kotlin" %}
```kotlin
val pq = userBox.query().build().property(User_.firstName)

// returns ['joe'] because by default, the case of strings is ignored.
val names = pq.distinct().findStrings()

// returns ['Joe', 'joe', 'JOE']
val names = pq.distinct(StringOrder.CASE_SENSITIVE).findStrings()

// the query can be configured to throw there is more than one value
val names = pq.unique().findStrings()
```
{% endtab %}

{% tab title="Dart" %}
```dart
final query = userBox.query().build();
PropertyQuery<String> pq = query.property(User_.firstName);
pq.distinct = true;

// returns ['Joe', 'joe', 'JOE'] 
List<String> names = pq.find();

// returns ['joe']
pq.caseSensitive = false;
List<String> names = pq.find(); 
query.close();
```
{% endtab %}
{% endtabs %}

### Aggregate values

Property queries ([JavaDoc](https://objectbox.io/files/objectbox-java/current/io/objectbox/query/PropertyQuery.html) and [Dart API docs](https://pub.dev/documentation/objectbox/latest/objectbox/PropertyQuery-class.html)) also offer aggregate functions to directly calculate the minimum, maximum, average, sum and count of all found values:

* `min()` / `minDouble()`: Finds the minimum value for the given property over all objects matching the query.
* `max()` / `maxDouble()`: Finds the maximum value.
* `sum()` / `sumDouble()`: Calculates the sum of all values. _Note: the non-double version detects overflows and throws an exception in that case._
* `avg()` : Calculates the average (always a double) of all values.
* `count()`: returns the number of results. This is faster than finding and getting the length of the result array. Can be combined with `distinct()` to count only the number of distinct values.

## Query a related entity (links)

After creating a relation between entities, you might want to add a query condition for a property that only exists in the related entity. In SQL this is solved using JOINs. But as ObjectBox is not a SQL database we built something very similar: links. Links are based on [Relations ](relations.md)- see the doc page for the introduction.&#x20;

Assume there is a `Person` that can be associated with multiple `Address` entities:

{% tabs %}
{% tab title="Java" %}
```java
@Entity
public class Person {
    @Id long id;
    String name;
    ToMany<Address> addresses;
}

@Entity
public class Address {
    @Id long id;
    String street;
    String zip;
}
```
{% endtab %}

{% tab title="Kotlin" %}
```kotlin
@Entity
class Person {
    @Id
    var id: Long = 0
    var name: String? = null
    lateinit var addresses: ToMany<Address>
}

@Entity
class Address {
    @Id
    var id: Long = 0
    var street: String? = null
    var zip: String? = null
}
```
{% endtab %}

{% tab title="Dart" %}
```dart
@Entity()
class Person {
    int id;
    String name;
    final addresses = ToMany<Address>();
}

@Entity()
class Address {
    int id;
    String street;
    String zip;
}
```
{% endtab %}
{% endtabs %}

To get a `Person` with a certain name that also lives on a specific street, we need to query the associated `Address` entities of a `Person`. To do this, use the `link()` method of the query builder to tell that the `addresses` relation should be queried. Then add a condition for `Address`:

{% tabs %}
{% tab title="Java" %}
```java
// get all Person objects named "Elmo"...
QueryBuilder<Person> builder = personBox
    .query(Person_.name.equal("Elmo"));
// ...which have an address on "Sesame Street"
builder.link(Person_.addresses)
    .apply(Address_.street.equal("Sesame Street"));
List<Person> elmosOnSesameStreet = builder.build().find();
```
{% endtab %}

{% tab title="Kotlin" %}
```kotlin
// get all Person objects named "Elmo"...
val builder = personBox
    .query(Person_.name.equal("Elmo"))
// ...which have an address on "Sesame Street"
builder.link(Person_.addresses)
    .apply(Address_.street.equal("Sesame Street"))
val elmosOnSesameStreet = builder.build().find()
```
{% endtab %}

{% tab title="Dart" %}
```dart
// get all Person objects named "Elmo"...
QueryBuilder<Person> builder = personBox
    .query(Person_.name.equals('Elmo'));
// ...which have an address on "Sesame Street"
builder.linkMany(Person_.addresses, Address_.street.equals('Sesame Street'));
Query<Person> query = builder.build();
List<Person> elmosOnSesameStreet = query.find();
query.close();
```
{% endtab %}
{% endtabs %}

What if we want to get a list of `Address` instead of `Person`? If you know ObjectBox relations well, you would probably add a `@Backlink` relation to `Address` and build your query using it with `link()` as shown above:

{% tabs %}
{% tab title="Java" %}
```java
@Entity
public class Address {
    // ...
    @Backlink(to = "addresses")
    ToMany<Person> persons;
}

// get all Address objects with street "Sesame Street"...
QueryBuilder<Address> builder = addressBox
    .query(Address_.street.equal("Sesame Street"));
// ...which are linked from a Person named "Elmo"
builder.link(Address_.persons)
    .apply(Person_.name.equal("Elmo"));
List<Address> sesameStreetsWithElmo = builder.build().find();
```
{% endtab %}

{% tab title="Kotlin" %}
```kotlin
@Entity
class Address {
    // ...
    @Backlink(to = "addresses")
    lateinit var persons: ToMany<Person>
}

// get all Address objects with street "Sesame Street"...
val builder = addressBox
    .query(Address_.street.equal("Sesame Street"))
// ...which are linked from a Person named "Elmo"
builder.link(Address_.persons)
    .apply(Person_.name.equal("Elmo")
val sesameStreetsWithElmo = builder.build().find()
```
{% endtab %}

{% tab title="Dart" %}
```dart
@Entity()
class Address {
    ...
    
    @Backlink()
    final persons = ToMany<Person>();
}

// get all Address objects with street "Sesame Street"...
QueryBuilder<Address> builder = 
    addressBox.query(Address_.street.equals('Sesame Street'));
// ...which are linked from a Person named "Elmo"
builder.linkMany(Address_.persons, Person_.name.equals('Elmo'));
Query<Address> query = builder.build();
List<Address> sesameStreetsWithElmo = query.find();
query.close();
```
{% endtab %}
{% endtabs %}

But actually, you do not have to modify the `Address` entity (you still can if you need the `@Backlink` elsewhere). Instead, we can use the `backlink()` method to create a backlink to the `addresses` relation from `Person` just for that query:

{% tabs %}
{% tab title="Java" %}
```java
// get all Address objects with street "Sesame Street"...
QueryBuilder<Address> builder = addressBox
    .query(Address_.street.equal("Sesame Street"));
// ...which are linked from a Person named "Elmo"
builder.backlink(Person_.addresses)
    .apply(Person_.name.equal("Elmo"));
List<Address> sesameStreetsWithElmo = builder.build().find();
```
{% endtab %}

{% tab title="Kotlin" %}
```kotlin
// get all Address objects with street "Sesame Street"...
val builder = addressBox
    .query(Address_.street.equal("Sesame Street"))
// ...which are linked from a Person named "Elmo"
builder.backlink(Person_.addresses)
    .apply(Person_.name.equal("Elmo"))
val sesameStreetsWithElmo = builder.build().find()
```
{% endtab %}

{% tab title="Dart" %}
```dart
// get all Address objects with street "Sesame Street"...
QueryBuilder<Address> builder = 
    addressBox.query(Address_.street.equals('Sesame Street'));
// ...which are linked from a Person named "Elmo"
builder.backlinkMany(Person_.addresses, Person_.name.equals('Elmo'));
Query<Address> query = builder.build();
List<Address> sesameStreetsWithElmo = query.find();
query.close();
```
{% endtab %}
{% endtabs %}

## Eager-load relations

{% hint style="info" %}
Only Java/Kotlin
{% endhint %}

By default [relations](relations.md) are loaded lazily: when you first access a `ToOne` or `ToMany` property it will perform a database lookup to get its data. On each subsequent access it will use a cached version of that data.

{% tabs %}
{% tab title="Java" %}
```java
List<Customer> customers = customerBox.query().build().find();
// Customer has a ToMany called orders.
// First access: this will cause a database lookup.
Order order = customers.get(0).orders.get(0);
```
{% endtab %}

{% tab title="Kotlin" %}
```kotlin
val customers = customerBox.query().build().find()
// Customer has a ToMany called orders
val order = customers[0].orders[0] // first access: causes a database lookup
```
{% endtab %}
{% endtabs %}

While this initial lookup is fast, you might want to prefetch `ToOne` or `ToMany` values before the query results are returned. To do this call the [`QueryBuilder.eager`](https://objectbox.io/files/objectbox-java/current/io/objectbox/query/QueryBuilder.html) method when building your query and pass the `RelationInfo` objects associated with the `ToOne` and `ToMany` properties to prefetch:

{% tabs %}
{% tab title="Java" %}
```java
List<Customer> customers = customerBox.query()
    .eager(Customer_.orders) // Customer has a ToMany called orders.
    .build()
    .find();
// First access: this will cause a database lookup.
Order order = customers.get(0).orders.get(0);
```
{% endtab %}

{% tab title="Kotlin" %}
```kotlin
val customers = customerBox.query()
    .eager(Customer_.orders) // Customer has a ToMany called orders
    .build()
    .find()
customers[0].orders[0] // first access: this will NOT cause a database lookup
```
{% endtab %}
{% endtabs %}

Eager loading only works one level deep. If you have **nested relations** and you want to prefetch relations of all children, you can instead add a query filter as described below. Use it to simply access all relation properties, which triggers them to lookup there values as described above.

## Query filters

{% hint style="info" %}
Only Java/Kotlin. For Dart, use the built-in [`where()`](https://api.dart.dev/stable/2.19.2/dart-core/Iterable/where.html) method.
{% endhint %}

Query filters come into play when you are looking for objects that need to match complex conditions, which cannot be fully expressed with the QueryBuilder class. Filters are written in Java and thus can express any complexity. Needless to say, that database conditions can be matched more efficiently than Java-based filters. Thus you will get the best results when you use both together:

1. Narrow down results using standard database conditions to a reasonable number (use QueryBuilder to get “candidates”)
2. Now filter those candidates using the [QueryFilter](https://objectbox.io/docfiles/java/current/io/objectbox/query/QueryFilter.html) Java interface to identify final results

A QueryFilter implementation looks at one candidate object at a time and returns true if the candidate is a result or false if not.

Example:

```java
// Reduce object count to reasonable value.
songBox.query(Song_.bandId.equal(bandId))
        // Filter is performed on candidate objects.
        .filter((song) -> song.starCount * 2 > song.downloads);
```

Notes on performance: 1) ObjectBox creates objects very fast. 2) The virtual machine is tuned to garbage collect short-lived objects. Notes 1) and 2) combined makes a case for filtering because ObjectBox creates candidate objects of which some are not used and thus get garbage collected quickly after their creation.

### Query filters and ToMany relation

The ToMany class offers additional methods that can be convenient in query filters:

* hasA: returns true if one of the elements matches the given QueryFilter
* hasAll: returns true if all of the elements match the given QueryFilter
* getById: return the element with the given ID (value of the property with the @Id annotation)

## Debug queries

To see what query is actually executed by ObjectBox:

{% tabs %}
{% tab title="Java" %}
```java
// Set the LOG_QUERY_PARAMETERS debug flag
BoxStore store = MyObjectBox.builder()
    .debugFlags(DebugFlags.LOG_QUERY_PARAMETERS)
    .build();
    
// Execute a query
query.find();
```
{% endtab %}

{% tab title="Kotlin" %}
```kotlin
// Set the LOG_QUERY_PARAMETERS debug flag
val store = MyObjectBox.builder()
    .debugFlags(DebugFlags.LOG_QUERY_PARAMETERS)
    .build()
    
// Execute a query
query.find()
```
{% endtab %}

{% tab title="Dart" %}
```dart
print(query.describeParameters());
```
{% endtab %}
{% endtabs %}

Then in your console (or logcat on Android) you will see log output like:

```
Parameters for query #2:
(firstName ==(i) "Joe"
 AND age < 12)
```
