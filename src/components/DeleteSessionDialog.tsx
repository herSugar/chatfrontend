import * as Dialog from "@radix-ui/react-dialog";
import { FaTrash } from "react-icons/fa";

type Props = {
  onDelete: () => void;
};

export default function DeleteSessionDialog({ onDelete }: Props) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          className={`
            bg-red-500 hover:bg-red-600 
            text-white p-2 rounded-full
            transition-all duration-300 
            hover:scale-110 shadow-lg
            opacity-0 group-hover:opacity-100
            focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-400
          `}
          aria-label="Delete session"
        >
          <FaTrash className="text-xs" />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                     bg-white dark:bg-black text-black dark:text-white p-6 rounded-xl
                     shadow-lg w-[90%] max-w-md z-50 border dark:border-white/10 border-black/10"
        >
          <Dialog.Title className="text-lg font-semibold">
            Hapus Sesi?
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-gray-500 dark:text-gray-300">
            Apakah Anda yakin ingin menghapus sesi ini? Tindakan ini tidak bisa
            dibatalkan.
          </Dialog.Description>

          <div className="mt-4 flex justify-end gap-3">
            <Dialog.Close asChild>
              <button className="px-4 py-2 rounded-md border dark:border-white/20 border-black/20 hover:bg-gray-100 dark:hover:bg-white/10">
                Batal
              </button>
            </Dialog.Close>
            <button
              onClick={onDelete}
              className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
            >
              Hapus
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
