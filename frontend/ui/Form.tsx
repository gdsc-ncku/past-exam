import React from 'react';

export const Form: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <form>{children}</form>;
};

export const FormField: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <div>{children}</div>;
};

export const FormItem: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <div>{children}</div>;
};

export const FormLabel: React.FC<{
  children: React.ReactNode;
  htmlFor: string;
}> = ({ children, htmlFor }) => {
  return (
    <label
      className="block text-sm font-medium text-gray-300"
      htmlFor={htmlFor}
    >
      {children}
    </label>
  );
};

export const FormControl: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <div className="mt-1">{children}</div>;
};

export const FormMessage: React.FC<{
  children?: React.ReactNode;
  role?: string;
}> = ({
  children,
  role = 'alert', // 默認值設置為 "alert"
}) => {
  return (
    <p className="text-sm text-red-500" role={role}>
      {children}
    </p>
  );
};
