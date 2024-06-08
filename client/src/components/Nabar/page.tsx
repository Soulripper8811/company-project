import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <div className="h-[4rem] w-full flex justify-between items-center">
      <div>
        <h2>Logo</h2>
      </div>

      <ul className="flex gap-4 items-center">
        <Link className="py-1 bg-black px-1 rounded-md text-white" href={"/"}>
          <li>Home</li>
        </Link>
        <Link
          className="py-1 bg-black px-1 rounded-md text-white"
          href={"/products"}
        >
          <li>Products</li>
        </Link>
        <Link
          className="py-1 bg-black px-1 rounded-md text-white"
          href={"/category"}
        >
          <li>Category</li>
        </Link>
        <Link
          className="py-1 bg-black px-1 rounded-md text-white"
          href={"/subcategory"}
        >
          <li>Subcategory</li>
        </Link>
      </ul>

      <div>authentication</div>
    </div>
  );
};

export default Navbar;
