---
description: >-
  LiveData is an observable data holder class. Learn to use ObjectBox database
  with LiveData from Android Architecture Components.
---

# LiveData (Arch. Comp.)

## ObjectBox - LiveData with Android Architecture Components

{% hint style="info" %}
Since 1.2.0. Have a look at [the example project on GitHub](https://github.com/objectbox/objectbox-examples/tree/master/android-app-arch).
{% endhint %}

As an alternative to ObjectBox’ [data observers and reactive queries](../data-observers-and-rx.md#objectbox-data-observers-and-reactive-extensions), you can opt for the [LiveData](https://developer.android.com/topic/libraries/architecture/livedata.html) approach supplied by Android Architecture Components. ObjectBox comes with  `ObjectBoxLiveData`, a class that can be used inside your [ViewModel](https://developer.android.com/topic/libraries/architecture/viewmodel.html) classes.

A simple ViewModel implementation for our note example app includes the special `ObjectBoxLiveData` that is constructed using a regular [ObjectBox query](../queries.md):

```java
public class NoteViewModel extends ViewModel {
    
    private ObjectBoxLiveData<Note> noteLiveData;
    
    public ObjectBoxLiveData<Note> getNoteLiveData(Box<Note> notesBox) {
        if (noteLiveData == null) {
            // query all notes, sorted a-z by their text
            noteLiveData = new ObjectBoxLiveData<>(notesBox.query().order(Note_.text).build());
        }
        return noteLiveData;
    }
}
```

Note that we did choose to pass the box to `getNoteLiveData()` . Instead you could use `AndroidViewModel` , which provides access to the `Application`  context, and then call  `((App)getApplication()).getBoxStore().boxFor()`  inside the ViewModel. However, the first approach has the advantage that our ViewModel  has no reference to Android classes. This makes it easier to unit test.

Now, when creating the activity or fragment we get the ViewModel, access its LiveData and finally register to observe changes:

```java
NoteViewModel model = ViewModelProviders.of(this).get(NoteViewModel.class);
model.getNoteLiveData(notesBox).observe(this, new Observer<List<Note>>() {
    @Override
    public void onChanged(@Nullable List<Note>; notes) {
        notesAdapter.setNotes(notes);
    }
});
```

The ObjectBoxLiveData will now subscribe to the query and notify observers when the results of the query change, if there is at least one observer. In this example the activity is notified if a note is added or removed. If all observers are destroyed, the LiveData will cancel the subscription to the query.

If you have used [ObjectBox observers](../data-observers-and-rx.md#objectbox-data-observers-and-reactive-extensions) in the past this might sound familiar. Well, because it is! ObjectBoxLiveData just wraps a DataObserver on the query you give to it.
