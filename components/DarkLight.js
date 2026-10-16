"use client";
import { FaCloudMoon } from "react-icons/fa";
import { LuSunMoon } from "react-icons/lu";
import { useTheme } from "next-themes";
import classNames from "classnames";
import { useEffect, useState } from "react";

const DarkLight = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // next-themes recommends mounting only the theme-dependent control.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Activar tema claro" : "Activar tema oscuro"}
      aria-pressed={isDark}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="fixed top-4 right-4 w-12 h-[18px] rounded-full bg-violet-300 flex items-center"
    >
      <span
        className={classNames(
          "w-7 h-7 flex items-center justify-center bg-indigo-700 rounded-full transition-all duration-500 motion-reduce:transition-none",
          {
            "ml-5": isDark,
          }
        )}
      >
        {!isDark ? (
          <FaCloudMoon className="text-white" size={14} />
        ) : (
          <LuSunMoon className="text-white" size={14} />
        )}
      </span>
    </button>
  );
};

export default DarkLight;
