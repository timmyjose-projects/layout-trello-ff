function listenForClicks() {
  document.addEventListener("load", () => {
    alert("Page loaded!");
  });

  // this is here instead of js/toggle_helper.js since this is run in the context of the 
  // extension whereas that script is run in the context of the currently loaded tab
  document.addEventListener("click", (evt) => {
    function changeLayout(tabs) {
      let layoutName = evt.target.textContent;
      var layoutClass = undefined;

      switch (layoutName) {
        case "Mixed": layoutClass = "trello-layout-mixed"; break;
        case "Vertical": layoutClass = "trello-layout-vertical"; break;
        case "Horizontal": layoutClass = "trello-layout-horizontal"; break;
      }

      browser.tabs.insertCSS({file: "/css/change_layout_page.css"})
        .then(()=> {
          browser.tabs.sendMessage(tabs[0].id, {
            command: "changeLayout",
            layoutClass: layoutClass
          }).then(window.close());
        });
    }

    function reportError(error) {
      console.log("error: ${error.message}");
    }

    browser.tabs.query({active: true, currentWindow: true})
      .then(changeLayout)
      .catch(reportError)
  });
}

function reportScriptError(error) {
  document.querySelector("#layout-options").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
  console.log("error: failed to change layout on page: ${error.message}");
}

browser.tabs.executeScript({file: "/js/change_layout_page.js"})
  .then(listenForClicks)
  .catch(reportScriptError);