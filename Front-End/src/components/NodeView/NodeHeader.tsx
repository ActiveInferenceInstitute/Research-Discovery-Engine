// src/components/NodeView/NodeHeader.tsx
import React from 'react';

interface NodeHeaderProps {
  title: string;
  subtitle: string | null;
}

const NodeHeader: React.FC<NodeHeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="pb-4 border-b dark:border-slate-700">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 italic">
          {subtitle}
        </p>
      )}
    </header>
  );
};
export default NodeHeader;