"use client";
import { Products } from "@/components/ProductsComp";
import { SingleImageDropzone } from "@/components/SingleImageDropzone";
import { Category } from "@/components/SubCategory/CreateModal"; // Ensure this import provides the correct type
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Select from "react-select";

const UpdateProduct = () => {
  const { productId } = useParams();
  const router = useRouter();
  const [singleProduct, setSingleProduct] = useState<Products>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [image, setImage] = useState<File>();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sellingPrice, setSellingPrice] = useState<number | "">("");
  const [actualPrice, setActualPrice] = useState<number | "">("");
  // const [tags, setTags] = useState("");

  // Fetch all categories
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
      console.error(error);
    }
  };

  // Fetch single product details
  const fetchSingleProduct = async () => {
    if (!productId) {
      console.error("No product ID provided");
      return;
    }
    try {
      const res = await fetch(`http://localhost:4000/product/${productId}`, {
        method: "GET",
      });
      if (res.ok) {
        console.log("fetch product");
        const data = await res.json();
        setSingleProduct(data);
        setName(data.name);
        setDescription(data.description);
        setSellingPrice(Number(data.sellingPrice));
        setActualPrice(Number(data.actualPrice));
        // setTags(data.Tags.join(", ")); // Assuming Tags is an array in the response
        setSelectedCategory(
          categories.find((cat) => cat.id === data.categoryId) || null
        );
      } else {
        console.error("Failed to fetch product");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCategories();
    if (productId) {
      fetchSingleProduct();
    }
  }, [productId]);

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

  const updateProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !name ||
      !description ||
      !image ||
      !sellingPrice ||
      !actualPrice ||
      !selectedCategory
    ) {
      console.log("All fields are required, including the image and tags.");
      return;
    }

    // Convert comma-separated tags string into an array
    // const tagsArray = tags
    //   .split(",")
    //   .map((tag) => tag.trim())
    //   .filter((tag) => tag);

    console.log("Image file:", image);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("sellingPrice", String(sellingPrice));
      formData.append("actualPrice", String(actualPrice));
      //   formData.append("Tags", JSON.stringify(tagsArray)); // Convert tags array to JSON string
      formData.append("bannerImage", image);
      formData.append("categoryId", String(selectedCategory.id));

      const res = await fetch(`http://localhost:4000/product/${productId}`, {
        method: "PATCH",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        console.log("updated succesfully");
        router.push("/products"); // Optionally, reset the form or give feedback to the user here.
      } else {
        console.error("Failed to add product");
      }
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div className="w-full">
      <form className="mt-8 w-3/4 mx-auto" onSubmit={updateProduct}>
        <h2 className="font-semibold text-2xl">Update Product Page</h2>
        <div className="mt-3 mb-3 grid grid-cols-2 gap-4">
          <div>
            <Label>Name</Label>
            <Input
              type="text"
              placeholder="Ex. john doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label>Selling Price</Label>
            <Input
              type="number"
              placeholder="Ex.1234"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(Number(e.target.value))}
            />
          </div>
        </div>
        <div className="mb-3">
          <Label>Description</Label>
          <Textarea
            placeholder="Ex. lorem ipsum"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mt-3 mb-3 grid grid-cols-2 gap-4">
          <div>
            <Label>Actual Price</Label>
            <Input
              type="number"
              placeholder="ex.1234"
              value={actualPrice}
              onChange={(e) => setActualPrice(Number(e.target.value))}
            />
          </div>
          {/* <div>
            <Label>Tags</Label>
            <Input
              type="text"
              placeholder="Enter tags separated by commas"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div> */}
        </div>
        <div className="flex gap-5">
          <div>
            <Label>Upload Banner Image</Label>
            <SingleImageDropzone
              width={200}
              height={200}
              value={image}
              onChange={(file) => setImage(file)}
            />
          </div>
          <div className="w-full">
            <Label>Category</Label>
            <Select
              options={categoryOptions}
              onChange={handleCategoryChange}
              value={categoryOptions.find(
                (option) => option.value === selectedCategory?.id
              )}
              placeholder="Select a category"
              className="col-span-3"
              id="category"
            />
          </div>
        </div>
        <Button type="submit">Update</Button>
      </form>
    </div>
  );
};

export default UpdateProduct;
