/* eslint-disable no-underscore-dangle */

import PouchDB from 'pouchdb-browser';
import PouchDBUpsert from 'pouchdb-upsert';
import _ from 'underscore';

PouchDB.plugin(PouchDBUpsert);

class FormPersist {
  /*  This class acts as a module to manage form persistence.
      It provides a handy interface for managing the lifecycle of
      of form data.
  */
  constructor(dbname) {
    this.dbname = dbname || 'FormPersist';
    this.db = new PouchDB(this.dbname);
  }
  getFormValues = async (docId) => {
    try {
      const res = await this.db.get(docId);
      return res || {};
    } catch (e) {
      //
    }
    return {};
  }
  upsert = _.debounce(async (docId, doc) => {
    try {
      await this.db.upsert(
        docId,
        () => ({ ...doc.insertDoc, _id: docId, updatedAt: new Date() }),
      );
    } catch (e) {
      //
    }
  }, 500)
  remove = async (docId) => {
    try {
      const doc = await this.db.get(docId);
      this.db.remove(doc);
    } catch (e) {
      //
    }
  }
}

const init = (...args) => new FormPersist(...args);

export default init;
