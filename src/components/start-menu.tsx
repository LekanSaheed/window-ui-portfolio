import { AnimatePresence } from "framer-motion";
import React, { FunctionComponent, useEffect } from "react";
import { motion } from "framer-motion";
import { IoPower } from "react-icons/io5";
import { LuUserRound } from "react-icons/lu";

const StartMenu: FunctionComponent<{
  open: boolean;
  setOpen: (bool: boolean) => void;
}> = ({ open, setOpen }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: "0" }}
          exit={{ y: "100%" }}
          transition={{ type: "tween", duration: 0.2 }}
          onClick={() => setOpen(false)}
          className="fixed inset-0 flex items-center justify-end flex-col bottom-[59px] z-[99] "
        >
          <section
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-800/80 w-full max-w-[600px]  h-full landscape:max-h-[85vh] border-[0.3px]
       border-gray-700/50 rounded-[8px] backdrop-blur-[30px] flex flex-col shadow-sm"
          >
            <main className="flex-1"></main>
            <footer className="h-[62px] bg-gray-900/50 flex items-center px-[60px] justify-between">
              <div className="flex items-center gap-3">
                <div className="size-[32px] bg-gray-300 rounded-full blur-[0.4px] text-gray-700 flex items-center justify-center">
                  <LuUserRound size={19} />
                </div>
                <p className="text-[12px]">Lekan Saheed</p>
              </div>
              <button className="inline-flex ui-button size-[40px] items-center justify-center">
                <IoPower size={18} />
              </button>
            </footer>
          </section>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StartMenu;
