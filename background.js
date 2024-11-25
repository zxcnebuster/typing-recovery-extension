// background.js
console.log("hey");
chrome.action.onClicked.addListener((tab) => {
  // Action to perform when extension icon is clicked
  console.log("Extension icon clicked!");
});
chrome.action.onClicked.addListener(async (tab) => {
  // Retrieve the stored typed text
  chrome.storage.local.get(["typedText"], async (result) => {
    const text = result.typedText || "";

    if (text.length === 0) {
      // Notify the user that there's no text to recover
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icons/icon48.png",
        title: "Typing Recovery",
        message: "No typed text to recover.",
      });
      return;
    }

    try {
      // Copy to clipboard using the Clipboard API
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (copyText) => {
          // Create a temporary textarea to select and copy the text
          const textarea = document.createElement("textarea");
          textarea.value = copyText;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
          chrome.notifications.create({
            type: "basic",
            iconUrl: "icons/icon48.png",
            title: "Typing Recovery",
            message: "Recovered text copied to clipboard!",
          });
        },
        args: [text],
      });

      // Clear the stored text after copying
      chrome.storage.local.set({ typedText: "" });
    } catch (err) {
      console.error("Error copying text to clipboard:", err);
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icons/icon48.png",
        title: "Typing Recovery",
        message: "Failed to copy text to clipboard.",
      });
    }
  });
});
