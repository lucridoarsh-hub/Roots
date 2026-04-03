
import React from 'react';

interface HighlightedTextProps {
  text: string;
  highlight: string;
}

const HighlightedText: React.FC<HighlightedTextProps> = ({ text, highlight }) => {
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }

  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <mark key={i} className="bg-amber-200 text-amber-900 px-0.5 rounded">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
};

export default HighlightedText;
