import React from "react";
import { AlertOctagon } from "lucide-react";

type ErrorMessageProps = {
  message: string;
};

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg flex items-center animate-fade-in">
      <AlertOctagon className="w-5 h-5 mr-2 text-red-600 flex-shrink-0" />
      <p className="font-medium">{message}</p>
    </div>
  );
};

export default ErrorMessage;