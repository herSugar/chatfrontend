import * as Dialog from "@radix-ui/react-dialog";
import { useNavigate } from "react-router-dom";

export default function ModalLogout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="w-full text-left text-red-900 font-medium hover:underline">
          🚪 Logout
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" />
        <Dialog.Content
          className="
            fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
            bg-white dark:bg-black text-black dark:text-white
            p-6 rounded-xl shadow-lg w-[90%] max-w-md z-50
            border dark:border-white/10 border-black/10
          "
        >
          <Dialog.Title className="text-lg font-semibold">Logout</Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-gray-500 dark:text-gray-300">
            Are you sure you want to log out?
          </Dialog.Description>

          <div className="mt-4 flex justify-end gap-3">
            <Dialog.Close asChild>
              <button className="px-4 py-2 rounded-md border dark:border-white/20 border-black/20 hover:bg-gray-100 dark:hover:bg-white/10">
                Cancel
              </button>
            </Dialog.Close>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
