import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  useToast,
  InputGroup,
} from "@chakra-ui/core";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import slug from "slug";
import { useToken } from "@/Context/TokenProvider";
import { MutationAddProductArgs } from "@/Typescript/types";
import { ADD_PRODUCT } from "@/graphql/vendor";
import { ProtectRouteV } from "@/utils/ProtectedRouteV";
import { useMutation } from "@/utils/useMutation";
import { Navigation } from "@/components/vendor/Navigation";
import { Footer } from "@/components/Footer";
import Head from "next/head";
import { useUser } from "@/Context/UserProvider";
import { ImageUpload } from "@/components/vendor/ImageUpload";
import { useRouter } from "next/router";
import { categoriesList, mainCategoriesList } from "@/utils/helpers";

export const Newitem = () => {
  const router = useRouter();
  const toast = useToast();
  //from context
  const { Token } = useToken();
  const { User } = useUser();
  //role from cookie
  let role = Cookies.get("role");

  const [Loading, setLoading] = useState(false);

  //input states
  const { handleSubmit, register, errors } = useForm();
  const [mainCategory, setmainCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState([]);
  const [imageLoad, setImageLoad] = useState(false);

  // form submit
  const onSubmit = async (values, e): Promise<void> => {
    e.preventDefault();
    if (User.pending === "true") {
      toast({
        title: "You Cannot Add A Product Yet, Your Profile is Under Review",
        description: "Please Fast-Track The Process by Completing Your Profile",
        status: "info",
        duration: 5000,
        isClosable: true,
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

    const { name, description, price, available_qty } = values;

    if (name.trim() === "" || description.trim() === "") {
      toast({
        title: "All Fields Are Required",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (tags.length === 0 || !mainCategory) {
      toast({
        title: "Category Must Be Selected",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const variables: MutationAddProductArgs = {
      name: name.trim(),
      name_slug: slug(name),
      description,
      price: parseInt(price),
      category: tags,
      main_category: mainCategory,
      images,
      available_qty: parseInt(available_qty),
    };

    setLoading(true);

    const { data, error } = await useMutation(ADD_PRODUCT, variables, Token);

    if (data) {
      setLoading(false);
      toast({
        title: "Your Product Has Been Successfuly Added",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      e.target.reset();
      router.push(`/product/${slug(name)}`).then(() => window.scrollTo(0, 0));
    }
    if (error) {
      setLoading(false);
      toast({
        title: "An Error Ocuurred",
        description: error.response?.errors[0].message
          ? error.response?.errors[0].message
          : "An error occurred, check your internet connection",
        status: "error",
        isClosable: true,
      });
      // console.log(error?.message);
      // console.log(error.response?.errors[0].message);
    }
  };

  useEffect(() => {
    if (User["pending"] && User.pending === "true") {
      toast({
        title: "You Profile is currently under review",
        description:
          "Please complete your profile information in your Account page to start adding products!",
        status: "info",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  }, [User]);

  return (
    <div>
      <Head>
        <title>New Product | Vendor | skincare</title>
      </Head>
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
            <div className="main-wrap">
              <h1 className="title">Add A New Product</h1>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl isRequired>
                  <div className="form-wrap">
                    <section className="grid-1">
                      <div className="form-item">
                        <FormLabel htmlFor="name">Name</FormLabel>
                        <Input
                          type="text"
                          id="name"
                          name="name"
                          aria-describedby="name-helper-text"
                          placeholder="Product Name"
                          ref={register({
                            required: true,
                            minLength: 3,
                          })}
                          isInvalid={errors.name ? true : false}
                          errorBorderColor="red.300"
                        />
                        <small style={{ color: "red" }}>
                          {errors.name && errors.name.message}
                        </small>
                      </div>

                      <div className="form-item">
                        <FormLabel htmlFor="description">Description</FormLabel>
                        <Textarea
                          id="description"
                          name="description"
                          aria-describedby="descriptiom-helper-text"
                          placeholder="Help your customers know all about this product."
                          ref={register({
                            required: true,
                            minLength: 10,
                          })}
                          isInvalid={errors.description ? true : false}
                          errorBorderColor="red.300"
                        ></Textarea>
                        <small style={{ color: "red" }}>
                          {errors.description &&
                            "minimum length of 10 characters"}
                        </small>
                      </div>
                    </section>

                    <section className="grid-2">
                      <div className="form-item">
                        <FormLabel htmlFor="price">Price</FormLabel>
                        <InputGroup>
                          <Input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            name="price"
                            id="price"
                            placeholder="Product Price"
                            ref={register({
                              required: true,
                            })}
                            isInvalid={errors.price ? true : false}
                            errorBorderColor="red.300"
                          />
                        </InputGroup>
                      </div>

                      <div className="form-item">
                        <FormLabel htmlFor="main-category">
                          Main Category
                        </FormLabel>
                        <Select
                          id="main-category"
                          defaultValue={mainCategory}
                          onChange={(e) => {
                            setmainCategory(e.target.value);
                          }}
                        >
                          <option defaultValue="">--select--</option>
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
                        {tags.length > 0 && (
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
                        )}
                      </div>

                      <div className="form-item">
                        <Select
                          id="other-categories"
                          onChange={(e) => {
                            if (tags.length === 3) {
                              toast({
                                title: "can't add more than 3 categories",
                                position: "top-right",
                                isClosable: true,
                              });
                              return;
                            }
                            if (tags.length < 1) {
                              toast({
                                title: "You can add more categories",
                                position: "top-right",
                                isClosable: true,
                              });
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
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            name="available_qty"
                            id="available quantity"
                            placeholder="number of items in stock"
                            defaultValue="1"
                            maxLength={3}
                            width="15"
                            ref={register({
                              required: true,
                            })}
                            isInvalid={errors.available_qty ? true : false}
                            errorBorderColor="red.300"
                          />
                        </InputGroup>
                      </div>
                      <div className="form-item image-upload">
                        <ImageUpload
                          images={images}
                          setImages={setImages}
                          imageLoad={imageLoad}
                          setImageLoad={setImageLoad}
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
                    Add Product
                  </Button>
                </div>
              </form>
            </div>
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

export default ProtectRouteV(Newitem);
