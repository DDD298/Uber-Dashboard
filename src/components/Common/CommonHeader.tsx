"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMenuSidebar } from "@/stores/useMenuSidebar";
import { mdiLoading } from "@mdi/js";
import { Icon } from "@mdi/react";
import type React from "react";
import { useRef, useState } from "react";
import { useUser } from "@/context/useUserContext";
import { HamburgerMenu } from "iconsax-reactjs";
import { IconLogout } from "@tabler/icons-react";

export default function CommonHeader() {
  const { toggle } = useMenuSidebar();
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const isLoading = false;
  const { logoutUser } = useUser();

  const handleSearchSubmit = () => {};
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm((e.target as HTMLInputElement).value);
  };
  return (
    <>
      <div
        className="w-full fixed top-0 left-0 right-0 z-50
      p-4 px-4 bg-mainDarkBackgroundV1 border-b border-b-darkBorderV1 flex justify-between items-center h-[78px]"
        suppressHydrationWarning
      >
        <div className="flex items-center w-[244px] justify-between">
          <button
            onClick={toggle}
            className="bg-[#29323A] flex items-center justify-center hover:bg-[#29323A]/80 !text-white/70 !p-0 !h-10 !w-10 rounded-full"
          >
            <HamburgerMenu size="20" color="#fff" />
          </button>
        </div>
        <div className="relative hidden md:block">
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center gap-4"
          >
            <div className="relative w-[440px] flex justify-between items-center rounded-sm bg-[#29323A]">
              <Input
                ref={inputRef}
                placeholder="Search..."
                className="w-[90%] pr-10 border-none focus:!outline-none focus:!ring-0 focus:!border-none !bg-transparent !text-white/80 placeholder:text-white/80"
                value={searchTerm}
                onChange={handleSearchChange}
                disabled={isLoading}
              />
              {isLoading && (
                <Icon
                  path={mdiLoading}
                  size={0.8}
                  spin
                  className="absolute right-[10px] top-1/2 transform -translate-y-1/2 text-mainActiveV1"
                />
              )}
            </div>
            <button
              type="submit"
              style={{ display: "none" }}
              aria-hidden="true"
            ></button>
          </form>
        </div>
        <Button
          className="bg-mainTextHoverV1 hover:bg-primary/90 text-white"
          onClick={logoutUser}
        >
          Đăng xuất
          <IconLogout className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
}
