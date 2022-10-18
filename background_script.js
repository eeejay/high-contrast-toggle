const TRISTATE = ["high-contrast-only", "never", "always"]
const BADGE_TEXT = {"high-contrast-only": "Auto", "never": "Off", "always": "On"};

async function setActionInfo(value) {
  if (value == undefined) {
    let result = await browser.browserSettings.overrideDocumentColors.get({});
    value = result.value;
    await browser.browserAction.setBadgeBackgroundColor({ color: "#000" });
    await browser.browserAction.setBadgeTextColor({ color: "#ff0" });
  }
  let badgeText = BADGE_TEXT[value];
  await browser.browserAction.setBadgeText({ text: badgeText == "Auto" ? "" : badgeText });
  await browser.browserAction.setTitle({ title: `High Contrast: ${badgeText}` });
}

async function toggleHighContrast() {
  let { value } = await browser.browserSettings.overrideDocumentColors.get({});
  let nextValue = TRISTATE[(TRISTATE.indexOf(value) + 1) % TRISTATE.length];
  let success = await browser.browserSettings.overrideDocumentColors.set({ value: nextValue });
  if (success) {
    setActionInfo(nextValue);
  }
}

browser.browserAction.onClicked.addListener(() => {
  toggleHighContrast();
});

setActionInfo();