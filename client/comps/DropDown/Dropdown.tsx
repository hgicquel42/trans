import { createPopper, VirtualElement } from "@popperjs/core";
import { Anchor } from "comps/next/anchor";
import { useTheme } from "comps/theme/context";
import { useStatic } from "libs/react/object";
import Link from "next/link";
import React, { createRef, useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaRegLightbulb } from 'react-icons/fa';

export function Modal(props: {
  children: React.ReactNode
}) {
  const div = useStatic(() => document.createElement("div"))

  useEffect(() => {
    document.body.appendChild(div)
    return () => void document.body.removeChild(div)
  }, [])

  return createPortal(<>{props.children}</>, div)
}

export function DropdownBoardButton() {
  const [dropdownPopoverShow, setDropdownPopoverShow] = useState(false);
  const btnDropdownRef = createRef();
  const popoverDropdownRef = createRef();
  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "bottom-start"
    });
    setDropdownPopoverShow(true);
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };

  return (
    <>
      <button className=" w-12 h-12" type="button" ref={btnDropdownRef}
        onClick={() => {
          dropdownPopoverShow
            ? closeDropdownPopover()
            : openDropdownPopover();
        }}>
        <img src="https://pbs.twimg.com/profile_images/1385891929917992960/J7hK0tks_400x400.jpg" className="w-12 h-12 rounded-full" alt="" />
      </button>
      {dropdownPopoverShow && <>

        <Modal>
          <div className="absolute inset-0"
            onClick={closeDropdownPopover} />
        </Modal>
      </>}
      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? "block " : "hidden ") +
          "font-pixel py-2 text-center rounded shadow-lg bg-zinc-300 border-2 border-black z-10"
        }
        style={{ minWidth: "12rem" }}
      >
        <Anchor
          href="/profil"
          className="text-sm py-2 px-4 block bg-transparent text-zinc-800 hover:underline"
        >
          Profil
        </Anchor>
        <div className="h-0 my-2 border border-solid border-t-0 border-black" />
        <a
          className="text-sm py-2 px-4 block bg-transparent text-zinc-800 hover:underline"
        >
          Invite Friend
        </a>
      </div>
    </>
  );
}


export function DropdownBoardFriendButton() {
  const [dropdownPopoverShow, setDropdownPopoverShow] = useState(false);
  const btnDropdownRef = createRef();
  const popoverDropdownRef = createRef();
  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "bottom-start"
    });
    setDropdownPopoverShow(true);
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };

  return (
    <>
      <button className=" w-12 h-12" type="button" ref={btnDropdownRef}
        onClick={() => {
          dropdownPopoverShow
            ? closeDropdownPopover()
            : openDropdownPopover();
        }}>
        <img src="https://pbs.twimg.com/profile_images/1385891929917992960/J7hK0tks_400x400.jpg" className="w-12 h-12 rounded-full" alt="" />
      </button>
      {dropdownPopoverShow && <>

        <Modal>
          <div className="absolute inset-0"
            onClick={closeDropdownPopover} />
        </Modal>
      </>}
      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? "block " : "hidden ") +
          "font-pixel py-2 text-center rounded shadow-lg bg-zinc-300 border-2 border-black z-10"
        }
        style={{ minWidth: "12rem" }}
      >
        <Anchor
          href="/profil"
          className="text-sm py-2 px-4 block bg-transparent text-zinc-800 hover:underline"
        >
          Profil
        </Anchor>
        <div className="h-0 my-2 border border-solid border-t-0 border-black" />
        <a
          className="text-sm py-2 px-4 block bg-transparent text-zinc-800 hover:underline"
        >
          Play With
        </a>
        <div className="h-0 my-2 border border-solid border-t-0 border-black" />
        <a
          className="text-sm py-2 px-4 block bg-transparent text-zinc-800 hover:underline"
        >
          Chat With
        </a>
      </div>
    </>
  );
}

export function DropdownHomeButton() {

  const theme = useTheme()
  const [dropdownPopoverShow, setDropdownPopoverShow] = useState(false);
  const btnDropdownRef = createRef<Element | VirtualElement>();
  const popoverDropdownRef = createRef<ButtonHTMLAttributes<HTMLButtonElement> | HTMLButtonElement>();
  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "bottom-start"
    });
    setDropdownPopoverShow(true);
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };

  const switchTheme = useCallback(() => {
    if (theme.stored === "dark")
      theme.set("light")
    else if (theme.stored === "light")
      theme.set(undefined)
    else if (theme.stored === undefined)
      theme.set("dark")
  }, [theme.stored])

  return (
    <>
      <div className="w-full max-w-[1200px] m-auto p-4">
        <div className="flex justify-between">
          <div className="flex justify-start pt-6">
            <div className="text-sm font-pixel pt-7 uppercase">{theme.stored ?? "auto"}</div>
            <button className="px-2 py-2 w-28"
              onClick={switchTheme}>
              <FaRegLightbulb className="w-12 h-12 rounded-full text-opposite" />
            </button>
          </div>
          <div className="flex justify-end pt-6">
            <div className="text-sm font-pixel pt-7">TEST</div>
            <button className="px-2 py-2 w-24" type="button" ref={btnDropdownRef}
              onClick={() => {
                dropdownPopoverShow
                  ? closeDropdownPopover()
                  : openDropdownPopover();
              }}>
              <img src="https://pbs.twimg.com/profile_images/1385891929917992960/J7hK0tks_400x400.jpg" className="w-12 h-12 rounded-full" alt="" />
            </button>
            {dropdownPopoverShow && <>

              <Modal>
                <div className="absolute inset-0"
                  onClick={closeDropdownPopover} />
              </Modal>
            </>}
            <div
              ref={popoverDropdownRef}
              className={
                (dropdownPopoverShow ? "block " : "hidden ") +
                "z-10 font-pixel py-2 text-center rounded shadow-lg bg-zinc-300 border-2 border-black"
              }
              style={{ minWidth: "12rem" }}
            >
              <Link href='/profil' passHref>
                <Anchor
                  href="/profil"
                  className="text-sm py-2 px-4 block bg-transparent text-zinc-800 hover:underline"
                >
                  Profil
                </Anchor>
              </Link>

              <div className="h-0 my-2 border border-solid border-t-0 border-black" />
              <a
                className="text-sm py-2 px-4 block bg-transparent text-zinc-800 hover:underline"
              >
                Disconnect
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};