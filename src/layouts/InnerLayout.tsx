import { FC, ReactNode } from "react";
import AuthWrapper from "./AuthWrapper";

const InnerLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div
      className={`relative overflow-clip
        w-9/12 max-xl:w-[calc(80%-max(2vw,2.5rem))] max-sm:w-[calc(100%-max(2vw,2rem))]
        gap-[clamp(1rem,1.75rem+2.5vh,3rem)] rounded-2xl shadow-2xl z-10 bg-background
        p-[clamp(1rem,1rem+2vw,2rem)] max-sm:m-4 max-sm:gap-[clamp(1rem,1.25rem+1vh,2rem)]
        flex flex-col`}
    >
      <AuthWrapper>{children}</AuthWrapper>
    </div>
  );
};

export default InnerLayout;
