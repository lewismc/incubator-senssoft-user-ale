// Generated by CoffeeScript 1.9.1
(function() {
  var ACTIVITIES, ELEMENTS, default_msg, defaults, extend, getParameterByName, userale,
    slice = [].slice,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  ACTIVITIES = ['ADD', 'REMOVE', 'CREATE', 'DELETE', 'SELECT', 'DESELECT', 'ENTER', 'LEAVE', 'INSPECT', 'ALTER', 'HIDE', 'SHOW', 'OPEN', 'CLOSE', 'PERFORM'];

  ELEMENTS = ['BUTTON', 'CANVAS', 'CHECKBOX', 'COMBOBOX', 'DATAGRID', 'DIALOG_BOX', 'DROPDOWNLIST', 'FRAME', 'ICON', 'INFOBAR', 'LABEL', 'LINK', 'LISTBOX', 'LISTITEM', 'MAP', 'MENU', 'MODALWINDOW', 'PALETTEWINDOW', 'PANEL', 'PROGRESSBAR', 'RADIOBUTTON', 'SLIDER', 'SPINNER', 'STATUSBAR', 'TAB', 'TABLE', 'TAG', 'TEXTBOX', 'THROBBER', 'TOAST', 'TOOLBAR', 'TOOLTIP', 'TREEVIEW', 'WINDOW', 'WORKSPACE', 'OTHER'];

  console.log('in userale');

  extend = function() {
    var i, key, len, object, objects, out, value;
    objects = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    out = {};
    for (i = 0, len = objects.length; i < len; i++) {
      object = objects[i];
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
    workerUrl: 'userale-worker.js',
    debug: true,
    sendLogs: true,
    componentGroups: []
  };

  default_msg = {
    activity: null,
    action: null,
    component: {
      id: null,
      type: null,
      group: null
    },
    source: null,
    object: null,
    tags: [],
    meta: {}
  };

  userale = (function() {
    function userale(options) {
      this.options = extend(defaults, options);
      if (this.options.componentGroups.constructor === !Array) {
        this.options.componentGroups = [this.options.componentGroups];
      }
      this.options.version = '3.0.0';
      this.worker = new Worker(this.options.workerUrl);
      this.worker.postMessage({
        cmd: 'setLoggingUrl',
        msg: this.options.loggingUrl
      });
      this.debug(this.options.debug);
      this.sendLogs(this.options.sendLogs);
    }

    userale.prototype.register = function() {
      this.options.sessionID = getParameterByName('USID');
      this.options.client = getParameterByName('client');
      console.log(this.options.sessionID);
      if (!this.options.sessionID) {
        this.options.sessionID = this.options.toolName.slice(0, 3).toUpperCase() + new Date().getTime();
        console.warn('USERALE: NO SESSION ID, MAKING ONE UP.  You can pass one in as url parameter (127.0.0.1?USID=12345)');
      }
      if (!this.options.client) {
        this.options.client = 'UNK';
        console.warn('USERALE: NO CLIENT, MAKING ONE UP.   You can pass one in as url parameter (127.0.0.1?client=roger)');
      }
      return this.worker.postMessage({
        cmd: 'sendBuffer',
        msg: ''
      });
    };

    userale.prototype.log = function(msg) {
      var activities, activity, elementType, i, key, len, ref, value, x;
      for (key in msg) {
        value = msg[key];
        msg = extend(default_msg, msg);
        if (key === 'component') {
          if (ref = value.group, indexOf.call(this.options.componentGroups, ref) < 0) {
            console.warn(value.group + " is NOT in component groups");
          }
          elementType = value.type.toUpperCase();
          if (indexOf.call(ELEMENTS, elementType) < 0) {
            console.warn("USERALE: Unrecognized element - " + elementType);
          } else if ((elementType === 'OTHER') && (msg.meta.element == null)) {
            console.warn("USERALE: Element type set to 'other', but 'element' not set in meta object ");
          }
          msg.component.type = elementType;
        }
        if (key === 'activity') {
          activities = (function() {
            var i, len, ref1, results1;
            ref1 = value.split('_');
            results1 = [];
            for (i = 0, len = ref1.length; i < len; i++) {
              x = ref1[i];
              results1.push(x.toUpperCase());
            }
            return results1;
          })();
          for (i = 0, len = activities.length; i < len; i++) {
            activity = activities[i];
            if (indexOf.call(ACTIVITIES, activity) < 0) {
              console.warn("USERALE: Unrecognized activity - " + activity);
            }
          }
          msg[key] = activities;
        }
        if (key === 'source') {
          value = value.toUpperCase();
          if (value !== 'USER' && value !== 'SYSTEM' && value !== 'UNK') {
            console.warn("USERALE: Unrecognized source - " + value);
            msg[key] = null;
          } else {
            msg[key] = value.toUpperCase();
          }
        }
      }
      msg.timestamp = new Date().toJSON();
      msg.client = this.options.client;
      msg.toolName = this.options.toolName;
      msg.toolVersion = this.options.toolVersion;
      msg.sessionID = this.options.sessionID;
      msg.language = 'JavaScript';
      msg.useraleVersion = this.version;
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

  window.userale = userale;

}).call(this);

//# sourceMappingURL=userale.js.map