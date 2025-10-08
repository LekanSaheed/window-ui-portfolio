"use client";

import App from "@/components/desktop/app";
import FileExplorer from "@/components/file-explorer";
import useStateReducer from "@/hooks/useStateReducer";
import { motion } from "framer-motion";
import React, { useRef, useState } from "react";
import { useTask } from "./layout";

const Home = () => {
  const { registerTask } = useTask();

  const [active, setActive] = useState("");

  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      // containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const appsAndFolders: {
    title: string;
    onClick: VoidFunction;
    thumbnail: string;
    className?: string;
  }[] = [
    {
      title: "My Portfolio",
      onClick: () => {
        registerTask({
          id: "portfolio",
          thumbnail: "portfolio.png",
          displayName: "My Portfolio",
        });
      },
      thumbnail: "portfolio.png",
    },
    {
      title: "My Resume",
      onClick: () => {
        registerTask({
          id: "resume",
          thumbnail: "resume.png",
          displayName: "My Resume",
        });
      },
      thumbnail: "resume.png",
    },
    {
      title: "Github",
      onClick: () => {
        window.open("https://github.com/lekansaheed", "_blank");
      },
      thumbnail: "github.webp",
      className: "p-0.5",
    },
    {
      title: "LinkedIn",
      onClick: () => {
        window.open(
          "https://www.linkedin.com/in/lekan-saheed-90a8a421b",
          "_blank"
        );
      },
      thumbnail: "linkedin.webp",
      className: "p-1",
    },
    {
      title: "X",
      onClick: () => {
        window.open("https://x.com/lekansaheeddev", "_blank");
      },
      thumbnail: "x.png",
    },
    { title: "Facebook", onClick: () => {}, thumbnail: "facebook.png" },
    {
      title: isFullscreen ? "Exit Full Screen" : "Toggle Full Screen",
      onClick: () => {
        toggleFullscreen();
      },
      thumbnail: isFullscreen ? "exit-fullscreen.png" : "fullscreen.png",
      className: "bg-gray-100/90 rounded-[10px]",
    },
  ];

  return (
    <div ref={containerRef} className="py-[10px]">
      <ul className="grid grid-cols-2 w-fit gap-y-[25px] gap-x-[10px]">
        {appsAndFolders.map((folder, id) => {
          return (
            <App
              {...folder}
              key={id}
              thumbnail={`/app-icons/${folder?.thumbnail}`}
              setActive={setActive}
              isActive={folder?.title === active}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default Home;
