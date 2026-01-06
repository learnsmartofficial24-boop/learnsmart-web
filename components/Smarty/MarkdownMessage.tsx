'use client';

import { Fragment } from 'react';

interface MarkdownMessageProps {
  content: string;
}

function parseInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const parts = text.split(/`([^`]+)`/g);

  for (let i = 0; i < parts.length; i += 1) {
    const part = parts[i] ?? '';

    if (i % 2 === 1) {
      nodes.push(
        <code
          key={`code-${i}`}
          className="px-1 py-0.5 rounded bg-[var(--border)] text-[0.875em]"
        >
          {part}
        </code>
      );
      continue;
    }

    nodes.push(...parseEmphasis(part, `t-${i}-`));
  }

  return nodes;
}

function parseEmphasis(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let i = 0;
  let keyIndex = 0;

  while (i < text.length) {
    const boldIdx = text.indexOf('**', i);
    const italicIdx = text.indexOf('*', i);

    const hasBold = boldIdx !== -1;
    const hasItalic = italicIdx !== -1;

    if (!hasBold && !hasItalic) {
      nodes.push(text.slice(i));
      break;
    }

    const nextType = hasBold && (!hasItalic || boldIdx <= italicIdx) ? 'bold' : 'italic';
    const nextIdx = nextType === 'bold' ? boldIdx : italicIdx;

    if (nextIdx > i) {
      nodes.push(text.slice(i, nextIdx));
    }

    if (nextType === 'bold') {
      const end = text.indexOf('**', nextIdx + 2);
      if (end === -1) {
        nodes.push(text.slice(nextIdx));
        break;
      }

      nodes.push(
        <strong key={`${keyPrefix}b-${keyIndex}`}>{text.slice(nextIdx + 2, end)}</strong>
      );
      keyIndex += 1;
      i = end + 2;
      continue;
    }

    const end = text.indexOf('*', nextIdx + 1);
    if (end === -1) {
      nodes.push(text.slice(nextIdx));
      break;
    }

    nodes.push(<em key={`${keyPrefix}i-${keyIndex}`}>{text.slice(nextIdx + 1, end)}</em>);
    keyIndex += 1;
    i = end + 1;
  }

  return nodes;
}

function renderTextBlock(text: string, keyPrefix: string) {
  const paragraphs = text.split(/\n{2,}/g);

  return paragraphs.map((p, idx) => {
    const lines = p.split(/\n/g);

    return (
      <p key={`${keyPrefix}-p-${idx}`} className="mb-2 last:mb-0 whitespace-pre-wrap">
        {lines.map((line, lineIdx) => (
          <Fragment key={`${keyPrefix}-l-${idx}-${lineIdx}`}>
            {parseInline(line)}
            {lineIdx < lines.length - 1 ? <br /> : null}
          </Fragment>
        ))}
      </p>
    );
  });
}

export function MarkdownMessage({ content }: MarkdownMessageProps) {
  const regex = /```(\w+)?\n([\s\S]*?)```/g;
  const nodes: React.ReactNode[] = [];

  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let blockIndex = 0;

  while ((match = regex.exec(content)) !== null) {
    const [fullMatch, lang, code] = match;
    const start = match.index;

    if (start > lastIndex) {
      nodes.push(
        <Fragment key={`t-${blockIndex}`}>
          {renderTextBlock(content.slice(lastIndex, start), `t-${blockIndex}`)}
        </Fragment>
      );
      blockIndex += 1;
    }

    nodes.push(
      <pre
        key={`c-${blockIndex}`}
        className="mb-2 last:mb-0 overflow-x-auto rounded-[var(--radius-sm)] bg-[var(--background)] border border-[var(--border)] p-3"
        aria-label={lang ? `Code block: ${lang}` : 'Code block'}
      >
        <code className="text-sm">{(code ?? fullMatch).trimEnd()}</code>
      </pre>
    );

    blockIndex += 1;
    lastIndex = start + fullMatch.length;
  }

  if (lastIndex < content.length) {
    nodes.push(
      <Fragment key={`t-${blockIndex}`}>
        {renderTextBlock(content.slice(lastIndex), `t-${blockIndex}`)}
      </Fragment>
    );
  }

  return <div className="text-sm leading-relaxed">{nodes}</div>;
}
