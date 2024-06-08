import React, { useEffect, useState } from "react";
import { Products } from ".";
import { Category } from "../SubCategory/CreateModal";
import { Button } from "../ui/button";
import { MdDelete, MdEdit } from "react-icons/md";
import Link from "next/link";

export type ProductCard = {
  product: Products;
};
const ProductCard = ({ product }: ProductCard) => {
  const [category, setCategory] = useState<Category>();
  const fetchCategory = async (categoryId: string) => {
    try {
      const response = await fetch(
        `http://localhost:4000/category/${categoryId}`,
        {
          method: "GET",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setCategory(data);
      }
    } catch (error) {}
  };
  useEffect(() => {
    fetchCategory(product.categoryId);
  }, [product]);
  const deleteProduct = async (productId: string) => {
    try {
      const res = await fetch(`http://localhost:4000/product/${productId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const data = await res.json();
        console.log("deleted succesfully", data);
      }
    } catch (error) {
      console.log("error in deleting the product");
    }
  };
  return (
    <div className="grid grid-flow-row">
      <div>
        <Link
          href={`/products/${product.id}`}
          className="block rounded-lg p-4 shadow-sm shadow-indigo-100"
        >
          <img
            alt=""
            src={product.bannerImage}
            className="h-56 w-full rounded-md object-fill"
          />

          <div className="mt-2">
            <div>
              <h2 className="text-md font-semibold">Name: {product.name}</h2>
              <h2 className=" text-sm">description:{product.description}</h2>
            </div>
            <div className="mt-3 flex items-center gap-8 text-xs justify-between">
              <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
                <h2>Category:{category?.name}</h2>
              </div>
              <div className="flex flex-col justify-end">
                <h2 className="text-xl">
                  Selling price: ${product.sellingPrice}
                </h2>
                <h2>Actual price: ${product.actualPrice}</h2>
              </div>
            </div>
          </div>
        </Link>
        <div className="mt-3 flex items-center justify-between ">
          <Link href={`/products/update/${product.id}`}>
            <Button>
              <MdEdit />
            </Button>
          </Link>
          <Button onClick={() => deleteProduct(product.id)}>
            <MdDelete />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
