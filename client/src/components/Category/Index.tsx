"use client";
import { BsThreeDots } from "react-icons/bs";
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
import MiniModal from "../MiniModal/Index";
import { Button } from "../ui/button";
import CommanModal from "../commanModal";
import { LoaderCircle } from "lucide-react";
export type Categories = {
  id?: string;
  name: string;
  description: string;
  subCategoriesCount?: number;
};

const Category = () => {
  const [categories, setCategories] = useState<Categories[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const onSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      console.log("Name and Description cannot be empty");
      return;
    }
    try {
      const res = await fetch("http://localhost:4000/category", {
        method: "POST",
        body: JSON.stringify({ name, description }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        console.log("category created:", data);
        // Refresh categories list
        getCategory();
        setName("");
        setDescription("");
      } else {
        throw new Error("Failed to create category");
      }
    } catch (error) {
      console.log("error in create category", error);
    }
  };
  const getMainSubCategories = async (categoryId: string) => {
    try {
      const res = await fetch(
        `http://localhost:4000/category/sub/${categoryId}`
      );
      const data = await res.json();
      return data.length;
    } catch (error) {
      console.log(error);
      return 0;
    }
  };
  const getCategory = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:4000/category", {
        method: "GET",
      });
      const data = await res.json();

      // Fetch subcategories count for each category
      const categoriesWithSubCounts = await Promise.all(
        data.map(async (category: Categories) => {
          const subCategoriesCount = await getMainSubCategories(
            category.id as string
          );
          return { ...category, subCategoriesCount };
        })
      );
      setCategories(categoriesWithSubCounts);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      console.log("error in detcing catgeorties");
    }
  };
  const deleteCategory = async (categoryId: String) => {
    try {
      const res = await fetch(`http://localhost:4000/category/${categoryId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        console.log("Category deleted succesfylly");
        getCategory();
      } else {
        console.log("error in deleting the category");
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    getCategory();
  }, []);
  return (
    <div className="px-3 py-5 w-full border justify-center item-center">
      <div>
        <div className="flex justify-end">
          <CommanModal
            name={name}
            description={description}
            setName={setName}
            setDescription={setDescription}
            onSubmit={onSubmitCreate}
          />
        </div>
        <Table>
          <TableCaption className="mt-10">List of Caetgories</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-center">SubCategories</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="relative">
            {loading ? (
              <>
                <LoaderCircle
                  size={"3rem"}
                  className="absolute mx-auto w-full items-center animate-spin"
                />
              </>
            ) : (
              <>
                {categories?.map((category) => (
                  <TableRow>
                    <TableCell className="font-medium">
                      {category?.name}
                    </TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell className="text-center">
                      {category.subCategoriesCount}
                    </TableCell>
                    <TableCell className="text-right cursor-pointer relative">
                      {!isOpen ? (
                        <BsThreeDots onClick={() => setIsOpen(true)} />
                      ) : (
                        <MiniModal
                          isOpen={isOpen}
                          setIsOpen={setIsOpen}
                          category={category}
                          onDelete={deleteCategory}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Category;
