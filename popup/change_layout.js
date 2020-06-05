function reportError(error) {
  console.log(`error: failed to change layout on page: ${error.message}`);
}

function reportScriptError() {
  document.querySelector("#layout-options").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
}

function monitorClicks() {
  document.addEventListener("click", (evt) => {
    browser.tabs.query({active: true, currentWindow: true})
      .then((tabs) => {
        let layoutName = evt.target.textContent;
        let layoutClass = undefined;

        switch (layoutName) {
          case "Mixed": layoutClass = "trello-layout-mixed"; break;
          case "Vertical" : layoutClass = "trello-layout-vertical"; break;
          case "Horizontal" : layoutClass = "trello-layout-horizontal"; break;
        }

        let old_cookie = { 
          url: tabs[0].url,
          name: "layout-trello-ff-layout"
        };

        browser.cookies.remove(old_cookie).catch();

        browser.tabs.insertCSS({file: "/content_scripts/change_page_layout.css"})
          .then(() => {
            browser.tabs.sendMessage(tabs[0].id, {
              command: "changeLayout",
              layoutClass: layoutClass
            })
              .then(window.close());
          });

        let new_cookie = { 
          url: tabs[0].url,
          name: "layout-trello-ff-layout",
          value: JSON.stringify(layoutClass)
        };

        console.log("Setting cookies: ", JSON.stringify(new_cookie));
        browser.cookies.set(new_cookie);
      })
      .catch(reportError);
  });
}

browser.tabs.executeScript({file: "/content_scripts/change_page_layout.js"})
  .then(monitorClicks)
  .catch(reportScriptError);