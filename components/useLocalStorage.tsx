import { useEffect, useState } from "react";

export const useLocalStorage = () => {
  //save item to local storage for unauthorised customers
  const [savedItem, setSavedItem] = useState(storeItem);

  useEffect(() => {
    if (typeof window === "object") {
      localStorage.setItem("savedItem", JSON.stringify(savedItem));
    }
  }, [savedItem]);

  function storeItem() {
    if (typeof window === "object") {
      const SavedItem = JSON.parse(localStorage.getItem("savedItem"));
      return SavedItem || [];
    }
  }

  function addToSavedItems(
    images: string,
    name: string,
    price: number,
    product_id: string,
    prod_creator_id: string,
    name_slug: string
  ) {
    const newItem = {
      images,
      name,
      price,
      product_id,
      prod_creator_id,
      name_slug,
    };
    // prevent duplicates
    let exists = savedItem.filter((s) => s.product_id === product_id);
    if (exists.length === 0) {
      setSavedItem([...savedItem, newItem]);
    }
  }

  return [savedItem, addToSavedItems];
};
