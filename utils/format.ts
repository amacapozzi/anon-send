export const formattingActions = {
  bold: () => wrapSelectedTextWithTag("b"),
  italic: () => wrapSelectedTextWithTag("i"),
  underline: () => wrapSelectedTextWithTag("u"),
};

function wrapSelectedTextWithTag(tag: string) {
  const textarea = document.getElementById(
    "message-textarea"
  ) as HTMLTextAreaElement;
  if (!textarea) return;

  const { selectionStart, selectionEnd, value } = textarea;
  const selectedText = value.slice(selectionStart, selectionEnd);

  if (!selectedText) return;

  const formattedText = `<${tag}>${selectedText}</${tag}>`;

  const newValue =
    value.slice(0, selectionStart) + formattedText + value.slice(selectionEnd);
  textarea.value = newValue;

  textarea.setSelectionRange(
    selectionStart + formattedText.length,
    selectionStart + formattedText.length
  );
  textarea.focus();

  const event = new Event("input", { bubbles: true });
  textarea.dispatchEvent(event);
}
