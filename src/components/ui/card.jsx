import React from 'react';

const Card = ({ className, children, id }) => {
  return (
    <div id={id} className={`bg-white rounded-lg border shadow-sm ${className}`}>
      {children}
    </div>
  );
};

const CardHeader = ({ className, children }) => {
  return <div className={`p-6 ${className}`}>{children}</div>;
};

const CardTitle = ({ className, children }) => {
  return <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>;
};

const CardContent = ({ className, children }) => {
  return <div className={`p-6 pt-0 ${className}`}>{children}</div>;
};

export { Card, CardHeader, CardTitle, CardContent };
