import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Categories } from "../Category/Index";
type UpdateModalProp = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  category: Categories;
};

const UpdateModal = ({ isOpen, setIsOpen, category }: UpdateModalProp) => {
  const [updateName, setUpdateName] = useState("");
  const [updateDescription, setUpdateDescription] = useState("");
  useEffect(() => {
    if (category) {
      setUpdateName(category?.name);
      setUpdateDescription(category?.description);
    }
  }, [category]);
  const onUpdate = async (e: React.FormEvent, categoryId: string) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:4000/category/${categoryId}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: updateName,
          description: updateDescription,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setUpdateName("");
        setUpdateDescription("");
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log(category);
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Update</Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update category modal</DialogTitle>
            <DialogDescription>
              <form onSubmit={(e) => onUpdate(e, category?.id as string)}>
                <div className="mt-5 flex flex-col gap-2 mb-3">
                  <Label>Category Name</Label>
                  <Input
                    type="text"
                    className=" focus:outline-none focus:ring-1 px-2 py-1"
                    value={updateName}
                    onChange={(e) => setUpdateName(e.target.value)}
                  />
                </div>
                <div className="mt-5 flex flex-col gap-2 mb-3">
                  <Label>Category Description</Label>
                  <Textarea
                    value={updateDescription}
                    onChange={(e) => setUpdateDescription(e.target.value)}
                  />
                </div>
                <DialogClose className="w-full" asChild>
                  <Button type="submit" className="w-full bg-purple-600">
                    Update
                  </Button>
                </DialogClose>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpdateModal;
