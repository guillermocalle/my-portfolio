import Image from "next/image";
import { MdClose } from "react-icons/md";
import { TfiWorld } from "react-icons/tfi";
import SkillComponent from "./SkillComponent";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { useEffect, useId, useRef } from "react";

const Modal = ({ state, details, toggleModal }) => {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    if (!state) return;
    const opener = document.activeElement;
    const dialog = dialogRef.current;
    const focusable = () => Array.from(dialog.querySelectorAll(
      'button:not([disabled]), a[href], [tabindex="0"]'
    )).filter((element) => element.getClientRects().length > 0);

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        toggleModal();
      } else if (event.key === "Tab") {
        const elements = focusable();
        const first = elements[0];
        const last = elements[elements.length - 1];
        if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    const containFocus = (event) => {
      if (!dialog.contains(event.target)) closeRef.current?.focus();
    };

    closeRef.current?.focus();
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("focusin", containFocus);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("focusin", containFocus);
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus({ preventScroll: true });
    };
  }, [state, toggleModal]);

  return state ? (
    <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} className="fixed inset-0 w-full h-screen bg-black/25 p-4 backdrop-blur z-[9999999] flex items-center justify-center">
      <button
        ref={closeRef}
        type="button"
        aria-label="Cerrar detalles del proyecto"
        onClick={toggleModal}
        className="cursor-pointer text-[25px] absolute top-6 right-6 text-black dark:text-white w-[25px] h-[25px]"
      >
        <MdClose aria-hidden="true" />
      </button>
      <div className="max-w-screen-xl w-full bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-100 dark:border-zinc-700 max-h-[80vh] overflow-x-auto">
        <div className="flex flex-wrap lg:space-x-6">
          <div className="relative w-full lg:w-[400px] rounded-lg overflow-hidden">
            <div className="pt-[56.25%]">
              <Image
                src={details.image}
                fill
                sizes="(min-width: 1024px) 400px, calc(100vw - 82px)"
                alt={`Vista previa de ${details.title}`}
                className="w-full h-full absolute inset-0"
              />
            </div>
          </div>
          <div className="flex-1 mt-5 lg:mt-0">
            <h2 id={titleId} className="text-xl md:text-2xl text-zinc-700 dark:text-zinc-400 font-bold">
              {details.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-4">
              {details.skills.map((skill) => (
                <SkillComponent skill={skill} key={skill.id} />
              ))}
            </div>
            {(details.source_code || details.demo) && (
              <div className="flex flex-wrap items-center gap-3 mt-3">
                {details.source_code && (
                  <Link
                    href={details.source_code}
                    target="_blank"
                    className="flex items-center space-x-2 bg-zinc-100 dark:bg-zinc-800 px-3 py-2 hover:text-black hover:dark:text-white"
                  >
                    <FaGithub size={18} className="text-black dark:text-white" />
                    <span className="text-sm md:text-base capitalize text-zinc-700 dark:text-white font-bold">
                      source code
                    </span>
                  </Link>
                )}
                {details.demo && (
                  <Link
                    href={details.demo}
                    target="_blank"
                    className="flex items-center space-x-2 bg-zinc-100 dark:bg-zinc-800 px-3 py-2 hover:text-black hover:dark:text-white"
                  >
                    <TfiWorld size={18} className="text-black dark:text-white" />
                    <span className="text-sm md:text-base capitalize text-zinc-700 dark:text-white font-bold">
                      demo
                    </span>
                  </Link>
                )}
              </div>
            )}
            {details.description && (
              <p className="text-base font-medium text-zinc-700 dark:text-zinc-400 leading-[20px] mt-6">
                {details.description}
              </p>
            )}
            {details.options?.length > 0 && (
              <ul className="text-base font-medium text-zinc-700 dark:text-zinc-400 leading-[20px] mt-6 list-disc pl-5">
                {details.options.map((option, index) => (
                  <li key={index}>{option}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
};

export default Modal;
