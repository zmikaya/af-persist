import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';
import _ from 'underscore';

import AutoFormPersist from '../af-persist';
import './autoFormPersist.html';

Template.autoFormPersist.events({
  'keyup form': () => {
    const instance = Template.instance();
    const doc = AutoForm.getFormValues(instance.data.id);
    instance.afPersist.formPersist.upsert(instance.storeDocId, doc);
  },
})

Template.autoFormPersist.helpers({
  autoFormAtts() {
    const { doc, type } = this;
    const { afPersist } = Template.instance();
    const storeDoc = Template.instance().storeDoc.get();
    const formDoc = _.isEmpty(storeDoc) ? null : afPersist.getFormDoc(doc, storeDoc, type);
    return {
      ...this,
      doc: formDoc,
    }
  },
});

Template.autoFormPersist.onCreated(function() {
  const { data } = this;
  const afPersist = AutoFormPersist(data.id, data.doc._id);
  this.afPersist = afPersist;
  this.storeDocId = afPersist.storeDocId;
  this.storeDoc = new ReactiveVar({});
  afPersist.getStoreDoc(storeDoc => this.storeDoc.set(storeDoc));
});
