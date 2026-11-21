import { CopyButton } from "./CopyButton";

type Props = {
  code: string;
  label?: string;
  note?: string;
};

export function CodeBlock({ code, label = "shell", note }: Props) {
  return (
    <div className="codeblock">
      <div className="codeblock__bar">
        <span>{label}</span>
        <CopyButton text={code} />
      </div>
      <pre>
        <code>{code}</code>
      </pre>
      {note ? <p className="codeblock__note">{note}</p> : null}
    </div>
  );
}
