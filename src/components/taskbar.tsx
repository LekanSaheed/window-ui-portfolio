import moment from "moment";
import Image from "next/image";
import React, { FunctionComponent } from "react";
import { BsBatteryHalf, BsWifi } from "react-icons/bs";
import { IoSearch, IoWifi } from "react-icons/io5";
import { PiCaretUpBold } from "react-icons/pi";
import { RxSpeakerLoud } from "react-icons/rx";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useTask } from "@/app/layout";
import { FaWifi } from "react-icons/fa6";
import { CiWifiOn } from "react-icons/ci";
import { HiOutlineSpeakerWave } from "react-icons/hi2";

const TaskBar: FunctionComponent<{
  clickFunctions: { onStartMenuClick: VoidFunction };
  state: { startMenu: boolean };
}> = ({ clickFunctions, state }) => {
  const { tasks, registerTask, minimizeTask } = useTask();
  return (
    <div
      className="dark:bg-gray-900/90 backdrop-blur-[10px] 
     fixed bottom-0 select-none left-0 right-0 h-[48px] border-t-[0.3px] border-t-gray-400/30 flex items-center justify-center z-[100]"
    >
      <LayoutGroup>
        <motion.div layout="position" transition={{ type: "tween" }}>
          <motion.button
            transition={{ type: "tween" }}
            onClick={clickFunctions.onStartMenuClick}
            className={`inline-flex mr-[5px] items-center justify-center size-[41px] 
       cursor-pointer ui-button ${state.startMenu ? "ui-button-no-hover" : ""}`}
          >
            <motion.span className="block" whileTap={{ scale: 0.8 }}>
              <span className="relative block size-[25px] pointer-events-none">
                <Image
                  alt="start button"
                  src={"/task-bar/start-menu.jpg"}
                  fill
                />
              </span>
            </motion.span>
          </motion.button>
          <motion.div
            className="w-[220px] inline-flex items-center rounded-full h-[30.4px] border-t-[0.3px] border-t-gray-400/40 cursor-text
       bg-gray-400/30 hover:bg-gray-500/60 transition-all px-[10px]"
          >
            <IoSearch size={18} className="mr-2 " />
            <span className="text-[14px] opacity-90">Search</span>
          </motion.div>
        </motion.div>
        <motion.ul
          layout="position"
          transition={{ type: "tween" }}
          className="ml-1 flex gap-1"
        >
          <AnimatePresence mode="popLayout">
            {tasks.map((task) => {
              const isOpen = task.state === "open";
              return (
                <motion.li
                  transition={{ type: "tween" }}
                  layout="position"
                  key={task.id}
                  onClick={() => {
                    if (task.state === "open") {
                      minimizeTask(task.id);
                    } else {
                      registerTask(task);
                    }
                  }}
                  className={`inline-flex flex-col items-center mr-[5px]  justify-center size-[38px] 
       cursor-pointer ui-button ${isOpen ? "ui-button-no-hover" : ""}`}
                >
                  <motion.span className="block" whileTap={{ scale: 0.8 }}>
                    <span className="relative block size-[26px] pointer-events-none">
                      <Image
                        alt={task.id}
                        priority
                        className="object-contain"
                        src={`/app-icons/${task.thumbnail}`}
                        fill
                      />
                    </span>
                  </motion.span>
                  <div className="h-[3.5px] w-[6.5px] rounded-full mt-[2px] bg-white/50" />
                </motion.li>
              );
            })}
          </AnimatePresence>
        </motion.ul>
      </LayoutGroup>
      <RightPanel />
    </div>
  );
};

const RightPanel = () => {
  return (
    <div className="absolute flex items-center right-0 top-0 bottom-0 py-1 px-[12px]">
      <div className="ui-button h-full px-2 flex items-center justify-center">
        <PiCaretUpBold size={16} />
      </div>
      <WifiAndBattery />
      <TimeAndDate />
    </div>
  );
};

const WifiAndBattery = () => {
  const icons = [BsWifi, HiOutlineSpeakerWave, BsBatteryHalf];
  return (
    <div className="flex items-center gap-2 px-2 py-1 ui-button h-full">
      {icons.map((i, id) => {
        return <span key={id}>{React.createElement(i, { size: 17 })}</span>;
      })}
    </div>
  );
};

const TimeAndDate = () => {
  return (
    <div className="text-end text-[12px] ui-button px-2 py-1 cursor-default h-full">
      <p className="leading-[110%]">{moment().format("h:mm A")}</p>
      <p className="">{moment().format("M/D/YYYY")}</p>
    </div>
  );
};
export default TaskBar;
