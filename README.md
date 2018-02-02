

# AutoForm Persist

This set of modules is designed to enhance Meteor AutoForm. It wraps an existing AutoForm and creates a local store using PouchDB in order to establish local persistence.

## Getting Started

Since this is not an NPM package currently, you will need to manually install a few packages.

### Installing
```
meteor npm install --save pouchdb-browser pouchdb-upsert underscore
```
```
meteor add session
```

### Usage

The AutoFormPersist module can wrap an AutoForm quickForm and has a signature as follows:

```
// The docId should only be added for type='update' forms.
AutoFormPersist(template, formId, collection, [docId]);
```

Some examples are below.

Example 1: Insert quickForm
```
<template name="insertForm">
  {{> quickForm
    collection=collection
    doc=doc
    id="insertForm"
    omitFields=omitFields
    type="insert"
  }}
</template>

AutoFormPersist(Template.insertForm, 'insertForm', collection);
```

Example 2: Update quickForm

```
<template name="updateForm">
  {{> quickForm
    autosave=true
    collection=collection
    doc=doc
    id="updateForm"
    omitFields=omitFields
    type="update"
  }}
</template>

AutoFormPersist(Template.updateForm, 'updateForm', collection, docId);
```

## Authors

* **Zach Mikaya** - *On Behalf Of* - [essaypop](https://www.essaypop.com)
