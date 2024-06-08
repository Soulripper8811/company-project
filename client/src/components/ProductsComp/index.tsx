"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { Button } from "../ui/button";
import Link from "next/link";

export type Products = {
  id: string;
  name: string;
  description: string;
  sellingPrice: number;
  actualPrice: number;
  //   Tag: string[]
  bannerImage: string;
  categoryId: string;
};
const ProductComp = () => {
  const [products, setProducts] = useState<Products[]>([]);
  const getAllProducts = async () => {
    try {
      const res = await fetch("http://localhost:4000/product", {
        method: "GET",
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.log(error, "error in fetching products");
    }
  };
  useEffect(() => {
    getAllProducts();
  }, []);
  return (
    <div className="flex flex-col px-[5rem]">
      <div className="flex justify-end">
        <Link href={"products/create"}>
          <Button>create Product</Button>
        </Link>
      </div>
      {}
      <div>
        {products.length === 0 ? (
          <>
            <div>NO products is found</div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-4 justify-center items-center gap-4">
              {products?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductComp;
