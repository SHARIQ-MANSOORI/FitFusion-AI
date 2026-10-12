import { useState, useMemo } from 'react';

// Format inline bold, italic, and code tokens safely
const formatInlineText = (text) => {
  if (!text) return null;

  const parts = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={match.index} className="ai-highlight-bold">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(
        <em key={match.index} className="ai-highlight-italic">
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code key={match.index} className="ai-highlight-code">
          {token.slice(1, -1)}
        </code>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
};

// Parse raw markdown string into structured block objects
const parseMarkdownBlocks = (text) => {
  if (!text) return [];
  const lines = text.split('\n');
  const blocks = [];
  let currentList = null;
  let currentTable = null;

  const flushList = () => {
    if (currentList) {
      blocks.push({ type: currentList.type, items: currentList.items });
      currentList = null;
    }
  };

  const flushTable = () => {
    if (currentTable) {
      blocks.push({ type: 'table', rows: currentTable });
      currentTable = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      flushList();
      flushTable();
      continue;
    }

    // Markdown Table Rows (| col1 | col2 |)
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      flushList();
      if (!currentTable) currentTable = [];
      // Ignore separator row like |---|---|
      if (!/^\|[\s\-:|]+\|$/.test(trimmed)) {
        const cells = trimmed
          .slice(1, -1)
          .split('|')
          .map((c) => c.trim());
        currentTable.push(cells);
      }
      continue;
    } else {
      flushTable();
    }

    // Headings
    if (trimmed.startsWith('#### ')) {
      flushList();
      blocks.push({ type: 'h6', text: trimmed.slice(5) });
      continue;
    }
    if (trimmed.startsWith('### ')) {
      flushList();
      blocks.push({ type: 'h5', text: trimmed.slice(4) });
      continue;
    }
    if (trimmed.startsWith('## ')) {
      flushList();
      blocks.push({ type: 'h4', text: trimmed.slice(3) });
      continue;
    }
    if (trimmed.startsWith('# ')) {
      flushList();
      blocks.push({ type: 'h3', text: trimmed.slice(2) });
      continue;
    }

    // Horizontal Divider
    if (/^[-*_]{3,}$/.test(trimmed)) {
      flushList();
      blocks.push({ type: 'divider' });
      continue;
    }

    // Unordered List (- or * or •)
    const ulMatch = trimmed.match(/^[-*•]\s+(.*)$/);
    if (ulMatch) {
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(ulMatch[1]);
      continue;
    }

    // Ordered List (1. , 2. )
    const olMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (olMatch) {
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(olMatch[2]);
      continue;
    }

    // Callout / Note
    if (/^(\*\*Note:?\*\*|Note:|Tip:|\*\*Tip:?\*\*|Important:|\*\*Important:?\*\*)/i.test(trimmed)) {
      flushList();
      blocks.push({ type: 'callout', text: trimmed });
      continue;
    }

    // Paragraph
    flushList();
    blocks.push({ type: 'p', text: trimmed });
  }

  flushList();
  flushTable();
  return blocks;
};

const FormattedAIOutput = ({ content, compact = false, showRawToggle = false }) => {
  const [viewRaw, setViewRaw] = useState(false);

  const blocks = useMemo(() => parseMarkdownBlocks(content), [content]);

  if (!content) return null;

  if (viewRaw) {
    return (
      <div className="ai-plan-wrapper">
        {showRawToggle && (
          <div className="ai-view-controls">
            <button
              type="button"
              className="ai-view-toggle-btn"
              onClick={() => setViewRaw(false)}
            >
              ✨ Switch to Formatted View
            </button>
          </div>
        )}
        <pre className="ai-plan" style={{ whiteSpace: 'pre-wrap' }}>{content}</pre>
      </div>
    );
  }

  return (
    <div className={`ai-plan formatted-ai-output ${compact ? 'compact' : ''}`}>
      {showRawToggle && (
        <div className="ai-view-controls">
          <button
            type="button"
            className="ai-view-toggle-btn"
            onClick={() => setViewRaw(true)}
          >
            📄 View Raw Text
          </button>
        </div>
      )}

      <div className="ai-output-content">
        {blocks.map((block, idx) => {
          switch (block.type) {
            case 'h3':
              return (
                <div key={idx} className="ai-block-heading-main">
                  <h3>{formatInlineText(block.text)}</h3>
                </div>
              );

            case 'h4':
              return (
                <div key={idx} className="ai-block-section-card">
                  <div className="ai-section-title">
                    <span className="ai-section-indicator">⚡</span>
                    <h4>{formatInlineText(block.text)}</h4>
                  </div>
                </div>
              );

            case 'h5':
              return (
                <div key={idx} className="ai-block-subsection">
                  <div className="ai-subsection-title">
                    <span className="ai-sub-bullet">•</span>
                    <h5>{formatInlineText(block.text)}</h5>
                  </div>
                </div>
              );

            case 'h6':
              return (
                <h6 key={idx} className="ai-block-h6">
                  {formatInlineText(block.text)}
                </h6>
              );

            case 'ul':
              return (
                <ul key={idx} className="ai-list-ul">
                  {block.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="ai-list-item">
                      <span className="ai-bullet-point">▸</span>
                      <span className="ai-item-content">{formatInlineText(item)}</span>
                    </li>
                  ))}
                </ul>
              );

            case 'ol':
              return (
                <ol key={idx} className="ai-list-ol">
                  {block.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="ai-list-item-numbered">
                      <span className="ai-number-badge">{itemIdx + 1}</span>
                      <span className="ai-item-content">{formatInlineText(item)}</span>
                    </li>
                  ))}
                </ol>
              );

            case 'callout':
              return (
                <div key={idx} className="ai-callout-box">
                  <span className="ai-callout-icon">💡</span>
                  <div className="ai-callout-text">{formatInlineText(block.text)}</div>
                </div>
              );

            case 'table':
              return (
                <div key={idx} className="ai-table-wrapper">
                  <table className="ai-table">
                    {block.rows.length > 0 && (
                      <thead>
                        <tr>
                          {block.rows[0].map((cell, cIdx) => (
                            <th key={cIdx}>{formatInlineText(cell)}</th>
                          ))}
                        </tr>
                      </thead>
                    )}
                    <tbody>
                      {block.rows.slice(1).map((row, rIdx) => (
                        <tr key={rIdx}>
                          {row.map((cell, cIdx) => (
                            <td key={cIdx}>{formatInlineText(cell)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );

            case 'divider':
              return <hr key={idx} className="ai-divider" />;

            case 'p':
            default:
              return (
                <p key={idx} className="ai-paragraph">
                  {formatInlineText(block.text)}
                </p>
              );
          }
        })}
      </div>
    </div>
  );
};

export default FormattedAIOutput;
