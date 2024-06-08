import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { Categories } from "../Category/Index";
import UpdateModal from "../UpdateModal";

export type Modalprop = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onDelete: (categoryId: string) => void;
  category: Categories;
};
const MiniModal = ({ isOpen, setIsOpen, onDelete, category }: Modalprop) => {
  if (!isOpen) return null;

  return (
    <div className=" border flex flex-row absolute right-0 transition-all duration-150 ease-in-out  bottom-4 gap-2">
      {isOpen ? (
        <>
          <UpdateModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            category={category}
          />
        </>
      ) : (
        <>
          <Button
            variant={"outline"}
            onClick={() => {
              setIsOpen(false);
            }}
            size={"sm"}
          >
            Update
          </Button>
        </>
      )}
      <Button
        variant={"outline"}
        size={"sm"}
        onClick={() => {
          onDelete(category?.id!);
          setIsOpen(false);
        }}
      >
        delete
      </Button>
    </div>
  );
};

export default MiniModal;
