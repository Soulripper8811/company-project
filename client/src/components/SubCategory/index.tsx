"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MdDelete, MdEdit } from "react-icons/md";
import CreateModal from "@/components/SubCategory/CreateModal";
import UpdateModals from "./UpdateModals";

export type subCategories = {
  categoryId: string;
  name: string;
  description: string;
  id: string;
  mainCategory: string;
};

const SubCategoryComp = () => {
  const [subcategories, setCategories] = useState<subCategories[]>([]);
  const [openModule, setOpenModule] = useState<boolean>(false);

  const [updateModule, setUpdateModule] = useState(false);
  const getSubCategory = async () => {
    try {
      const res = await fetch("http://localhost:4000/subcategory", {
        method: "GET",
      });
      if (res.ok) {
        const data = await res.json();
        const enrichedSubcategories = await Promise.all(
          data.map(async (subcategory: subCategories) => {
            const mainCategoryName = await getMainCategory(
              subcategory.categoryId
            );
            return { ...subcategory, mainCategory: mainCategoryName };
          })
        );
        setCategories(enrichedSubcategories);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch main category name by category ID
  const getMainCategory = async (categoryId: string) => {
    try {
      const mainCat = await fetch(
        `http://localhost:4000/category/${categoryId}`,
        { method: "GET" }
      );
      if (mainCat.ok) {
        const data = await mainCat.json();
        return data.name;
      }
    } catch (error) {
      console.log(error);
    }
  };
  const deleteSubCategory = async (categoryId: string) => {
    try {
      const res = await fetch(`http://localhost:4000/subcategory/${categoryId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const data = await res.json();
        console.log("Dleted succedully");
        getSubCategory();
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getSubCategory();
  }, []);

  return (
    <div className="px-[10rem] w-full p-10">
      <div className="flex justify-end">
        <Button className="flex" onClick={() => setOpenModule(true)}>
          Create
        </Button>
      </div>
      {openModule && (
        <>
          <CreateModal openModule={openModule} setOpenModule={setOpenModule} />
        </>
      )}
      <Table>
        <TableCaption className="mt-5">A list of subcategories</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Main Category</TableHead>
            <TableHead>Option</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subcategories?.map((subcategory) => (
            <TableRow key={subcategory.id}>
              <TableCell className="font-medium">{subcategory.name}</TableCell>
              <TableCell>{subcategory.description}</TableCell>
              <TableCell>{subcategory.mainCategory}</TableCell>
              <TableCell className="text-right">
                <div className="flex gap-3">
                  <Button size={"icon"} className="rounded-full">
                    <MdEdit
                      onClick={() => {
                        setUpdateModule(true);
                      }}
                    />
                  </Button>
                  {updateModule && (
                    <UpdateModals
                      updateModule={updateModule}
                      setUpdateModule={setUpdateModule}
                      subcategory={subcategory}
                    />
                  )}
                  <Button size={"icon"} className="rounded-full">
                    <MdDelete
                      onClick={() => deleteSubCategory(subcategory.id)}
                    />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SubCategoryComp;
