if (!location.toString().match(/.*trello.com\/b\/.*/)) {
  throw "extension requires trello.com boards";
}

browser.runtime.onMessage.addListener((message) => {
  if (message.command == "changeLayout") {
    let board = document.querySelector("#board");
    // remove existing classes, if any
    for (let clazz of ["trello-layout-mixed", "trello-layout-vertical", "trello-layout-horizontal"]) {
      if (board.classList.contains(clazz)) {
        board.classList.remove(clazz);
      }
    }

    if (!message.layoutClass) {
      board.classList.add("trello-layout-mixed");
    } else {
      board.classList.add(message.layoutClass);
    }
  }
});
