/* eslint-disable no-underscore-dangle */

import { AutoForm } from 'meteor/aldeed:autoform';
import { Session } from 'meteor/session';
import _ from 'underscore';

import FormPersist from './form-persist';

class AutoFormPersist {
  /*
    This class is interfaces with Meteor AutoForm forms.
    It provides a variety of helpers and manages the
    Blaze template lifecycle. Additionally, it acts a type
    of plugin for AutoForm via the AutoForm hooks.
    Form data is then transferred to the FormPersist module.
  */
  constructor(template, formId, collection, docId) {
    this.template = template;
    this.formId = formId;
    this.collection = collection;
    this._docId = docId;
    this.formPersist = FormPersist();

    this.onCreated();
    this.onDestroyed();
    this.addHelpers();
    this.addHooks();
    this.attachEvents();
  }
  get docId() {
    if (this._docId) return this._docId;
    return this.formId;
  }
  get hasDocId() {
    return !!this._docId;
  }
  onCreated = () => {
    this.template.onCreated(() => {
      this.setStoreDoc();
    });
  }
  onDestroyed = () => {
    this.template.onDestroyed(() => {
      // cleanup Session keys
      const keys = [this.docId, `${this.docId}-submit`];
      keys.forEach(key => Session.set(key, null));
    });
  }
  setStoreDoc = async () => {
    const storeDoc = await this.formPersist.getFormValues(this.docId);
    Session.set(this.docId, storeDoc);
  }
  getHelpers = () => {
    if (this.hasDocId) {
      return {
        doc: () => {
          const storeDoc = Session.get(this.docId);
          const mongoDoc = this.collection.findOne(this.docId);
          let afDoc = {};
          if (storeDoc && storeDoc.updatedOn) {
            if (new Date(storeDoc.updatedOn) > mongoDoc.updatedOn) afDoc = storeDoc;
            else afDoc = mongoDoc;
          } else afDoc = mongoDoc;
          return _.omit(afDoc || {}, '_rev');
        },
        collection: () => this.collection,
        omitFields: () => ['updatedOn'],
      };
    }
    return {
      doc: () => {
        const doc = Session.get(this.docId);
        return _.omit(doc || {}, '_id', '_rev', 'updatedOn');
      },
      collection: () => this.collection,
      omitFields: () => ['updatedOn'],
    };
  }
  addHelpers = () => {
    const helpers = this.getHelpers();
    this.template.helpers(helpers);
  }
  getHooks = () => ({
    after: {
      insert: (e) => {
        if (!e) {
          this.formPersist.remove(this.docId);
          Session.set(this.docId, {});
        }
      },
      update: (e) => {
        const didSubmit = Session.get(`${this.docId}-submit`);
        if (didSubmit) {
          if (!e) {
            this.formPersist.remove(this.docId);
            Session.set(this.docId, {});
          }
          Session.set(`${this.docId}-submit`, false);
        }
      },
    },
  })
  addHooks = () => {
    const hooks = this.getHooks();
    AutoForm.addHooks(this.formId, hooks);
  }
  attachEvents = () => {
    this.template.events({
      'keyup form': () => {
        const doc = AutoForm.getFormValues(this.formId);
        this.formPersist.upsert(this.docId, doc);
      },
      'submit form': () => {
        if (this.hasDocId) Session.set(`${this.docId}-submit`, true);
      },
    });
  }
}

const init = (...args) => new AutoFormPersist(...args);

export default init;
