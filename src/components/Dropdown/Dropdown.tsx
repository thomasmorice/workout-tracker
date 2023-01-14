import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { AiOutlinePlus } from "react-icons/ai";

type DropdownProps = {
  containerClass?: string;
  children: React.ReactElement;
  buttons: {
    label: string;
    onClick: () => void;
  }[];
};

export default function Dropdown({
  containerClass,
  children,
  buttons,
}: DropdownProps) {
  return (
    <Menu as="div" className={`dropdown z-40 ${containerClass} `}>
      <Menu.Button>{children}</Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-50"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-50"
      >
        <div className="border-none">
          <Menu.Items
            as={"ul"}
            className="dropdown-content menu rounded-box w-52 gap-1 bg-base-300 p-2 text-sm shadow-lg"
          >
            {buttons.map((button) => (
              <Menu.Item as={"li"} key={button.label}>
                {({ active }) => (
                  <a
                    onClick={button.onClick}
                    className={`${
                      active ? "bg-primary" : ""
                    } group flex w-full items-center rounded-md text-sm text-base-content`}
                  >
                    {button.label}
                  </a>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </div>
      </Transition>
    </Menu>
  );
}
