async function setActionInfo(toggled) {
  if (toggled == undefined) {
    let { levelOfControl } = await browser.browserSettings.overrideDocumentColors.get({});
    toggled = levelOfControl == "controlled_by_this_extension";
  }
  if (toggled) {
    await browser.browserAction.setBadgeText({ text: "ON" });
    await browser.browserAction.setTitle({ title: "High Contrast On" });
  } else {
    await browser.browserAction.setBadgeText({ text: "" });
    await browser.browserAction.setTitle({ title: "High Contrast Off" });
  }
}

async function toggleHighContrast() {
  let { levelOfControl } = await browser.browserSettings.overrideDocumentColors.get({});
  let success = false;
  if (levelOfControl == "controlled_by_this_extension") {
    success = await browser.browserSettings.overrideDocumentColors.clear({});
    setActionInfo(!success);
  } else {
    success = await browser.browserSettings.overrideDocumentColors.set({ value: "always" });
    setActionInfo(success);
  }
}

browser.browserAction.onClicked.addListener(() => {
  toggleHighContrast();
});

setActionInfo();