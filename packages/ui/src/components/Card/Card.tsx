
import React from "react";

interface CardProps {
  title?: React.ReactNode;
  extra?: React.ReactNode;
  bordered?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  title,
  extra,
  bordered = true,
  className,
  style,
  children,
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md ${bordered ? "border border-gray-200" : ""} ${className || ""}`}
      style={style}
    >
      {(title || extra) && (
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <div className="text-lg font-medium">{title}</div>
          {extra && <div>{extra}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};
