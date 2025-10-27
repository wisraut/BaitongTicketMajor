import React from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react"; //ลงheroicon และ import library             npm install @heroicons/react
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { AiOutlineSearch } from "react-icons/ai";
import { ShoppingCartIcon } from "@heroicons/react/24/outline"; //      npm install @heroicons/react

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
    // nav bar
    <Disclosure
      as="nav"
      className="fixed inset-x-0 top-0 z-50 w-full bg-[#234C6A]"
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
        {/* nav bar*/}

        {/* logo */}
        <div className="flex flex-1 items-center justify-start gap-6">
          <div className="flex shrink-0 items-center">
            <img
              src="/logo.png"
              alt="BaiTongTicketLogo"
              className="h-16 w-auto sm:h-20 md:h-24"
            />
          </div>
          {/* logo */}

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
        <div className="hidden sm:flex items-center ml-2">
          <form className="relative">
            <input
              type="search"
              name="q"
              aria-label="Search"
              placeholder="ค้นหา..."
              className="w-56 rounded-full bg-cyan-800 opacity-40 px-4 py-2 pr-10 text-sm text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-full  bg-cyan-800 hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Submit search"
            >
              <AiOutlineSearch className="w-5 text-white" />
            </button>
          </form>
        </div>

        {/* shoppingcart */}
        <div className="hidden sm:flex items-center sm:ml-6">
          <button
            type="button"
            className="relative p-2 rounded-full bg-cyan-800 hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Shopping Cart"
          >
            <ShoppingCartIcon className="w-6 text-white" />
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
              3
            </span>
          </button>
        </div>
        {/* shoppingcart */}

        {/* searchbar */}
        <div className="absolute right-8 inset-y-0 flex items-center gap-4 sm:static sm:inset-auto sm:ml-2 sm:pr-4">
          <Menu as="div" className="relative ml-3">
            <MenuButton className="flex rounded-full bg-[#234C6A] text-sm focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500">
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
