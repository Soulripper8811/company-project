import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Select from "react-select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Category } from "./CreateModal";
import { subCategories } from ".";

export type UpdateModule = {
  updateModule: boolean;
  setUpdateModule: (updateModule: boolean) => void;
  subcategory: subCategories;
};

const UpdateModals = ({
  updateModule,
  setUpdateModule,
  subcategory,
}: UpdateModule) => {
  const [updateName, setUpdateName] = useState("");
  const [updateDescription, setUpdateDescription] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const router = useRouter();
  const getCategories = async () => {
    try {
      const res = await fetch("http://localhost:4000/category", {
        method: "GET",
      });
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      } else {
        console.error("Failed to fetch categories");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (updateModule) {
      getCategories();
    }
  }, [updateModule]);

  const categoryOptions = categories.map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const handleCategoryChange = (selectedOption: any) => {
    const selectedCat = categories.find(
      (category) => category.id === selectedOption.value
    );
    setSelectedCategory(selectedCat || null);
  };
  const UpdateSubCategory = async (
    event: React.FormEvent,
    categoryId: string
  ) => {
    event.preventDefault();

    if (!selectedCategory) {
      console.error("Category not selected");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:4000/subcategory/${categoryId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: updateName,
            description: updateDescription,
            categoryId: selectedCategory.id,
          }),
        }
      );

      if (res.ok) {
        console.log("Subcategory update successfully");
        console.log(subcategory.id, "subcatgoryid");
        // Reset the form
        setUpdateName("");
        setUpdateDescription("");
        setSelectedCategory(null);
        // Close the modal
        setUpdateModule(false);
        router.refresh();
      } else {
        console.error("Failed to Update subcategory");
      }
    } catch (error) {
      console.error("Error in updateing subcategory:", error);
    }
  };
  useEffect(() => {
    if (subcategory) {
      setUpdateDescription(subcategory.description);
      setUpdateName(subcategory.name);
    }
  }, []);
  return (
    <div>
      <Dialog
        open={updateModule}
        onOpenChange={() => {
          setUpdateModule(false);
        }}
      >
        <DialogTrigger />
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Subcategory</DialogTitle>
            <DialogDescription>
              Provide details for the new subcategory.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => UpdateSubCategory(e, subcategory.id)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-left">
                  Category
                </Label>
                <Select
                  options={categoryOptions}
                  onChange={handleCategoryChange}
                  placeholder="Select a category"
                  className="col-span-3"
                  id="category"
                />
              </div>
              {selectedCategory && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-left">
                      Name
                    </Label>
                    <Input
                      id="name"
                      className="col-span-3"
                      onChange={(e) => setUpdateName(e.target.value)}
                      value={updateName}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-left">
                      Description
                    </Label>
                    <Input
                      id="description"
                      className="col-span-3"
                      value={updateDescription}
                      onChange={(e) => setUpdateDescription(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={() => {
                  setUpdateModule(false);
                }}
              >
                Update
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpdateModals;
