"use client";;
import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type TabsProps = {
  tabs: TabType[];
  containerClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
  contentClassName?: string;
};

export const Tabs = ({
  tabs: propTabs,
  containerClassName,
  activeTabClassName,
  tabClassName,
  contentClassName
}: TabsProps) => {
  const [active, setActive] = useState(propTabs[0]);
  const [tabs, setTabs] = useState(propTabs);

  interface MoveSelectedTabToTop {
    (idx: number): void;
  }

  const moveSelectedTabToTop: MoveSelectedTabToTop = (idx) => {
    const newTabs: TabType[] = [...propTabs];
    const selectedTab: TabType[] = newTabs.splice(idx, 1);
    if (selectedTab[0]) {
      newTabs.unshift(selectedTab[0]);
      setTabs(newTabs);
      setActive(newTabs[0]);
    }
  };

  const [hovering, setHovering] = useState(false);

  return (
    <>
      <div
        className={cn(
          "flex flex-row items-center justify-start [perspective:1000px] relative overflow-auto sm:overflow-visible no-visible-scrollbar max-w-full w-full",
          containerClassName
        )}>
        {propTabs.map((tab: TabType, idx: number) => (
          <button
            key={tab.title}
            onClick={() => {
              moveSelectedTabToTop(idx);
            }}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            className={cn("relative px-4 py-2 rounded-full", tabClassName)}
            style={{
              transformStyle: "preserve-3d",
            }}>
            {active?.value === tab.value && (
              <motion.div
          layoutId="clickedbutton"
          transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
          className={cn(
            "absolute inset-0 bg-gray-800 border-white/10 border-0 rounded-full ",
            activeTabClassName
          )} />
            )}

            <span className="relative block text-white">
              {tab.title}
            </span>
          </button>
        ))}
      </div>
      <FadeInDiv
        tabs={tabs}
        key={active?.value}
        hovering={hovering}
        className={cn("mt-5", contentClassName)} />
    </>
  );
};

type TabType = {
  title: string;
  value: string;
  content: React.ReactNode;
};

interface FadeInDivProps {
  className?: string;
  tabs: TabType[];
  hovering: boolean;
}

export const FadeInDiv = ({
  className,
  tabs,
}: FadeInDivProps) => {
  const activeTab = tabs[0];
  return (
    <div className={cn("relative w-full h-full", className)}>
      {activeTab && (
        <div className="w-full absolute h-full">
          {activeTab.content}
        </div>
      )}
    </div>
  );
};
