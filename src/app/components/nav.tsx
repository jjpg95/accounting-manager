import {
  Disclosure,
  DisclosureButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, BellIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import useNav from "../hooks/useNav";
import MobileNav from "./mobileNav";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Nav() {
  const { navigation, user, userNavigation, imageUrl } = useNav();

  return (
    <Disclosure as="nav" className="bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo y Navegación Principal */}
          <div className="flex items-center">
            <Image src={imageUrl} alt="Logo" width={30} height={30} />
            <div className="hidden md:flex ml-10 space-x-4">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "rounded-md px-3 py-2 text-sm font-medium"
                  )}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          {/* Botones de Perfil y Notificaciones */}
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <button
                type="button"
                className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="size-6" aria-hidden="true" />
              </button>
            )}
            <Menu as="div" className="relative">
              <MenuButton className="flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white">
                <Image
                  alt="User"
                  src={user ? user.imageUrl : imageUrl}
                  className="size-8 rounded-full"
                  width={20}
                  height={20}
                />
              </MenuButton>
              <MenuItems className="absolute right-0 mt-2 w-48 bg-white shadow-lg ring-1 ring-black/5">
                {userNavigation.map((item) => (
                  <MenuItem key={item.name}>
                    <a
                      href={item.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {item.name}
                    </a>
                  </MenuItem>
                ))}
              </MenuItems>
            </Menu>
          </div>

          {/* Botón de Menú Móvil */}
          <div className="flex md:hidden">
            <DisclosureButton className="rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white">
              <Bars3Icon className="size-6" aria-hidden="true" />
            </DisclosureButton>
          </div>
        </div>
      </div>
      <MobileNav
        navigation={navigation}
        user={user}
        userNavigation={userNavigation}
      />
    </Disclosure>
  );
}
