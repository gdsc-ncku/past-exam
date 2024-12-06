import React from 'react';

export const Form: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div>{children}</div>; // 或者使用 <form> 根據需求
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

export const FormLabel: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <label className="block text-sm font-medium text-gray-300">
      {children}
    </label>
  );
};

export const FormControl: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <div className="mt-1">{children}</div>;
};

export const FormMessage: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return <p className="text-sm text-red-500">{children}</p>;
};
