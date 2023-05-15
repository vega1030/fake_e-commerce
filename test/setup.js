import {JSDOM} from 'jsdom'

// Configurar JSDOM

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost'
});

// Configurar los objetos globales

global.window = dom.window;
global.document = window.document;
global.navigator = window.navigator;
