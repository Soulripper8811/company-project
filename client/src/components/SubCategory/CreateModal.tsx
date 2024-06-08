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

export type Category = {
  id: string;
  name: string;
};

export type CreateModalProp = {
  openModule: boolean;
  setOpenModule: (openModule: boolean) => void;
};

const CreateModal = ({ openModule, setOpenModule }: CreateModalProp) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
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
    if (openModule) {
      getCategories();
    }
  }, [openModule]);

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

  const addSubCategory = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedCategory) {
      console.error("Category not selected");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/subcategory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          categoryId: selectedCategory.id, 
        }),
      });

      if (res.ok) {
        console.log("Subcategory added successfully");
        // Reset the form
        setName("");
        setDescription("");
        setSelectedCategory(null);
        // Close the modal
        setOpenModule(false);
        router.refresh();
      } else {
        console.error("Failed to add subcategory");
      }
    } catch (error) {
      console.error("Error adding subcategory:", error);
    }
  };

  return (
    <div>
      <Dialog open={openModule} onOpenChange={setOpenModule}>
        <DialogTrigger />
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Subcategory</DialogTitle>
            <DialogDescription>
              Provide details for the new subcategory.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={addSubCategory}>
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
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-left">
                      Description
                    </Label>
                    <Input
                      id="description"
                      className="col-span-3"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateModal;
