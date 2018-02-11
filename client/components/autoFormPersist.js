/* eslint-disable func-names */
/* eslint-disable no-underscore-dangle */

import { AutoForm } from 'meteor/aldeed:autoform';
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
});

Template.autoFormPersist.helpers({
  autoFormAtts() {
    const { doc, type } = this;
    const instance = Template.instance();
    const { afPersist } = instance;
    const storeDoc = instance.storeDoc.get();
    const formDoc = afPersist.getFormDoc(doc, storeDoc, type);
    afPersist.submitFormDoc(instance);
    return {
      ...this,
      doc: afPersist.isLoadingStoreDoc ? {} : formDoc,
    };
  },
});

Template.autoFormPersist.onCreated(function () {
  const { data } = this;
  const afPersist = AutoFormPersist(data.id, data.doc._id);
  this.afPersist = afPersist;
  this.storeDocId = afPersist.storeDocId;
  this.storeDoc = new ReactiveVar({});
  afPersist.getStoreDoc(storeDoc => this.storeDoc.set(storeDoc));
});
