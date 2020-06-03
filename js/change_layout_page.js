(function() {
  if (window.hasRun) {
    return;
  }

  window.hasRun = true;

  // Source: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
  function storageAvailable(type) {
    var storage;
    try {
      storage = window[type];
      var x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    }
    catch(e) {
      return e instanceof DOMException && (
        e.code === 22 ||
        e.code === 1014 ||
        e.name === 'QuotaExceededError' ||
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
        (storage && storage.length !== 0);
    }
  }

  // this key is used to store the current layout in the 
  // browser's locaStorage - the key is the board id
  function constructStorageKey() {
    return location.pathname.split('/')[2];
  }

  // simply toggle the layout for each click - mixed (default) to vertical to horizontal
  // and roll around
  function changeLayout(layoutClass) {
    let board = document.querySelector("#board");
    let storageKey = constructStorageKey();

    if (localStorage.getItem(storageKey) == layoutClass && board.classList.contains(layoutClass)) {
      return;
    }

    board.classList.remove(localStorage.getItem(storageKey));
    board.classList.add(layoutClass);
    localStorage.setItem(storageKey, layoutClass);
  }

  // check if we have localStorage available
  if (storageAvailable("localStorage")) {
    browser.runtime.onMessage.addListener((message) => {
      if (message.command == "changeLayout") {
        changeLayout(message.layoutClass);
      }
    });
  }
})();