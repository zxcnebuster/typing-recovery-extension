// content.js
console.log("hey");
let typedText = "";
let typingTimer;
const typingInterval = 500; // 1 second of inactivity

// Function to check if any input or editable element is focused
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

// Listen for keydown events
document.addEventListener("keydown", (e) => {
  console.log("key down");
  // Ignore modifier keys
  if (e.ctrlKey || e.altKey || e.metaKey) return;

  if (!isInputFocused()) {
    // Capture printable characters
    if (e.key.length === 1) {
      typedText += e.key;
      // Debounce saving to storage
      clearTimeout(typingTimer);
      typingTimer = setTimeout(() => {
        // Save the typedText to storage
        chrome.storage.local.set({ typedText });
      }, typingInterval);
    } else if (e.key === "Backspace") {
      typedText = typedText.slice(0, -1);
      chrome.storage.local.set({ typedText });
    }
    // You can handle other keys if necessary
  }
});
