import { TaskId } from "@/app/layout";
import { motion } from "framer-motion";
import Image from "next/image";
import React, { FunctionComponent, useState } from "react";

const App: FunctionComponent<{
  onClick: VoidFunction;
  title: string;
  thumbnail: string;
  className?: string;
  setActive: (title: string) => void;
  isActive: boolean;
}> = ({ onClick, thumbnail, title, className, setActive, isActive }) => {
  const handleClick = () => {
    onClick();
    setActive("");
  };
  return (
    <motion.li
      drag
      onClick={() => setActive(title)}
      dragElastic={false}
      dragMomentum={false}
      tabIndex={0}
      dragSnapToOrigin
      className={`max-w-[70px] outline-none ui-button !rounded-[2px] flex flex-col items-center ${
        isActive ? "bg-white/20" : ""
      }`}
      onDoubleClick={handleClick}
      onKeyDown={(e) => {
        e.preventDefault();
        if (e.key === "Enter") {
          handleClick();
        }
      }}
    >
      <div
        className={`relative size-[37px] pointer-events-none mb-1.5 ${
          className || ""
        }`}
      >
        <div className="relative size-full">
          <Image
            src={thumbnail}
            priority
            blurDataURL={thumbnail}
            alt={`${title} image`}
            fill
            className="object-contain"
            loading="eager"
            quality={100}
            //   placeholder="blur"
          />
        </div>
      </div>
      <p className="text-[11.6px] px-2 text-center w-[90px] ">{title}</p>
    </motion.li>
  );
};

export default App;
