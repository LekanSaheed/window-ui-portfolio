import { TaskId, useGlobalContext, useTask } from "@/app/layout";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import moment from "moment";
import Image from "next/image";
import React, { Fragment, FunctionComponent, useRef, useState } from "react";
import { IconType } from "react-icons";
import { BsDash } from "react-icons/bs";
import { CgClose } from "react-icons/cg";
import { GrRefresh } from "react-icons/gr";
import {
  HiMiniArrowLeft,
  HiMiniArrowRight,
  HiMiniArrowUp,
} from "react-icons/hi2";

import { IoIosSquareOutline } from "react-icons/io";
import { MdOutlineRefresh } from "react-icons/md";
import { VscChromeRestore } from "react-icons/vsc";

export interface IExplorerFolder {
  displayName: string;
  type: "folder" | "link";
  path?: string;
}

const FileExplorer: FunctionComponent<{
  id: TaskId;
  folders: IExplorerFolder[];
}> = ({ id, folders = [] }) => {
  const controls = useDragControls();

  const { getTask, closeTask, minimizeTask } = useTask();

  const [maximized, setMaximized] = useState(false);

  const task = getTask(id);

  const open = !!task && task?.state === "open";

  const rightHeaderActions: { icon: IconType; onClick: VoidFunction }[] = [
    { icon: BsDash, onClick: () => minimizeTask(id) },
    {
      icon: maximized ? VscChromeRestore : IoIosSquareOutline,
      onClick: () => {
        setMaximized(!maximized);
      },
    },
    {
      icon: CgClose,
      onClick: () => closeTask(id),
    },
  ];

  const topPaneHeaderIcons: { icon: IconType; onClick: VoidFunction }[] = [
    { icon: HiMiniArrowLeft, onClick: () => {} },
    { icon: HiMiniArrowRight, onClick: () => {} },
    { icon: HiMiniArrowUp, onClick: () => {} },
    { icon: MdOutlineRefresh, onClick: () => {} },
  ];

  const [activeRow, setActiveRow] = useState<number | null>(null);

  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);

  const handleClick = () => {
    console.log("Clicekd");
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.min(folders.length - 1, index + 1);
      rowRefs.current[next]?.focus();
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = Math.max(0, index - 1);
      rowRefs.current[prev]?.focus();
    }

    if (e.key === "Enter") {
      e.preventDefault();

      console.log(index);
      handleClick();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div
          className={`fixed pointer-events-none z-[99] inset-0 flex select-none items-center justify-center ${
            maximized ? "z-[101]" : ""
          }`}
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0, y: 100 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: 100 }}
            style={{ transformOrigin: "bottom center" }}
            transition={{ duration: 0.1, type: "tween" }}
            drag
            dragControls={controls}
            dragMomentum={false}
            dragListener={false}
            className={`${
              !maximized
                ? "max-w-[700px] w-full h-[500px] rounded-[10px] border-[0.5px] border-gray-600/60 "
                : "fixed inset-0 "
            } shadow-2xl 
             flex flex-col overflow-hidden pointer-events-auto bg-gray-950/90 backdrop-blur-[100px] `}
          >
            <motion.header className="  relative">
              <div
                className="absolute left-0 right-0  bg-gray-950/50 backdrop-blur-2xl h-[90px]"
                onPointerDown={(e) => {
                  controls.start(e);
                }}
              ></div>

              <div className="inline-flex absolute right-0 top-[1px]">
                {rightHeaderActions.map((action, idx) => {
                  return (
                    <button
                      tabIndex={1}
                      onClick={action.onClick}
                      className={`inline-flex items-center justify-center h-[30px] px-[15.9px] ${
                        idx === 2
                          ? "hover:bg-red-700 transition"
                          : "ui-button !rounded-none"
                      }`}
                      key={idx}
                    >
                      {React.createElement(action.icon)}
                    </button>
                  );
                })}
              </div>
              <div className="pt-[9px]">
                <div
                  className="ml-[9px] z-[1] relative flex  
                justify-between items-center bg-white/5 py-[5px] rounded-t-[8px] w-[238px] pl-2 pr-[5px]"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="relative shrink-0 size-[19px]">
                      <Image
                        src={`/app-icons/${task?.thumbnail}`}
                        alt=""
                        fill
                      />
                    </div>
                    <p className="text-[11px] font-medium">
                      {task?.displayName}
                    </p>
                  </div>
                  <div
                    onClick={() => closeTask(id)}
                    className="ui-button px-[8.5px] py-[4.5px]"
                  >
                    <CgClose size={13.5} />
                  </div>
                </div>
                <ul className="bg-white/5 px-2.5 py-2 relative z-[1] flex gap-[15px] border-b-[0.5px] border-b-gray-600/60">
                  {topPaneHeaderIcons.map((action, idx) => {
                    return (
                      <li
                        key={idx}
                        className="size-[33px] ui-button inline-flex items-center justify-center"
                      >
                        {React.createElement(action.icon, { size: 18 })}
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="border-b border-b-gray-600/60 p-3">Hello</div>
            </motion.header>
            <div className="flex h-full flex-1 min-h-0">
              <nav className="shrink-0 overflow-y-auto mt-4 w-[153px]">
                <div className="h-[700px]"></div>
              </nav>
              <main className="overflow-y-auto pl-3.5 flex-1 ml-2 border-l border-l-gray-600/60">
                <table className="text-left">
                  <thead>
                    <tr className=" text-[12px] [&>th]:py-1 [&>th]:px-2 [&>th]:opacity-90 [&>th]:border-r [&>th]:border-r-gray-500">
                      <th className="font-normal !pl-[16px] ">Name</th>
                      <th className="font-normal !pr-[60px]">Date Modified</th>
                      <th className="font-normal">Type</th>
                    </tr>
                  </thead>
                  <tbody className="">
                    <tr>
                      <td className="h-[5px]" />
                    </tr>
                    {folders?.map((folder, id) => {
                      return (
                        <Fragment key={id}>
                          <tr
                            onDoubleClick={() => {
                              handleClick();
                            }}
                            ref={(el) => {
                              rowRefs.current[id] = el;
                            }}
                            tabIndex={0}
                            onFocus={() => setActiveRow(id)}
                            onKeyDown={(e) => handleKeyDown(e, id)}
                            className={`text-[12px] pl-3 pr-1  [&>td]:py-1
                           [&>td]:px-2 outline-none focus:!border-white hover:bg-gray-500/50 ${
                             activeRow === id ? "bg-gray-500/50" : ""
                           } mb-[10px] border-[0.5px] border-transparent`}
                          >
                            <td className="w-[270px] ">
                              <span className="flex gap-1">
                                <div className="relative size-[16px]">
                                  <Image
                                    src={"/app-icons/folder.png"}
                                    alt=""
                                    priority
                                    fill
                                  />
                                </div>
                                {folder?.displayName}
                              </span>
                            </td>
                            <td>{moment().format("MM/DD/YYYY hh:mm A")}</td>
                            <td>
                              {folder?.type === "folder"
                                ? "File Folder"
                                : folder?.type === "link"
                                ? "External Link"
                                : ""}
                            </td>
                          </tr>
                          <tr className="h-1" />
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </main>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FileExplorer;
