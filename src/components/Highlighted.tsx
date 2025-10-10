interface HighlightedProps {
  content: string | null | undefined;
  search: string | null | undefined;
  className?: string;
}

const diacriticRegex = /[\u0300-\u036f]/g;

function casefold(s: string): string {
  return s.normalize('NFD').replace(diacriticRegex, '').toLowerCase();
}

export function Highlighted({ content, search, className = 'highlighted' }: HighlightedProps) {
  if (!content) {
    return null;
  }

  if (!search || search.length < 1) {
    return <span>{content}</span>;
  }

  const searchLower = casefold(search);
  const contentLower = casefold(content);
  const parts: (string | JSX.Element)[] = [];
  let lastIndex = 0;

  let index = contentLower.indexOf(searchLower, lastIndex);
  while (index !== -1) {
    // Add text before match
    if (index > lastIndex) {
      parts.push(content.substring(lastIndex, index));
    }
    // Add highlighted match
    const matchEnd = index + search.length;
    parts.push(
      <span key={index} className={className}>
        {content.substring(index, matchEnd)}
      </span>
    );
    lastIndex = matchEnd;
    index = contentLower.indexOf(searchLower, lastIndex);
  }

  // Add remaining text
  if (lastIndex < content.length) {
    parts.push(content.substring(lastIndex));
  }

  return <span>{parts}</span>;
}
