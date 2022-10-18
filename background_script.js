const CSS_INSERTION_DETAILS = {
  allFrames: true,
  file: "/default-colors.css",
  runAt: "document_start",
  cssOrigin: "user",
  matchAboutBlank: true
};

function insertIntoTab(tab) {
  return browser.tabs.insertCSS(tab.id, CSS_INSERTION_DETAILS).catch(console.warn.bind(console));
}

function removeFromTab(tab) {
  return browser.tabs.removeCSS(tab.id, CSS_INSERTION_DETAILS).catch(console.warn.bind(console));
}

async function removeCSS() {
  browser.tabs.onUpdated.removeListener(insertIntoTab);
  let allTabs = await browser.tabs.query({});
  await Promise.all(allTabs.map(removeFromTab));
}

async function insertCSS() {
  browser.tabs.onUpdated.addListener(insertIntoTab);
  let allTabs = await browser.tabs.query({});
  await Promise.all(allTabs.map(insertIntoTab));
}

const TOGGLESTATES = [/* "high-contrast-only", */ "never", "always"]
const BADGE_TEXT = {"high-contrast-only": "Auto", "never": "Off", "always": "On"};
const CSS_OPERATION = {"high-contrast-only": removeCSS, "never": insertCSS, "always": removeCSS};

async function setActionInfo(value) {

  let badgeText = BADGE_TEXT[value];
  await browser.browserAction.setBadgeText({ text: badgeText == "Auto" ? "" : badgeText });
  await browser.browserAction.setTitle({ title: `High Contrast: ${badgeText}` });
}

async function toggleHighContrast() {
  let { value } = await browser.browserSettings.overrideDocumentColors.get({});
  let nextValue = TOGGLESTATES[(TOGGLESTATES.indexOf(value) + 1) % TOGGLESTATES.length];
  let success = await browser.browserSettings.overrideDocumentColors.set({ value: nextValue });
  if (success) {
    CSS_OPERATION[nextValue]();
    setActionInfo(nextValue);
  }
}


async function init() {
  browser.browserAction.onClicked.addListener(() => {
    toggleHighContrast();
  });

  await browser.browserAction.setBadgeBackgroundColor({ color: "#000" });
  await browser.browserAction.setBadgeTextColor({ color: "#ff0" });
  let { value } = await browser.browserSettings.overrideDocumentColors.get({});
  CSS_OPERATION[value]();
  setActionInfo(value);
}

init();