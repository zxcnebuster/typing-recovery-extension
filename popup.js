document.getElementById("recoverBtn").addEventListener("click", () => {
  chrome.storage.local.get(["typedText"], async (result) => {
    const text = result.typedText || "";

    if (text.length === 0) {
      document.getElementById("status").innerText = "No text to recover.";
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      document.getElementById("status").innerText = "Text copied to clipboard!";
      chrome.storage.local.set({ typedText: "" });
    } catch (err) {
      console.error("Failed to copy text:", err);
      document.getElementById("status").innerText = "Failed to copy text.";
    }
  });
});
