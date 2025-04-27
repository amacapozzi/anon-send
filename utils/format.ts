export const handleEditorChange = (
  editorRef: React.RefObject<HTMLElement>,
  handleChange: (field: string, value: string) => void
) => {
  if (editorRef.current) {
    const content = editorRef.current.innerHTML;
    handleChange("body", content);
  }
};

export const applyFormat = (
  command: string,
  editorRef: React.RefObject<HTMLElement>,
  handleChange: (field: string, value: string) => void
) => {
  document.execCommand(command, false);
  if (editorRef.current) {
    editorRef.current.focus();
    handleEditorChange(editorRef, handleChange);
  }
};
