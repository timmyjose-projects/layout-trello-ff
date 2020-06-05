function updateLayout() {
  browser.tabs.query({active: true, currentWindow: true})
    .then((tabs) => {
      browser.cookies.get({
        url: tabs[0].url,
        name: 'layout-trello-ff-layout'
      }).then((cookie) => {
        if (cookie) {
          var layoutClass = JSON.parse(cookie.value);
          browser.tabs.sendMessage(tabs[0].id, 
            { command: "changeLayout", 
              layoutClass: layoutClass
            });
        } 
      });
    });
}

browser.tabs.onUpdated.addListener(updateLayout);
browser.tabs.onActivated.addListener(updateLayout);