import React from "react";
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
type CommanModalProp = {
  name: string;
  description: string;
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

const CommanModal = ({
  name,
  description,
  setName,
  setDescription,
  onSubmit,
}: CommanModalProp) => {
  return (
    <div>
      <Dialog>
        <Button>
          <DialogTrigger>Create</DialogTrigger>
        </Button>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create category modal</DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div className="mt-5 flex flex-col gap-2 mb-3">
                  <Label>Category Name</Label>
                  <Input
                    type="text"
                    className=" focus:outline-none focus:ring-1 px-2 py-1"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="mt-5 flex flex-col gap-2 mb-3">
                  <Label>Category Description</Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <DialogClose className="w-full">
                  <Button type="submit" className="w-full bg-purple-600">
                    Create
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

export default CommanModal;
