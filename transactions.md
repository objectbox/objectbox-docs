---
description: >-
  ObjectBox is a fully transactional database satisfying ACID properties.
  ObjectBox database gives you an easy way to develop safe and efficient data
  applications; single or multi-threaded.
---

# Transactions

## ObjectBox - Transactions

A transaction can group several operations into a single unit of work that either executes completely or not at all. If you are looking for a more detailed introduction to transactions in general, please consult other resources like Wikipedia on [database transactions](https://en.wikipedia.org/wiki/Database\_transaction). For ObjectBox transactions continue reading:

You may not notice it, but almost all interactions with ObjectBox involve transactions. For example, if you call `put` a write transaction is used. Also if you `get` an object or query for objects, a read transaction is used. All of this is done under the hood and transparent to you. It may be fine to completely ignore transactions altogether in your app without running into any problems. With more complex apps however, it’s usually worth learning transaction basics to make your app more consistent and efficient.

## TL;DR - a quick summary on Transactions

* Accessing data always happens inside an implicit transaction, the API hides this detail for convenience.
* You should use an explicit transaction for non-trivial operations for better speed and atomicity.
* Transactions manage multi-threading; e.g. a transaction is tied to a thread and vice versa.
* Read(-only) transactions never get blocked or block a write transaction.
* There can only be a single write transaction at any time; they run strictly one after the other (sequential).
* Sequential execution simplifies user code that is run in write transactions and makes it safer.
* Keep write transactions short to optimize throughput, e.g. prepare data before entering it.

## Explicit Transactions

We learned that all ObjectBox operations run in implicit transactions – unless an explicit transaction is in progress. In the latter case, multiple operations share the (explicit) transaction. In other words, with explicit transactions, you control the transaction boundary. Doing so can greatly improve efficiency and consistency in your app.

The advantage of explicit transactions over the bulk put operations is that you can perform any number of operations and use objects of multiple boxes. In addition, you get a consistent (transactional) view on your data while the transaction is in progress.

Example for a write transaction:

{% tabs %}
{% tab title="Java, Kotlin" %}
The class [BoxStore](https://objectbox.io/docfiles/java/current/io/objectbox/BoxStore.html) offers the following methods to perform explicit transactions:

* **runInTx:** Runs the given runnable inside a transaction.
* **runInReadTx:** Runs the given runnable inside a read(-only) transaction. Unlike write transactions, multiple read transactions can run at the same time.
* **runInTxAsync:** Runs the given Runnable as a transaction in a separate thread. Once the transaction completes the given callback is called (callback may be null).
* **callInTx:** Like runInTx(Runnable), but allows returning a value and throwing an exception.

```java
boxStore.runInTx(() -> {
   for(User user: allUsers) {
     if(modify(user)) box.put(user);
     else box.remove(user);
   }
});
```


{% endtab %}

{% tab title="Python" %}
The `Store` class provides `read_tx` and `write_tx` methods for creating read/write transactions which should be called in a `with` statement:

```python
with store.write_tx():
    for user in allUsers:
        if modify(user):
            box.put(user)
        else:
            box.remove(user)
```
{% endtab %}
{% endtabs %}

## Transaction Costs

Understanding transactions is essential to master database performance. If you just remember one sentence on this topic, it should be this one: a write transaction has its price.

Committing a transaction involves syncing data to physical storage, which is a relatively expensive operation for databases. Only when the file system confirms that all data has been stored in a durable manner (not just memory cached), the transaction can be considered successful. This file sync required by a transaction may take a couple of milliseconds. Keep this in mind and try to group several operations (e.g.`put`calls) in one transaction.

Consider this example:

```java
for(User user: allUsers) {
   modify(user); // modifies properties of given user
   box.put(user);
}
```

Do you see what’s wrong with that code? There is an implicit transaction for each user which is very inefficient, especially for a high number of objects. It is much more efficient to use one of the put overloads to store all users at once:

```java
for(User user: allUsers) {
   modify(user); // modifies properties of given user
}
box.put(allUsers);
```

Much better! If you have 1,000 users, the latter example uses a single transaction to store all users. The first code example uses 1,000 (!) implicit transactions, causing a massive slow down.

## Read Transactions

In ObjectBox, read transactions are cheap. In contrast to write transactions, there is no commit and thus no expensive sync to the file system. Operations like `get` , `count` , and queries run inside an implicit read transaction if they are not called when already inside an explicit transaction (read or write). Note that it is illegal to `put`  when inside a read transaction: an exception will be thrown.

While read transactions are much cheaper than write transactions, there is still some overhead to starting a read transaction. Thus, for a high number of reads (e.g. hundreds, in a loop), you can improve performance by grouping those reads in a single read transaction (see explicit transactions below).

## Multiversion Concurrency

ObjectBox gives developers [Multiversion concurrency control (MVCC)](https://en.wikipedia.org/wiki/Multiversion\_concurrency\_control) semantics. This allows multiple concurrent readers (read transactions) which can execute immediately without blocking or waiting. This is guaranteed by storing multiple versions of (committed) data. Even if a write transaction is in progress, a read transaction can read the last consistent state immediately. Write transactions are executed sequentially to ensure a consistent state. Thus, it is advised to keep write transactions short to avoid blocking other pending write transactions. For example, it is usually a bad idea to do networking or complex calculations while inside a write transaction. Instead, do any expensive operation and prepare objects before entering a write transaction.

Note that you do not have to worry about making write transactions sequential yourself. If multiple threads want to write at the same time (e.g. via  `put` or  `runInTx`), one of the threads will be selected to go first, while the other threads have to wait. It works just like a lock or `synchronized` in Java.

### Locking inside a Write Transaction

Avoid locking (e.g. via `synchronized` or `java.util.concurrent.locks`) when inside a write transaction when possible. Because write transactions run exclusively, they effectively acquire a write lock internally. As with all locks, you need to pay close attention when multiple locks are involved. Always obtain locks in the same order to avoid deadlocks. If you acquire a lock “X” inside a transaction, you must ensure that your code does not start another write transaction while having the lock “X”.
