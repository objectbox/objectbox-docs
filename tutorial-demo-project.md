---
description: Learn how to build a simple note-taking app with ObjectBox.
---

# Tutorial: Demo Project

This tutorial will walk you through a simple note-taking app explaining how to do basic operations with ObjectBox. To just integrate ObjectBox into your project, look at the [Getting Started](getting-started.md) page.

You can check out the example code from GitHub. This allows you to run the code and explore it in its entirety. It is a simple app for taking notes where you can add new notes by typing in some text and delete notes by clicking on an existing note.

{% tabs %}
{% tab title="Java" %}
```bash
git clone https://github.com/objectbox/objectbox-examples.git
cd objectbox-examples/android-app
```
{% endtab %}

{% tab title="Kotlin" %}
```bash
git clone https://github.com/objectbox/objectbox-examples.git
cd objectbox-examples/android-app-kotlin
```
{% endtab %}

{% tab title="Dart" %}
```bash
git clone https://github.com/objectbox/objectbox-dart.git
cd objectbox-dart/objectbox/examples/flutter/objectbox_demo
```
{% endtab %}

{% tab title="Python" %}
```sh
git clone https://github.com/objectbox/objectbox-python.git
cd objectbox-python
```
{% endtab %}
{% endtabs %}

## The Note entity and Box class

To store notes there is an entity class called `Note` (or `Task` in Python). It defines the structure or model of the data persisted (saved) in the database for a note: its id, the note text and the creation date.

{% tabs %}
{% tab title="Java" %}
{% code title="src/Note.java" %}
```java
@Entity
public class Note {
    
    @Id
    long id;
    
    String text;
    String comment;
    Date date;
    
    ...
}
```
{% endcode %}
{% endtab %}

{% tab title="Kotlin" %}
{% code title="src/Note.kt" %}
```kotlin
@Entity
data class Note(
        @Id var id: Long = 0,
        var text: String? = null,
        var comment: String? = null,
        var date: Date? = null
)
```
{% endcode %}
{% endtab %}

{% tab title="Dart" %}
{% code title="lib/model.dart" %}
```dart
@Entity()
class Note {
  int id;
  String text;
  String? comment;
  DateTime date;

  ...
}
```
{% endcode %}
{% endtab %}

{% tab title="Python" %}
{% code title="example/tasks/main.py" %}
```python
@Entity()
class Task:
    id = Id()
    text = String()
    date_created = Date(py_type=int)
    date_finished = Date(py_type=int)
```
{% endcode %}
{% endtab %}
{% endtabs %}

In general, an ObjectBox _entity_ is an annotated class persisted in the database with its properties. In order to extend the note or to create new entities, you simply modify or create new plain classes and annotate them with `@Entity` and `@Id;` in Python opt-in `uid` argument i.e. `@Entity(uid=)`.&#x20;

{% content-ref url="entity-annotations.md" %}
[entity-annotations.md](entity-annotations.md)
{% endcontent-ref %}

{% tabs %}
{% tab title="Java" %}
Go ahead and build the project, for example by using **Build > Make project** in Android Studio. This triggers ObjectBox to generate some classes, like `MyObjectBox.java`, and some other classes used by ObjectBox internally.
{% endtab %}

{% tab title="Kotlin" %}
Go ahead and build the project, for example by using **Build > Make project** in Android Studio. This triggers ObjectBox to generate some classes, like `MyObjectBox.kt`, and some other classes used by ObjectBox internally.
{% endtab %}

{% tab title="Dart" %}
Before running the app, run the ObjectBox code generator to create binding code for the entity classes: `flutter pub run build_runner build`&#x20;

Also re-run this after changing the note class.
{% endtab %}

{% tab title="Python" %}
```
# Make sure to install objectbox >= 4.0.0
$ pip install --upgrade objectbox
$ ls example
ollama 
tasks
vectorsearch-cities

$ cd tasks
$ python main.py

Welcome to the ObjectBox tasks-list app example. Type help or ? for a list of commands.
> 
```
{% endtab %}
{% endtabs %}

### Inserting notes

To see how new notes are added to the database, take a look at the following code fragments. The `Box` provides database operations for `Note` objects. A Box is the main interaction with object data.

{% tabs %}
{% tab title="Java" %}
{% code title="NoteActivity.java" %}
```java
@Override
public void onCreate(Bundle savedInstanceState) {
    ...
    notesBox = ObjectBox.get().boxFor(Note.class);
    ...
}
```
{% endcode %}

{% hint style="info" %}
Note: In the example project, `ObjectBox` is the name of a helper class to set up and keep a reference to `BoxStore`.
{% endhint %}
{% endtab %}

{% tab title="Kotlin" %}
{% code title="NoteActivity.kt" %}
```kotlin
public override fun onCreate(savedInstanceState: Bundle?) {
    ...
    notesBox = ObjectBox.boxStore.boxFor()
    ...
}
```
{% endcode %}

{% hint style="info" %}
Note: In the example project, `ObjectBox` is the name of a helper class to set up and keep a reference to `BoxStore`.
{% endhint %}
{% endtab %}

{% tab title="Dart" %}
{% code title="lib/objectbox.dart" %}
```dart
class ObjectBox {
  late final Store _store;
  late final Box<Note> _box;
  
  ObjectBox._create(this._store) {
    _noteBox = Box<Note>(_store);
    ...
```
{% endcode %}
{% endtab %}

{% tab title="Python" %}
{% code title="example/tasks/main.py" %}
```python
class TasklistCmd(Cmd):
    # ...

    def __init__(self):
        # ...
        self._store = Store(directory="tasklist-db")
        self._task_box = self._store.box(Task)
```
{% endcode %}
{% endtab %}
{% endtabs %}

When a user adds a note the method `addNote()` is called. There, a new `Note` object is created and put into the database using the `Box` reference:

{% tabs %}
{% tab title="Java" %}
{% code title="NoteActivity.java" %}
```java
private void addNote() {
    ...
    Note note = new Note();
    note.setText(noteText);
    note.setComment(comment);
    note.setDate(new Date());
    notesBox.put(note);
    Log.d(App.TAG, "Inserted new note, ID: " + note.getId());
    ...
}
```
{% endcode %}
{% endtab %}

{% tab title="Kotlin" %}
{% code title="NoteActivity.kt" %}
```kotlin
private fun addNote() {
    ...
    val note = Note(text = noteText, comment = comment, date = Date())
    notesBox.put(note)
    Log.d(App.TAG, "Inserted new note, ID: " + note.id)
    ...
}
```
{% endcode %}
{% endtab %}

{% tab title="Dart" %}
{% code title="lib/objectbox.dart" %}
```dart
Future<void> addNote(String text) => _noteBox.putAsync(Note(text));
```
{% endcode %}
{% endtab %}

{% tab title="Python" %}
{% code title="example/tasks/main.py" %}
```python
def add_task(self, text: str):
    task = Task(text=text, date_created=now_ms())
    self._task_box.put(task)
```
{% endcode %}
{% endtab %}
{% endtabs %}

Note that the ID property (0 when creating the `Note` object), is assigned by ObjectBox during a put.

### Removing/deleting notes

When the user taps a note, it is deleted. The `Box` provides `remove()` to achieve this:

{% tabs %}
{% tab title="Java" %}
{% code title="NoteActivity.java" %}
```java
OnItemClickListener noteClickListener = new OnItemClickListener() {
    @Override
    public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
        Note note = notesAdapter.getItem(position);
        notesBox.remove(note);
        Log.d(App.TAG, "Deleted note, ID: " + note.getId());
        ...
    }
};
```
{% endcode %}
{% endtab %}

{% tab title="Kotlin" %}
{% code title="NoteActivity.kt" %}
```kotlin
private val noteClickListener = OnItemClickListener { _, _, position, _ ->
    notesAdapter.getItem(position)?.also {
        notesBox.remove(it)
        Log.d(App.TAG, "Deleted note, ID: " + it.id)
    }
    ...
}
```
{% endcode %}
{% endtab %}

{% tab title="Dart" %}
{% code title="lib/objectbox.dart" %}
```dart
Future<void> removeNote(int id) => _noteBox.removeAsync(id);
```
{% endcode %}
{% endtab %}

{% tab title="Python" %}
{% code title="example/tasks/main.py" %}
```python
def remove_task(self, task_id: int) -> bool:
    is_removed = self._task_box.remove(task_id)
    return is_removed
```
{% endcode %}
{% endtab %}
{% endtabs %}

### Querying notes

To query and display notes in a list a `Query` instance is built once:

{% tabs %}
{% tab title="Java" %}
{% code title="NoteActivity.java" %}
```java
@Override
public void onCreate(Bundle savedInstanceState) {
    ...
    // Query all notes, sorted a-z by their text.
    notesQuery = notesBox.query().order(Note_.text).build();
    ...
}
```
{% endcode %}
{% endtab %}

{% tab title="Kotlin" %}
{% code title="NoteActivity.kt" %}
```kotlin
public override fun onCreate(savedInstanceState: Bundle?) {
    ...
    // Query all notes, sorted a-z by their text.
    notesQuery = notesBox.query {
        order(Note_.text)
    }
    ...
}
```
{% endcode %}
{% endtab %}

{% tab title="Dart" %}
{% code title="lib/objectbox.dart" %}
```dart
Stream<List<Note>> getNotes() {
  // Query for all notes, sorted by their date.
  // https://docs.objectbox.io/queries
  final builder = _noteBox.query().order(Note_.date, flags: Order.descending);
  ...
```
{% endcode %}
{% endtab %}

{% tab title="Python" %}
{% code title="example/tasks/main.py" %}
```python
def __init__(self):
    # ...
    self._query = self._task_box.query().build()
```
{% endcode %}
{% endtab %}
{% endtabs %}

And then executed each time any notes change:

{% tabs %}
{% tab title="Java" %}
{% code title="NoteActivity.java" %}
```java
private void updateNotes() {
    List<Note> notes = notesQuery.find();
    notesAdapter.setNotes(notes);
}
```
{% endcode %}
{% endtab %}

{% tab title="Kotlin" %}
{% code title="NoteActivity.kt" %}
```kotlin
private fun updateNotes() {
    val notes = notesQuery.find()
    notesAdapter.setNotes(notes)
}
```
{% endcode %}
{% endtab %}

{% tab title="Dart" %}
{% code title="lib/objectbox.dart" %}
```dart
  ...
  // Build and watch the query,
  // set triggerImmediately to emit the query immediately on listen.
  return builder
      .watch(triggerImmediately: true)
      // Map it to a list of notes to be used by a StreamBuilder.
      .map((query) => query.find());
}
```
{% endcode %}
{% endtab %}

{% tab title="Python" %}
{% code title="example/tasks/main.py" %}
```python
def find_tasks(self):
    return self._query.find()
```
{% endcode %}

{% hint style="info" %}
You can also use `self._task_box.get_all()` to get all Task objects without any condition (instead of building a query).
{% endhint %}
{% endtab %}
{% endtabs %}

In addition to a result sort order, you can add various conditions to filter the results, like equality or less/greater than, when building a query.

{% content-ref url="queries.md" %}
[queries.md](queries.md)
{% endcontent-ref %}

### Updating notes and more

What is not shown in the example, is how to update an existing (== the ID is not 0) note. Do so by just modifying any of its properties and then put it again with the changed object:

{% tabs %}
{% tab title="Java" %}
```java
note.setText("This note has changed.");
notesBox.put(note);
```
{% endtab %}

{% tab title="Kotlin" %}
```kotlin
note.text = "This note has changed."
notesBox.put(note)
```
{% endtab %}

{% tab title="Dart" %}
```dart
note.text = "This note has changed.";
_noteBox.putAsync(note);
```
{% endtab %}

{% tab title="Python" %}
```python
task.text = "This task has changed."
self._task_box.put(task)
```
{% endtab %}
{% endtabs %}

There are **additional methods to put, find, query, count or remove** entities. Check out the methods of the Box class in API docs (for [Java/Kotlin](https://objectbox.io/docfiles/java/current/io/objectbox/Box.html) or [Dart](https://pub.dev/documentation/objectbox/latest/objectbox/Box-class.html)) to learn more.

{% content-ref url="getting-started.md" %}
[getting-started.md](getting-started.md)
{% endcontent-ref %}

## Setting up the database

Now that you saw ObjectBox in action, how did we get that database (or store) instance? Typically you should set up a BoxStore or Store once for the whole app. This example uses a [helper class as recommended in the Getting Started guide](getting-started.md#core-initialization).

{% content-ref url="getting-started.md" %}
[getting-started.md](getting-started.md)
{% endcontent-ref %}

Remember: ObjectBox is a NoSQL database on its own and thus NOT based on SQL or SQLite. That’s why you do not need to set up “CREATE TABLE” statements during initialization.

{% hint style="info" %}
Note: it is perfectly fine to never close the database. That’s even recommended for most apps.
{% endhint %}

## More In-Depth Tutorials

🌿 [Learn how to build a Food Sharing app with ObjectBox in Flutter/Dart](https://youtube.com/playlist?list=PLZQbl9Jhl-VCUWJh3969Oxt8ykDzUlQMR)
