// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"js/main.js":[function(require,module,exports) {
var clock = document.querySelector('.clock');
var promptInput = document.querySelector('.prompt-input');
var mainPrompt = document.querySelector('.prompt-name');
var greetText = document.querySelector('.user-greet'); //======================
// Clock
//======================

function setDate() {
  var date = new Date();
  var seconds = date.getSeconds();
  var minutes = date.getMinutes();
  var hours = date.getHours();

  if (hours < 10) {
    hours = "0".concat(hours);
  }

  if (minutes < 10) {
    minutes = "0".concat(minutes);
  }

  if (seconds < 10) {
    seconds = "0".concat(seconds);
  }

  clock.innerText = "".concat(hours, ":").concat(minutes, ":").concat(seconds);

  if (hours < 12) {
    greetText.innerText = "Good Morning";
  } else if (hours >= 12 && hours <= 16) {
    greetText.innerText = "Good Afternoon";
  } else if (hours > 16 && hours <= 20) {
    greetText.innerText = "Good Evening";
  } else if (hours <= 24) {
    greetText.innerText = "Good Night";
  } // greet(hours);


  setInterval(setDate, 1000);
}

setDate(); //======================
// Greeting
//======================

var userName = localStorage.getItem('user') || "";

function greetingText(e) {
  if (!userName) {
    var promptText = document.querySelector('.prompt-input').value;
    userName = promptText;
  }

  mainPrompt.innerHTML = "<h1>Welcome ".concat(userName, "</h1>");
  localStorage.setItem('user', userName);
}

if (userName) {
  greetingText();
}

promptInput.addEventListener('keydown', function (e) {
  if (e.keyCode == 13) {
    greetingText();
  }
}); //======================
// To Do List
//======================

var form = document.querySelector('.form-element');
var itemList = document.querySelector('ul');
var allList = document.querySelector('.all-list');
var itemLeft = document.querySelector('.item-left');
var completed = document.querySelector('.completed');
var active = document.querySelector('.active');
var clearComplete = document.querySelector('.clear-complete');
var arrList = JSON.parse(localStorage.getItem('list')) || []; // Add List

function addList(e) {
  e.preventDefault();
  var name = document.querySelector('.form-input').value;
  var listContainer = {
    name: name,
    done: false
  };
  if (!name) return;
  arrList.push(listContainer);
  displayList(arrList, itemList);
  localStorage.setItem('list', JSON.stringify(arrList));
  this.reset();
} // Display List


function displayList() {
  var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var itemsList = arguments.length > 1 ? arguments[1] : undefined;
  itemsList.innerHTML = items.map(function (element, i) {
    return "\n      <li class=\"todoList\" data-id=\"".concat(i, "\">\n        <input class=\"check\" type = \"checkbox\" data-index = ").concat(i, " data-id = \"").concat(i, "\" ").concat(element.done ? 'checked' : '', "></input>\n        <label for = \"").concat(i, "\" class= \"").concat(element.done ? 'linethrough' : '', "\" >").concat(element.name, "</label>\n        <button data-id =\"").concat(i, "\" class=\"edit\">+</button>\n        <button data-id =\"").concat(i, "\" class=\"delete\">X</button>\n      </li>\n    ");
  }).join('');
  leftCount();
} // Delete List


function deleteList(e) {
  if (e.target.classList.contains('delete')) {
    var id = e.target.dataset.id;
    arrList.splice(id, 1);
    localStorage.setItem('list', JSON.stringify(arrList));
    displayList(arrList, itemList);
  }
} // Edit List


function editList(e) {
  if (e.target.classList.contains('edit')) {
    var id = e.target.dataset.id;
    var item = e.target.parentElement;
    item.innerHTML = "\n    <form class=\"edit-form\">\n      <input type=\"text\" class=\"editValue\" id=\"".concat(id, "\" required>\n      <button id=\"submit-edit-val\">Submit</button>\n    </form>");
  }

  if (e.target.id === 'submit-edit-val') {
    var editVal = document.querySelector('.editValue');
    arrList[editVal.id].name = editVal.value;
    if (!editVal.value) return;
    localStorage.setItem('list', JSON.stringify(arrList));
    displayList(arrList, itemList);
  }
} // Toggle


function toggleDone(e) {
  if (!e.target.classList.contains('check')) return;
  var index = e.target.dataset.index;
  arrList[index].done = !arrList[index].done;
  localStorage.setItem('list', JSON.stringify(arrList));
  displayList(arrList, itemList);
} // All list


function allItem() {
  localStorage.setItem('allLists', JSON.stringify(arrList));
  displayList(JSON.parse(localStorage.getItem('allLists')), itemList);
} // Completed


function completeItem() {
  var onlyCompleted = arrList.filter(function (elem) {
    return elem.done;
  });
  localStorage.setItem('completedItems', JSON.stringify(onlyCompleted));
  displayList(JSON.parse(localStorage.getItem('completedItems')), itemList);
} // Active


function activeItem() {
  var onlyActive = arrList.filter(function (elem) {
    return !elem.done;
  });
  localStorage.setItem('activeItems', JSON.stringify(onlyActive));
  displayList(JSON.parse(localStorage.getItem('activeItems')), itemList);
} // Clear Completed


function clearCompleted(e) {
  e.preventDefault();
  arrList = arrList.filter(function (elem) {
    return !elem.done;
  });
  localStorage.setItem('list', JSON.stringify(arrList));
  displayList(arrList, itemList);
} // Items left


function leftCount() {
  var leftItem = arrList.filter(function (v) {
    return !v.done;
  }).length;
  itemLeft.innerText = "".concat(leftItem, " items left");
}

form.addEventListener('submit', addList);
itemList.addEventListener('click', deleteList);
itemList.addEventListener('click', editList);
itemList.addEventListener('click', toggleDone);
allList.addEventListener('click', allItem);
completed.addEventListener('click', completeItem);
active.addEventListener('click', activeItem);
clearComplete.addEventListener('click', clearCompleted);
displayList(arrList, itemList);
leftCount();
},{}],"../../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "42075" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/main.js"], null)
//# sourceMappingURL=/main.fb6bbcaf.map