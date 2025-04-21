export const formattingActions = {
  bold: () => applyCommand("bold"),
  italic: () => applyCommand("italic"),
  underline: () => applyCommand("underline"),
  list: () => applyCommand("insertUnorderedList"),
};

function applyCommand(command: string) {
  const textarea = document.getElementById("message-textarea");
  if (textarea) {
    textarea.focus();
  }

  document.execCommand(command);
}
