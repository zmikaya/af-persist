# AutoForm Persist

This set of modules is designed to enhance Meteor AutoForm. It wraps an AutoForm component and creates a local store using PouchDB in order to establish local persistence.

## Getting Started

Since this is not an NPM package currently, you will need to manually install a few packages.

### Installing
```
meteor npm install --save pouchdb-browser pouchdb-upsert underscore
```
```
meteor add reactive-var
```

### Usage

Use the autoFormPersist component as follows:

```
{{#autoFormPersist atts}}<body content>{{/autoFormPersist}}
```

**Note that documents must have an "updatedAt" field in order to prioritize the remote database appropriately.**

Some examples are below.

Example 1: Insert quickForm
```
<template name="insertForm">
  {{#autoFormPersist
    collection=collection
    doc=doc
    id="insertForm"
    type="insert"
  }}
	  {{> afQuickField name="name"  placeholder="Name"}}
  {{/autoFormPersist}}
</template>
```

Example 2: Update quickForm

```
<template name="updateForm">
  {{#autoFormPersist
    collection=collection
    doc=doc
    id="updateForm"
    type="update"
  }}
	  {{> afQuickField name="name"  placeholder="Name"}}
  {{/autoFormPersist}}
</template>
```

## Authors

* **Zach Mikaya** - *On Behalf Of* - [essaypop](https://www.essaypop.com)
