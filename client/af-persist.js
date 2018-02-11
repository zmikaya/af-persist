/* eslint-disable no-underscore-dangle */

import { AutoForm } from 'meteor/aldeed:autoform';
import _ from 'underscore';

import FormPersist from './form-persist';

class AutoFormPersist {
  /*
    This class is interfaces with Meteor AutoForm forms.
    It provides a simple interface between AutoForm and the
    form persistence module. Additionally, it acts a type
    of plugin for AutoForm via the AutoForm hooks.
  */
  constructor(formId, docId) {
    this.formId = formId;
    this.docId = docId;
    this.isLoadingStoreDoc = null;
    this.didSubmit = false;
    this.formPersist = FormPersist();

    this.addHooks();
  }
  get storeDocId() {
    const { docId } = this;
    if (!docId) return this.formId;
    return `${this.formId}-${docId}`;
  }
  getStoreDoc = async (cb) => {
    this.isLoadingStoreDoc = true;
    const storeDoc = await this.formPersist.getFormValues(this.storeDocId);
    if (cb) cb(storeDoc);
    this.isLoadingStoreDoc = false;
    return storeDoc;
  }
  getFormDoc = (doc, storeDoc, type) => {
    if (type === 'insert') {
      return _.omit(storeDoc || {}, '_id', '_rev', 'updatedAt');
    } else if (type === 'update') {
      let afDoc;
      if (storeDoc && storeDoc.updatedAt) {
        if (new Date(storeDoc.updatedAt) > doc.updatedAt) afDoc = storeDoc;
        else afDoc = doc;
      } else afDoc = doc;
      return _.omit({ ...(afDoc || {}), _id: doc._id }, '_rev');
    }
    throw new Error('Form type must be insert or update.');
  }
  submitFormDoc = (instance) => {
    // Submit only once, when the formDoc is loaded
    if (!this.isLoadingStoreDoc && !this.didSubmit) {
      // Attempt to wait until AutoForm re-renders in order to submit
      setTimeout(() => {
        instance.$('form').submit();
        this.didSubmit = true;
      }, 500);
    }
  }
  getHooks = () => ({
    before: {
      update: (doc) => {
        if (this.isLoadingStoreDoc === false) return doc;
        return false;
      },
    },
    after: {
      insert: (e) => {
        if (!e) {
          this.formPersist.remove(this.storeDocId);
        }
      },
    },
  })
  addHooks = () => {
    const hooks = this.getHooks();
    AutoForm.addHooks(this.formId, hooks);
  }
}

const init = (...args) => new AutoFormPersist(...args);

export default init;
