import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  Radio,
  RadioGroup,
  Select,
  Textarea,
  useToast,
} from "@chakra-ui/core";
import Cookies from "js-cookie";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/vendor/Navigation";
import { useToken } from "@/Context/TokenProvider";
import { editProductPage, updateProduct } from "@/graphql/vendor";
import { ProductsRes, MutationUpdateProductArgs } from "@/Typescript/types";
import { graphQLClient } from "@/utils/client";
import { ProtectRouteV } from "@/utils/ProtectedRouteV";
import { useMutation } from "@/utils/useMutation";
import { ImageUpload } from "@/components/vendor/ImageUpload";
import { categoriesList, mainCategoriesList } from "@/utils/helpers";

interface Iprops {
  product: ProductsRes;
  error: any;
}

export async function getServerSideProps({ params }) {
  const variables = {
    id: params.id,
  };

  try {
    const res = await graphQLClient.request(editProductPage, variables);
    const product = res.editProductPage;
    return {
      props: {
        product,
      },
    };
  } catch (err) {
    return {
      props: {
        error: err?.response?.errors[0].message || err.message,
      },
    };
  }
}

const Edit = ({ product, error }: Iprops) => {
  const toast = useToast();
  const router = useRouter();
  //from context
  const { Token } = useToken();
  //role from cookie
  let role = Cookies.get("role");

  const [Loading, setLoading] = useState(false);

  const [mainCategory, setmainCategory] = useState("");
  const [inStock, setInStock] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<any>("");
  const [available_qty, setAvailableQty] = useState<any>("");
  const [images, setImages] = useState([]);
  const [imageLoad, setImageLoad] = useState(false);
  const [tags, setTags] = useState<string[]>([]);

  //populate product input fields with exisiting data from DB
  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setDescription(product.description || "");
      setPrice(product.price || "");
      setAvailableQty(product.available_qty || "");
      setTags(product.category || []);
      setmainCategory(product.main_category || "");
      setInStock(product.in_stock || "");
      setImages(product.images || []);
    }
  }, [product]);

  // form submit
  const handleSubmit = async (e): Promise<void> => {
    e.preventDefault();

    if (name.trim() === "" || description.trim() === "") {
      toast({
        title: "All Fields Are Required",
        status: "info",
        duration: 3000,
      });
      return;
    }
    if (tags.length === 0 || !mainCategory) {
      toast({
        title: "Category  Must Be Selected",
        status: "info",
        duration: 3000,
      });
      return;
    }
    if (images.length === 0) {
      toast({
        title: "Please Upload an Image of Your Product",
        description: "White Background Preferably",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    const variables: MutationUpdateProductArgs = {
      id: product.id,
      creator_id: product.creator_id,
      name: name.trim(),
      description,
      price: parseInt(price),
      category: tags,
      main_category: mainCategory,
      images,
      in_stock: inStock,
      available_qty: parseInt(available_qty),
    };

    setLoading(true);

    const { data, error } = await useMutation(updateProduct, variables, Token);

    if (data) {
      setLoading(false);
      toast({
        title: "Your Product Has Been Successfuly Updated",
        status: "success",
        duration: 5000,
      });
      router
        .push(`/product/${product.name_slug}`)
        .then(() => window.scrollTo(0, 0));
    }
    if (error) {
      toast({
        title: "An Error Ocurred",
        description: error.response?.errors[0].message
          ? error.response?.errors[0].message
          : "An error occurred, check your internet connection",
        status: "error",
      });
      setLoading(false);
    }
  };

  return (
    <div>
      <Head>
        <title>Edit Product | Vendor | skincare</title>
      </Head>
      <>
        {error ||
          (!product &&
            toast({
              title: "An Error Ocurred",
              description: "Check Your Internet Connection",
              status: "error",
              duration: 3000,
              position: "top",
            }))}
      </>

      <div className="new-item-layout">
        <div>
          <Navigation />
        </div>
        <main>
          <div className="store_new-item">
            {role && role !== "vendor" && (
              <div className="indicator">
                You Are Not Logged In. Redirecting...
              </div>
            )}
            {role && role === "vendor" && (
              <div className="main-wrap">
                <h1 className="title">Edit Product</h1>
                <form onSubmit={handleSubmit}>
                  <FormControl>
                    <div className="form-wrap">
                      <section className="grid-1">
                        <div className="form-item">
                          <FormLabel htmlFor="name">Name</FormLabel>
                          <Input
                            isRequired
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Product Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>

                        <div className="form-item">
                          <FormLabel htmlFor="description">
                            Description
                          </FormLabel>
                          <Textarea
                            isRequired
                            id="description"
                            name="description"
                            aria-describedby="descriptiom-helper-text"
                            placeholder="Help your customers know all about this product."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                          ></Textarea>
                        </div>
                      </section>

                      <section className="grid-2">
                        <div className="form-item">
                          <FormLabel htmlFor="price">Price</FormLabel>
                          <InputGroup>
                            <Input
                              isRequired
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              name="price"
                              id="price"
                              placeholder="Product Price"
                              value={price}
                              onChange={(e) => setPrice(e.target.value)}
                              errorBorderColor="red.300"
                            />
                          </InputGroup>
                        </div>

                        <div className="form-item">
                          <FormLabel htmlFor="category">
                            Main Category
                          </FormLabel>
                          <Select
                            defaultValue={mainCategory}
                            onChange={(e) => {
                              setmainCategory(e.target.value);
                            }}
                          >
                            <option defaultValue={`${mainCategory}`}>
                              {mainCategory}
                            </option>

                            {mainCategoriesList.map((c, i) => (
                              <option key={i} defaultValue={c}>
                                {c}
                              </option>
                            ))}
                          </Select>
                        </div>

                        <div className="form-item">
                          <FormLabel htmlFor="other-categories">
                            Category
                          </FormLabel>
                          <div className="tags">
                            {tags.map((t, i) => (
                              <div key={i}>
                                <span>{t}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    let alltags = [...tags];
                                    alltags.splice(i, 1);
                                    setTags(alltags);
                                  }}
                                >
                                  x
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="form-item">
                          <Select
                            id="other-categories"
                            onChange={(e) => {
                              if (tags.length >= 3) {
                                toast({
                                  title: "can't add more than 3 categories",
                                  position: "top-right",
                                  isClosable: true,
                                });
                                return;
                              }
                              setTags([...tags, e.target.value]);
                            }}
                          >
                            <option defaultValue="">--select--</option>
                            {categoriesList.map((c, i) => (
                              <option key={i} defaultValue={c}>
                                {c}
                              </option>
                            ))}
                          </Select>
                        </div>

                        <div className="form-item">
                          <FormLabel htmlFor="available quantity">
                            Available Quantity In Stock
                          </FormLabel>
                          <InputGroup>
                            <Input
                              isRequired
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              name="available_qty"
                              id="available quantity"
                              placeholder="number of items in stock"
                              maxLength={3}
                              width="15"
                              value={available_qty}
                              onChange={(e) => setAvailableQty(e.target.value)}
                              errorBorderColor="red.300"
                            />
                          </InputGroup>
                        </div>

                        <div className="form-item">
                          <FormLabel htmlFor="In Stock">
                            Is Product In Stock
                          </FormLabel>
                          <RadioGroup
                            spacing={5}
                            isInline
                            value={inStock}
                            onChange={(e: any) => setInStock(e.target.value)}
                          >
                            <Radio name="inStock" value="true">
                              In Stock
                            </Radio>
                            <Radio name="inStock" value="false">
                              Out Of Stock
                            </Radio>
                          </RadioGroup>
                        </div>

                        <div className="form-item image-upload">
                          <ImageUpload
                            imageLoad={imageLoad}
                            setImageLoad={setImageLoad}
                            images={images}
                            setImages={setImages}
                          />
                        </div>
                      </section>
                    </div>
                  </FormControl>

                  <br />
                  <div className="btn">
                    <Button
                      isDisabled={Loading}
                      style={{ background: "var(--deepblue)", color: "white" }}
                      type="submit"
                      isLoading={Loading}
                    >
                      Update Product
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />

      <style jsx>{`
        .form-item.image-upload {
          box-shadow: var(--box) var(--softgrey);
          padding: 10px;
        }
        .image-upload a {
          font-size: 0.9rem;
        }

        .image-upload div {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
};

export default ProtectRouteV(Edit);
