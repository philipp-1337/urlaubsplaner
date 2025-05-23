import React from 'react';
import { Loader2 } from 'lucide-react';

const FullPageLoader = ({ message }) => (
  <div className="flex-grow flex flex-col items-center justify-center bg-gray-100 text-xl text-gray-700 py-10"> {/* Added py-10 for some padding if needed */}
    <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
    {message}
  </div>
);

export default FullPageLoader;