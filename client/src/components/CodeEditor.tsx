import Editor from "@monaco-editor/react";

interface Props {
  code: string;
  language: string;
  onChange: (value: string) => void;
}

const CodeEditor = ({
  code,
  language,
  onChange,
}: Props) => {
  return (
    <Editor
      height="80vh"
      language={language || "javascript"}
      value={code}
      theme="vs-dark"
      onChange={(value) => onChange(value || "")}
      options={{
        minimap: {
          enabled: false,
        },
        fontSize: 14,
        automaticLayout: true,
      }}
    />
  );
};

export default CodeEditor;