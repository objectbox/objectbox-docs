---
description: >-
  The Android Paging Library helps you load and display small data chunks at a
  time. Learn to use ObjectBox database with the Paging library from Android
  Architecture Components.
---

# Paging (Arch. Comp.)

{% hint style="info" %}
Since 2.0.0
{% endhint %}

ObjectBox supports integration with the [Paging library](https://developer.android.com/topic/libraries/architecture/paging/) that is part of Google's [Android Architecture Components](https://developer.android.com/topic/libraries/architecture/). To that end, the [ObjectBox Android library](../getting-started.md) (`objectbox-android`) provides the `ObjectBoxDataSource` class. It is an implementation of the Paging library's [`PositionalDataSource`](https://developer.android.com/reference/android/arch/paging/PositionalDataSource).

{% hint style="info" %}
Note: the following assumes that you have already [added and set up the Paging library](https://developer.android.com/topic/libraries/architecture/paging/) in your project.
{% endhint %}

### Using  ObjectBoxDataSource

Within your `ViewModel`, similar to [creating a `LiveData` directly](livedata-architecture-components.md), you first [build your ObjectBox query](../queries.md). But then, you construct an `ObjectBoxDataSource` factory with it instead. This factory is then passed to a `LivePagedListBuilder` to build the actual `LiveData`.

Here is an example of a `ViewModel` class doing just that:

```java
public class NotePagedViewModel extends ViewModel {
    
    private LiveData<PagedList<Note>> noteLiveDataPaged;
    
    public LiveData<PagedList<Note>> getNoteLiveDataPaged(Box<Note> notesBox) {
        if (noteLiveDataPaged == null) {
            // query all notes, sorted a-z by their text
            Query<Note> query = notesBox.query().order(Note_.text).build();
            // build LiveData
            noteLiveDataPaged = new LivePagedListBuilder<>(
                    new ObjectBoxDataSource.Factory<>(query),
                    20 /* page size */
            ).build();
        }
        return noteLiveDataPaged;
    }
}
```

Note that the `LiveData` holds your entity class, here `Note`, wrapped inside a `PagedList`. You observe the `LiveData` as usual in your activity or fragment, then submit the `PagedList` on changes to your `PagedListAdapter` of the Paging library.

We will not duplicate how this works here, see the [Paging library documentation](https://developer.android.com/topic/libraries/architecture/paging/) for details about this.

### Next steps

* Have a look at the [ObjectBox Architecture Components example code](https://github.com/objectbox/objectbox-examples/tree/master/android-app-arch).
* Check out [ObjectBox support for LiveData](livedata-architecture-components.md).
* Learn how to [build queries](../queries.md).
