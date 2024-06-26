---
description: >-
  How to observe box and query changes using ObjectBox for Java, how to
  integrate with RxJava.
---

# Data Observers & Rx

On this page:

* &#x20;[ObjectBox for Java  - Data Observers and Reactive Extensions](data-observers-and-rx.md#objectbox-for-java-data-observers-and-reactive-extensions)
* [ ObjectBox for Flutter/Dart - Reactive Queries](data-observers-and-rx.md#flutter-dart)

## ObjectBox for Java  - Data Observers and Reactive Extensions

ObjectBox for Java makes it easy for your app to react to data changes by providing:

* data observers,
* reactive extensions,
* and an optional library to work with RxJava.

This makes setting up data flows easy while taking care of threading details.

## Reactive Observers: A First Example

&#x20;Let’s start with an example to demonstrate what you can do with reactive data observers:

```java
// Keep a reference until the subscription is cancelled
// to avoid garbage collection.
private DataSubscription subscription;

// ...

// Build a regular query.
Query<Task> query = taskBox.query().equal(Task_.complete, false).build();
// Subscribe to its results.
subscription = query.subscribe()
     .on(AndroidScheduler.mainThread())
     .observer(data -> updateResultDisplay(data));

// Cancel to no longer receive updates (e.g. leaving screen).
subscription.cancel();

private void updateResultDisplay(List<Task> tasks) {
   // Do something with the given tasks.
}
```

The first line creates a regular query to get `Task` objects where `task.complete == false`. The second line connects an observer to the query. This is what happens:

* the query is executed in the background
* once the query finishes the observer gets the result data
* whenever changes are made to `Task` objects in the future, the query will be executed again
* once updated query results are in, they are propagated to the observer
* the observer is called on Android’s main thread

Now, let’s dive into the details.

## Data Observers Basics

When objects change, ObjectBox notifies subscribed data observers. They can either subscribe to changes of certain object types (via BoxStore) or to query results. To create a data observer you need to implement the generic `io.objectbox.reactive.DataObserver` interface:

```java
public interface DataObserver<T> {
    void onData(T data);
}
```

This observer will be called by ObjectBox when necessary: typically shortly after subscribing and when data changes.

{% hint style="info" %}
&#x20;Note: `onData()` is called asynchronously and decoupled from the thread causing the data change (like the thread that committed a transaction).
{% endhint %}

### Observing General Changes

`BoxStore` allows a `DataObserver` to subscribe to object types. Let’s say we have a to-do list app where `Task` objects get added. To get notified when `Task` objects are added in another place in our app we can do the following:&#x20;

{% tabs %}
{% tab title="Java" %}
```java
DataObserver<Class<Task>> observer = new DataObserver<Class<Task>>() {
    @Override public void onData(Class<Task> data) {
        // TODO Do something, e.g. run a query.
        // Just observing a query can also be done 
        // more easily, read on!
        List<Task> results = store.boxFor(Task.class)
            .query(Task_.text.contains("TODO"))
            .build()
            .find(offset, limit);
    }
};
// Keep the subscription while used 
// to avoid garbage collection of the observer.
subscription = boxStore.subscribe(Task.class).observer(observer);
```
{% endtab %}

{% tab title="Kotlin" %}
```kotlin
val observer = object : DataObserver<Class<Task>> {
    override fun onData(data: Class<Task>) {
        // TODO Do something, e.g. run a query.
        // Just observing a query can also be done 
        // more easily, read on!
        val results = store.boxFor(Task::class)
            .query(Task_.text.contains("TODO"))
            .build()
            .find(offset, limit)
    }
}
// Keep the subscription while used 
// to avoid garbage collection of the observer.
subscription = store.subscribe(Task::class.java).observer(observer)
```
{% endtab %}
{% endtabs %}

Here `onData()` is not called with anything useful as data. If you need more than being notified, like to get a list of `Task` objects following the above example, read on to learn how to observe queries.

{% hint style="info" %}
Note: there is also `subscribe()` which takes no arguments. It subscribes the observer to receive changes for all available object classes.
{% endhint %}

### Observing Queries

ObjectBox let’s you [build queries](queries.md) to find the objects matching certain criteria. Queries are an essential part of ObjectBox: whenever you need a specific set of data, you will probably use a query.

Combining queries and observers results in a convenient and powerful tool: query observers will automatically deliver fresh results whenever changes are made to entities in a box. Let’s say you display a list of to-do tasks in your app. You can use a DataObserver to get all tasks that are not yet completed and pass them to a method updateUi()  (note that we are using lambda syntax here):

```java
Query<Task> query = taskBox.query().equal(Task_.completed, false).build();
subscription = query.subscribe().observer(data -> updateResultDisplay(data));
```

So when is our observer lambda called? Immediately when an observer is subscribed, the query will be run in a separate thread. Once the query result is available, it will be passed to the observer. This is the first call to the observer.

Now let’s say a task gets changed and stored in ObjectBox. It doesn't matter where and how; it might be the user who marked a task as completed, or some backend thread putting additional tasks during synchronization with a server. In any case, the query will notify all observers with (potentially) updated query results.

Note that this pattern can greatly simplify your code: there is a single place where your data comes in to update your user interface. There is no separate initialization code, no wiring of events, no re-running queries, etc.

See the [subscribe()-method](https://objectbox.io/files/objectbox-java/current/io/objectbox/query/Query.html) documentation for more details.

### Canceling Subscriptions

&#x20;When you call `observer()`, it returns a subscription object implementing the `io.objectbox.reactive.DataSubscription` interface:

```java
public interface DataSubscription {
    void cancel();
    boolean isCanceled();
}
```

Keep a reference to the `DataSubscription` for as long as results should be received, otherwise it can be garbage collected at any point. Also call `cancel()` on it once the observer should not be notified anymore, e.g. when leaving the current screen:

```java
// Keep a reference for as long as updates should be received.
DataSubscription subscription = boxStore.subscribe().observer(myObserver);

// To no longer receive updates (e.g. leaving screen):
subscription.cancel();
```

If you have more than one query subscription, you might find it useful to create a  `DataSubscriptionList` instance instead to keep track of multiple  `DataSubscription` objects. Pass the list to the `query.subscribe(subList)` overload. A basic example goes like this:

```java
private DataSubscriptionList subscriptions = new DataSubscriptionList();

protected void onStart() {
  super.onStart();
  Query<A> queryA = boxA.query().build();
  queryA.subscribe(subscriptions).observe(someObserverForAs);
  Query<B> queryB = boxB.query.build();
  queryB.subscribe(subscriptions).observe(someObserverForBs);
}

protected void onStop() {
  super.onStop();
  // Cancels both subscriptions (for A and B).
  subscriptions.cancel();
}
```

{% hint style="info" %}
&#x20;Note: On Android, you would typically create the subscription in one of the `onCreate()/onStart()/onResume()` lifecycle methods and cancel it in its counterpart  `onDestroy()/onStop()/onPause()`.
{% endhint %}

### Observers and Transactions

&#x20;Observer notifications occur after a transaction is committed. For some scenarios it is especially important to know transaction bounds. If you call `box.put()` or `remove()` individually, an implicit transaction is started and committed. For example, this code fragment would trigger data observers on `User.class` twice:

```java
box.put(friendUser);
box.put(myUser);

// Log:
// User friendUser put.
// Observers of User called.
// User myUser put.
// Observers of User called.
```

&#x20;There are several ways to combine several operations into one transaction, for example using one of the `runInTx()` or `callInTx()` methods in the BoxStore class. For our simple example, we can simply use an overload of `put()` accepting multiple objects:

```java
box.put(friendUser, myUser);

// Log:
// Users friendUser and myUser put.
// Observers of User called.
```

&#x20;This results in a single transaction and thus in a single `DataObserver` notification.

## Reactive Extensions

&#x20;In the first part you saw how data observers can help you keep your app state up to date. But there is more: ObjectBox comes with simple and convenient reactive extensions for typical tasks. While most of these are inspired by RxJava, they are not actually based on RxJava. ObjectBox brings its own features because not all developers are familiar with RxJava (for the RxJava ObjectBox library see below). We do not want to impose the complexity (Rx is almost like a new language to learn) and size of RxJava (\~10k methods) on everyone. So, let’s keep it simple and neat for now.

### Thread Scheduling

&#x20;On Android, UI updates must occur on the main thread only. Luckily, ObjectBox allows to switch the observer from a background thread over to the main thread. Let’s take a look on a revised version of the to-do task example from above:

```java
Query<Task> query = taskBox.query().equal(Task_.complete, false).build();
// updateResultDisplay is always called on the Android main thread.
subscription = query.subscribe()
    .on(AndroidScheduler.mainThread())
    .observer(data -> updateResultDisplay(data));
```

&#x20;Where is the difference? The additional `on()` call is all that is needed to tell where we want our observer to be called. `AndroidScheduler.mainThread()` is a built-in scheduler implementation. Alternatively, you can create an `AndroidScheduler` using a custom `Looper`, or build a fully custom scheduler by implementing the `io.objectbox.reactive.Scheduler` interface.

### Transforming Data

&#x20;Maybe you want to transform the data before you hand it over to an observer. Let’s say, you want to keep track of the count of all stored objects for each type. The BoxStore subscription gives you the classes of the objects, and this example shows you how to transform them into actual object counts:

```java
subscription = boxStore.subscribe()
    .transform(clazz -> return boxStore.boxFor(clazz).count())
    .observer(count -> updateCount(count));
```

Note that the transform operation takes a `Class` object and returns a `Long` number. Thus the `DataObserver` receives the object count as a `Long` parameter in `onData()`.

While the lambda syntax is nice and brief, let’s look at the `io.objectbox.reactive.Transformer` interface for clarification of what the `transform()` method expects as a parameter:

```java
public interface DataTransformer<FROM, TO> {
    TO transform(FROM source) throws Exception;
}
```

Some additional notes on transformers:

* Transforms are not required to actually “transform” any data. Technically, it is fine to return the same data that is received and just do some processing with (or without) it.
* Transformers are always executed asynchronously. It is fine to perform long lasting operations.

### ErrorObserver

&#x20;Maybe you noticed that a transformer may throw any type of exception. Also, a `DataObserver` might throw a `RuntimeException`. In both cases, you can provide an `ErrorObserver` to be notified about an exception that occurred. The `io.objectbox.reactive.ErrorObserver` is straight-forward:

```java
public interface ErrorObserver {
    void onError(Throwable th);
}
```

To specify your `ErrorObserver`, simply call the `onError()` method after `subscribe()`.

### Single Notifications vs. Only-Changes

When you subscribe to a query, the `DataObserver` gets both of the following by default:

* Initial query results (right after subscribing)
* Updated query results (underlying data was changed)

Sometimes you may by interested in only one of those. This is what the methods `single()` and `onlyChanges()` are for (call them after `subscribe()`). Single subscriptions are special in the way that they are cancelled automatically once the observer is notified. You can still cancel them manually to ensure no call to the observer is made at a certain point.

### Weak References

Sometimes it may be nice to have a weak reference to a data observer. Note that for the sake of a deterministic flow, it is advisable to cancel subscriptions explicitly whenever possible. If that does not scare you off, use `weak()` after `subscribe()`.

### Threading overview

To summarize threading as discussed earlier:

* Query execution runs on a background thread (exclusive for this task)
* `DataTransformer` runs on a background thread (exclusive for this task)
* `DataObserver` and `ErrorObserver` run on a background thread unless a scheduler is specified via the `on()` method.

## ObjectBox RxJava Extension Library

By design, there are zero dependencies on any Rx libraries in the core of ObjectBox. As you saw before ObjectBox gives you simple means to transform data, asynchronous processing, thread scheduling, and one time (single) notifications. However, you still might want to integrate with the mighty RxJava 2 (we have no plans to support RxJava 1). For this purpose we created the ObjectBox RxJava extension library:

```groovy
implementation "io.objectbox:objectbox-rxjava:$objectboxVersion"
```

It provides the classes `RxQuery` and `RxBoxStore`. Both offer static methods to subscribe using RxJava means.

For general object changes, you can use `RxBoxStore` to create an `Observable`. `RxQuery` allows to subscribe to query objects using:

* Flowable
* Observable
* Single

Example usage:

```java
// Keep a reference until the disposable is disposed
// to avoid garbage collection.
private Disposable disposable;

// ...

Query query = box.query().build();
disposable = RxQuery.observable(query).subscribe(this);
```

&#x20;The extension library is open-source and available [GitHub](https://github.com/objectbox/objectbox-java/tree/master/objectbox-rxjava).

## ObjectBox for Flutter/Dart - Reactive Queries <a href="#flutter-dart" id="flutter-dart"></a>

You can build a Stream from a query to get notified any time there is a change to the box of any of the queried entities:

```dart
Stream<Query<Note>> watchedQuery = box.query(condition).watch();
final sub1 = watchedQuery.listen((Query<Note> query) {
  // This gets triggered any time a box of any of the queried entities
  // has changes, e.g. objects are put or removed.
  // Call any query method here, for example:
  print(query.count());
  print(query.find());
});
...
sub1.cancel(); // Cancel the subscription after your code is done.
```

For a Flutter app you typically want to get the latest results immediately when listening to the stream, and also get a list of objects instead of a query instance:

```dart
// Build and watch the query,
// set triggerImmediately to emit the query immediately on listen.
return box.query(condition)
    .watch(triggerImmediately: true)
    // Map it to a list of objects to be used by a StreamBuilder.
    .map((query) => query.find());
```
