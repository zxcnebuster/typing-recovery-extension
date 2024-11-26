let typedText = "";
let typingTimer;
const typingInterval = 1000;

function isInputFocused() {
  const active = document.activeElement;
  if (!active) return false;
  const tagName = active.tagName.toLowerCase();
  const editable = active.getAttribute("contenteditable");
  return (
    tagName === "input" ||
    tagName === "textarea" ||
    editable === "true" ||
    active.isContentEditable
  );
}

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey || e.altKey || e.metaKey) return;

  if (!isInputFocused()) {
    if (e.key.length === 1) {
      typedText += e.key;
      clearTimeout(typingTimer);
      typingTimer = setTimeout(() => {
        chrome.storage.local.set({ typedText });
      }, typingInterval);
    } else if (e.key === "Backspace") {
      typedText = typedText.slice(0, -1);
      chrome.storage.local.set({ typedText });
    }
  }
});
