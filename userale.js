/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// Generated by CoffeeScript 1.9.3
// Edits have since been made.
(function() {
  var ACTIVITIES, ELEMENTS, default_msg, defaults, extend, getCookie, getParameterByName, setCookie, userale,
    slice = [].slice,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  ACTIVITIES = ['ADD', 'REMOVE', 'CREATE', 'DELETE', 'SELECT', 'DESELECT', 'ENTER', 'LEAVE', 'INSPECT', 'ALTER', 'HIDE', 'SHOW', 'OPEN', 'CLOSE', 'PERFORM'];

  ELEMENTS = ['BUTTON', 'CANVAS', 'CHECKBOX', 'COMBOBOX', 'DATAGRID', 'DIALOG_BOX', 'DROPDOWNLIST', 'FRAME', 'ICON', 'INFOBAR', 'LABEL', 'LINK', 'LISTBOX', 'LISTITEM', 'MAP', 'MENU', 'MODALWINDOW', 'PALETTEWINDOW', 'PANEL', 'PROGRESSBAR', 'RADIOBUTTON', 'SLIDER', 'SPINNER', 'STATUSBAR', 'TAB', 'TABLE', 'TAG', 'TEXTBOX', 'THROBBER', 'TOAST', 'TOOLBAR', 'TOOLTIP', 'TREEVIEW', 'WINDOW', 'WORKSPACE', 'OTHER'];

  extend = function() {
    var j, key, len, object, objects, out, value;
    objects = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    out = {};
    for (j = 0, len = objects.length; j < len; j++) {
      object = objects[j];
      for (key in object) {
        value = object[key];
        out[key] = value;
      }
    }
    return out;
  };

  getParameterByName = function(name) {
    var regex, results;
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    results = regex.exec(location.search);
    return results = results ? decodeURIComponent(results[1].replace(/\+/g, " ")) : "";
  };

  defaults = {
    loggingUrl: '',
    toolName: 'UNK',
    toolVersion: 'UNK',
    version: '3.0',
    workerUrl: 'userale-worker.js',
    debug: true,
    sendLogs: true,
    elementGroups: []
  };

  default_msg = {
    activity: '',
    action: '',
    elementId: '',
    elementType: '',
    elementGroup: '',
    elementSub: '',
    source: '',
    tags: [],
    meta: {}
  };

  setCookie = function(cname, cvalue, exdays) {
    var d, expires;
    d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    expires = "expires=" + d.toUTCString();
    return document.cookie = cname + "=" + cvalue + "; " + expires;
  };

  getCookie = function(name) {
    var c, ca, i, nameEQ;
    nameEQ = name + "=";
    ca = document.cookie.split(";");
    i = 0;
    while (i < ca.length) {
      c = ca[i];
      while (c.charAt(0) === " ") {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length).replace(/"/g, '');
      }
      i++;
    }
    return "";
  };

  userale = (function() {
    function userale(options) {
      this.options = extend(defaults, options);
      if (this.options.elementGroups.constructor === !Array) {
        this.options.elementGroups = [this.options.elementGroups];
      }
      this.options.version = '3.0.1';
      this.worker = new Worker(this.options.workerUrl);
      this.worker.postMessage({
        cmd: 'setLoggingUrl',
        msg: this.options.loggingUrl
      });
      this.debug(this.options.debug);
      this.sendLogs(this.options.sendLogs);
    }

    userale.prototype.register = function() {
      if (getParameterByName('USID')) {
        this.options.sessionID = getParameterByName('USID');
        setCookie('USID', this.options.sessionID, 2);
        console.info('USERALE: SESSION ID FOUND IN URL - ' + this.options.sessionID);
      } else if (getCookie('USID')) {
        this.options.sessionID = getCookie('USID');
        console.info('USERALE: SESSION ID FOUND IN COOKIE - ' + this.options.sessionID);
      } else {
        this.options.sessionID = this.options.toolName.slice(0, 3).toUpperCase() + new Date().getTime();
        setCookie('USID', this.options.sessionID, 2);
        console.warn('USERALE: NO SESSION ID, MAKING ONE UP.  You can pass one in as url parameter (127.0.0.1?USID=12345)');
      }
      if (getParameterByName('client')) {
        this.options.client = getParameterByName('client');
        setCookie('USERALECLIENT', this.options.client, 2);
        console.info('USERALE: CLIENT FOUND IN URL - ' + this.options.client);
      } else if (getCookie('USERALECLIENT')) {
        this.options.client = getCookie('USERALECLIENT');
        console.info('USERALE: CLIENT FOUND IN COOKIE - ' + this.options.client);
      } else {
        this.options.client = 'UNK';
        setCookie('USERALECLIENT', this.options.client, 2);
        console.warn('USERALE: NO CLIENT, MAKING ONE UP.   You can pass one in as url parameter (127.0.0.1?client=roger)');
      }
      this.worker.postMessage({
        cmd: 'sendBuffer',
        msg: ''
      });
      window.onload = (function(_this) {
        return function() {
          var msg;
          msg = {
            activity: 'show',
            action: 'onload',
            elementId: 'window',
            elementType: 'window',
            elementGroup: 'top',
            source: 'user'
          };
          return _this.log(msg);
        };
      })(this);
      window.onbeforeunload = (function(_this) {
        return function() {
          var msg;
          msg = {
            activity: 'hide',
            action: 'onbeforeunload',
            elementId: 'window',
            elementType: 'window',
            elementGroup: 'top',
            source: 'user'
          };
          return _this.log(msg);
        };
      })(this);
      window.onfocus = (function(_this) {
        return function() {
          var msg;
          msg = {
            activity: 'show',
            action: 'onfocus',
            elementId: 'window',
            elementType: 'window',
            elementGroup: 'top',
            source: 'user'
          };
          return _this.log(msg);
        };
      })(this);
      return window.onblur = (function(_this) {
        return function() {
          var msg;
          msg = {
            activity: 'hide',
            action: 'onblur',
            elementId: 'window',
            elementType: 'window',
            elementGroup: 'top',
            source: 'user'
          };
          return _this.log(msg);
        };
      })(this);
    };

    userale.prototype.log = function(msg) {
      var activities, activity, j, key, len, value, x;
      msg = extend(default_msg, msg);
      for (key in msg) {
        value = msg[key];
        if (key === 'elementType') {
          msg.elementType = msg.elementType.toUpperCase();
        }
        if (key === 'activity') {
          msg[key] = (function() {
            var j, len, ref, results1;
            ref = value.split('_');
            results1 = [];
            for (j = 0, len = ref.length; j < len; j++) {
              x = ref[j];
              results1.push(x.toUpperCase());
            }
            return results1;
          })();
        }
        if (key === 'source') {
          value = value.toUpperCase();
          if (value !== 'USER' && value !== 'SYSTEM' && value !== 'UNK') {
            msg[key] = null;
          } else {
            msg[key] = value;
          }
        }
      }
      msg.language = 'JavaScript';
      msg.useraleVersion = this.options.version;
      msg.toolVersion = this.options.toolVersion;
      msg.toolName = this.options.toolName;
      msg.client = this.options.client;
      msg.sessionID = this.options.sessionID;
      msg.timestamp = new Date().toJSON();
      return this.worker.postMessage({
        cmd: 'sendMsg',
        msg: msg
      });
    };

    userale.prototype.debug = function(onOff) {
      this.options.debug = onOff;
      return this.worker.postMessage({
        cmd: 'setEcho',
        msg: onOff
      });
    };

    userale.prototype.sendLogs = function(onOff) {
      this.options.sendLogs = onOff;
      return this.worker.postMessage({
        cmd: 'setTesting',
        msg: !onOff
      });
    };

    return userale;

  })();

  this.userale = userale;

}).call(this);
