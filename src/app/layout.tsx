"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TaskBar from "@/components/taskbar";
import Image from "next/image";
import StartMenu from "@/components/start-menu";

import {
  createContext,
  Dispatch,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import useStateReducer from "@/hooks/useStateReducer";
import FileExplorer, { IExplorerFolder } from "@/components/file-explorer";

export type TaskId = "portfolio" | "resume";

interface Task {
  state: TaskState;
  id: TaskId;
  thumbnail: string;
  displayName: string;
  initialCordinates: {
    x: number;
    y: number;
  };
}

type TaskState = "open" | "minimized";

type State = { tasks: Task[]; activeTask: TaskId };

type Action =
  | { type: "register"; payload: Omit<Task, "state" | "initialCordinates"> }
  | { type: "close-task"; payload: TaskId }
  | { type: "minimize-task"; payload: TaskId }
  | { type: "set-active-task"; payload: TaskId };

export interface AppContextType {
  state: State;
  dispatch: Dispatch<Action>;
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "register": {
      const task = { ...action.payload, state: "open" } as Task;

      const existingTask = state.tasks.find((t) => t.id === action.payload.id);

      const noTask = state.tasks.length < 1;

      const lastTask = state.tasks[state.tasks.length - 1];

      if (noTask) {
        task.initialCordinates = {
          x: 0,
          y: 0,
        };
      } else {
        task.initialCordinates = {
          x: lastTask.initialCordinates?.x + 70,
          y: lastTask.initialCordinates?.y + 70,
        };
      }

      if (!!existingTask) {
        return {
          ...state,
          tasks: state.tasks.map((task) => {
            if (task.id === action.payload?.id) {
              return {
                ...task,
                state: "open",
              };
            }
            return task;
          }),
          activeTask: task.id,
        };
      }

      return { ...state, tasks: [...state.tasks, task], activeTask: task.id };
    }
    case "close-task": {
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    }
    case "minimize-task": {
      const isActive = action.payload === state.activeTask;

      if (!isActive) {
        return {
          ...state,
          activeTask: action.payload,
        };
      }
      return {
        ...state,
        tasks: state.tasks.map((task) => {
          if (task.id === action.payload) {
            return {
              ...task,
              state: "minimized",
            };
          }
          return task;
        }),
      };
    }
    case "set-active-task": {
      return {
        ...state,
        activeTask: action.payload,
      };
    }
    default:
      return state;
  }
};

const AppContext = createContext<AppContextType>({} as AppContextType);

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, {
    tasks: [],
    activeTask: "" as TaskId,
  });

  return (
    <AppContext.Provider value={{ dispatch, state }}>
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => useContext(AppContext);

export const useTask = () => {
  const { state, dispatch } = useGlobalContext();

  const getTask = (taskId: TaskId) => {
    const tasks = state.tasks;

    const task = tasks.find((t) => t?.id === taskId);

    return task;
  };

  const registerTask = ({
    id,
    thumbnail,
    displayName,
  }: {
    id: TaskId;
    thumbnail: string;
    displayName: string;
  }) => {
    dispatch({
      type: "register",
      payload: {
        id,
        thumbnail,
        displayName,
      },
    });
  };

  const closeTask = (id: TaskId) => {
    dispatch({ type: "close-task", payload: id });
  };

  const minimizeTask = (id: TaskId) => {
    dispatch({ type: "minimize-task", payload: id });
  };

  const setActive = (id: TaskId) => {
    dispatch({ type: "set-active-task", payload: id });
  };

  return {
    getTask,
    registerTask,
    closeTask,
    tasks: state.tasks,
    minimizeTask,
    setActive,
    activeTask: state.activeTask,
  };

  // const findTask = state.tasks.
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { handleStateChange, state } = useStateReducer({ startMenu: false });

  const bodyRef = useRef<HTMLBodyElement | null>(null);

  const portfolioProjects: IExplorerFolder[] = [
    { displayName: "UCEE MFB", type: "link", path: "https://app.getucee.com" },
    {
      displayName: "Chaindustry",
      type: "link",
      path: "https://app.chaindustry.io",
    },
    {
      displayName: "InflowBit (Formerly InflowChange)",
      type: "link",
      path: "https://inflowbit.com",
    },
    {
      displayName: "Cloudax",
      type: "link",
      path: "https://www.cloudax.io",
    },
  ];

  return (
    <html lang="en">
      <body ref={bodyRef} className={` antialiased relative`}>
        <AppProvider>
          <div className="fixed inset-0 z-0">
            <Image
              alt="wallpaper"
              objectFit="cover"
              src={"/wallpaper.jpg"}
              fill
            />
          </div>
          <div className="z-[1] fixed inset-0 ">{children}</div>

          <TaskBar
            clickFunctions={{
              onStartMenuClick: () =>
                handleStateChange({ startMenu: !state.startMenu }),
            }}
            state={state}
          />
          <FileExplorer folders={portfolioProjects} id="portfolio" />
          <FileExplorer id="resume" folders={[]} />
          <StartMenu
            open={state.startMenu}
            setOpen={(bool) => handleStateChange({ startMenu: bool })}
          />
        </AppProvider>
      </body>
    </html>
  );
}
