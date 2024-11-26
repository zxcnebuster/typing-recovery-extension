chrome.action.onClicked.addListener(async (tab) => {
  chrome.storage.local.get(["typedText"], async (result) => {
    const text = result.typedText || "";

    if (text.length === 0) {
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icons/icon48.png",
        title: "Typing Recovery",
        message: "No typed text to recover.",
      });
      return;
    }

    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (copyText) => {
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
