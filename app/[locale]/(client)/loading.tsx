import React from "react";
import { Spinner } from "@/components/ui/spinner";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[90vh] gap-6">
      {/* Glass Container */}
      <div className="p-10 rounded-2xl bg-white/10 dark:bg-black/20 backdrop-blur-md shadow-xl flex flex-col items-center gap-5">
        
        {/* Big Spinner */}
        <Spinner className="h-10 w-10" />

        {/* Text */}
        <p className="text-lg font-medium text-muted-foreground animate-pulse">
          Loading, please wait…
        </p>
      </div>
    </div>
  );
};

export default Loading;
