import React from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react"; //ลงheroicon และ import library
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { AiOutlineSearch } from "react-icons/ai";

const navigation = [
  { name: "ทุกการแสดง", href: "#", current: true },
  { name: "GiftShop", href: "#", current: false },
  { name: "Promotions", href: "#", current: false },
];

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function Header() {
  return (
    <Disclosure
      as="nav"
      className="fixed inset-x-0 top-0 z-50 w-full bg-gray-800 ..."
    >
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8"></div>
      <div className="relative flex h-20 items-center justify-between">
        <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500">
            <span className="absolute -inset-0.5" />
            <span className="sr-only"> Open main menu </span>
            <Bars3Icon
              aria-hidden="true"
              className="block size-6 group-data-open:hidden"
            />
            <XMarkIcon
              aria-hidden="true"
              className="hidden size-6 group-data-open:block"
            />
          </DisclosureButton>
        </div>
        <div className="flex flex-1 items-center justify-start gap-6">
          <div className="flex shrink-0 items-center">
            <img
              src="/logo.png"
              alt="BaiTongTicketLogo"
              className="h-16 w-auto sm:h-20 md:h-24"
            />
          </div>
          <div className="hidden sm:block">
            <div className="flex space-x-4">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  aria-current={item.current ? "page" : undefined}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white dark:bg-gray-950/50"
                      : "text-gray-300 hover:bg-white/5 hover:text-white",
                    "rounded-md px-3 py-2 text-sm font-medium"
                  )}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </div>
        {/* searchbar */}
        <div className="p-20 hidden sm:flex items-center">
          <form className="relative">
            <input
              type="search"
              name="q"
              aria-label="Search"
              placeholder="ค้นหา..."
              className="w-56 rounded-full bg-gray-700 px-4 py-2 pr-10 text-sm text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-full bg-gray-700"
              aria-label="Submit search"
            >
              <AiOutlineSearch className=" w-5 text-white" />
            </button>
          </form>
        </div>
        {/* searchbar */}
        <div className="absolute right-4 inset-y-0 flex items-center gap-3">
          <Menu as="div" className="relative ml-3">
            <MenuButton className="flex rounded-full bg-gray-800 text-sm focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500">
              <span className="absolute -inset-1.5" />
              <span className="sr-only">Open user menu</span>
              <img
                src="/profile.jpg"
                className="size-8 rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10"
              />
            </MenuButton>

            <MenuItems
              transition
              className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              <a
                href="#"
                className="block px-4 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden dark:text-gray-800 dark:data-focus:bg-white/5"
              >
                Your Profile
              </a>

              <MenuItem>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden dark:text-gray-800 dark:data-focus:bg-white/5"
                >
                  Settings
                </a>
              </MenuItem>
              <MenuItem>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden dark:text-gray-800 dark:data-focus:bg-white/5"
                >
                  Sign out
                </a>
              </MenuItem>
            </MenuItems>
          </Menu>
        </div>
      </div>
      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aira-current={item.current ? "page" : undefined}
              className={classNames(
                item.current
                  ? "bg-gray-900 text-white dark:bg-gray-950/50"
                  : "text-gray-300 hover:bg-white/5 hover:text-white",
                "block rounded-md px-3 py-2 text-base font-medium"
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
