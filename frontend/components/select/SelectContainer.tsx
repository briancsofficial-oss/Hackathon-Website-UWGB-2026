import { cn } from "cn";
import React from "react";

function SelectContainer({
  children,
  isLight,
}: {
  readonly children: React.ReactNode;
  readonly isLight?: boolean;
}) {
  return (
    <div
      className={cn(
        "h-10 flex justify-center items-center px-2 rounded-md bg-foreground text-background",
        isLight
          ? "text-foreground bg-background"
          : "text-background bg-foreground",
      )}
    >
      {children}
    </div>
  );
}

export default SelectContainer;
