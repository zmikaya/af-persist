/* eslint-disable no-underscore-dangle */

import PouchDB from 'pouchdb-browser';
import PouchDBUpsert from 'pouchdb-upsert';
import PouchDBWebSQL from 'pouchdb-adapter-websql';
import _ from 'underscore';

PouchDB.plugin(PouchDBUpsert);
PouchDB.plugin(PouchDBWebSQL);

class FormPersist {
  /*  This class acts as a module to manage form persistence.
      It provides a handy interface for managing the lifecycle of
      of form data.
  */
  constructor(dbname) {
    this.dbname = dbname || 'FormPersist';
    this.db = this.getDB();
  }
  getDB = () => {
    const ua = window.navigator.userAgent;
    const iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
    const webkit = !!ua.match(/WebKit/i);
    const iOSSafari = iOS && webkit && !ua.match(/CriOS/i);
    if (iOSSafari) return new PouchDB(this.dbname, { adapter: 'websql' });
    return new PouchDB(this.dbname);
  }
  getFormValues = async (docId) => {
    try {
      const res = await this.db.get(docId);
      return res || {};
    } catch (e) {
      //
      console.log('get err'. e);
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
      console.log('err', e);
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
