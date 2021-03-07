import React from "react";
import { UsersRes } from "@/Typescript/types";
import { Commas, nairaSign, screenWidth, truncate } from "@/utils/helpers";
import { gql } from "graphql-request";
import { useEffect, useState } from "react";
import { useQuery } from "../useQuery";
import Link from "next/link";

const homeStores = gql`
  query homeStores {
    homeStores {
      business_name_slug
      business_name
      business_image
      business_bio
      homeProducts {
        name
        images
        name_slug
        price
      }
    }
  }
`;

export const StoresHome = () => {
  // check for error after fetching data then pass as a dependency to the custom useQuery hook
  const [checkError, setCheckError] = useState(false);

  const [data, loading, error] = useQuery(homeStores, {}, null, checkError);

  useEffect(() => {
    setCheckError(!checkError);
  }, [error]);

  const stores: UsersRes[] = data ? data.homeStores : null;

  const images = ["slider/storefront1.jpg", "slider/storefront2.jpg"];

  return (
    <section className="find-stores">
      {stores && (
        <div>
          <h1>Shop From our Top Stores</h1>
          <div className="stores-wrap">
            {stores.map((s, i) => (
              <div className="store" key={i}>
                <Link href={`/store/${s.business_name_slug}`}>
                  <a
                    className="head"
                    aria-label={`visit ${s.business_name} store`}
                  >
                    <img
                      src={s.business_image || i > 1 ? images[0] : images[i]}
                      alt={s.business_name}
                    />
                    <div className="about">
                      <h2>{s.business_name}</h2>
                      <h3>{truncate(s.business_bio, 60)}</h3>
                    </div>
                  </a>
                </Link>

                {!s.homeProducts ||
                  (s.homeProducts.length === 0 && (
                    <p style={{ color: "var(--primary)", padding: "80px 0" }}>
                      No products in this store...
                    </p>
                  ))}
                <section className="products">
                  {s.homeProducts.map((p, i) => (
                    <Link href={`/product/${p.name_slug}`} key={i}>
                      <a
                        className="product"
                        aria-label={`link to a product named ${p.name}`}
                      >
                        <img src={p.images[0]} alt={p.name} loading="lazy" />
                        <div className="content">
                          <h4>{p.name}</h4>
                          <h5>
                            {nairaSign} {Commas(p.price)}
                          </h5>
                        </div>
                      </a>
                    </Link>
                  ))}
                </section>
              </div>
            ))}
          </div>
        </div>
      )}
      {stores && (
        <div className="more-stores">
          <Link href="/stores">
            <a>More Stores</a>
          </Link>
        </div>
      )}
      <style jsx>{`
        .find-stores {
          margin: 30px 0;
        }
        h1 {
          text-align: center;
          color: var(--primary);
          font-weight: bold;
          font-size: 1.1rem;
          margin-bottom: 20px;
        }
        .stores-wrap {
          display: grid;
          grid-template-columns: 1fr;
          margin: auto;
          width: 95%;
          gap: 8px;
        }
        .store {
          box-shadow: var(--box) var(--softgrey);
          padding: 10px;
          border-radius: 5px;
          margin: auto;
          width: 350px;
        }
        .head {
          display: flex;
          align-items: center;
        }
        .head img {
          border-radius: 50%;
          object-fit: cover;
          height: 60px;
          width: 60px;
        }
        .about {
          margin-left: 10px;
          font-size: 0.9rem;
        }

        .about h2 {
          font-weight: bold;
        }

        .products {
          overflow-x: scroll;
          display: flex;
          margin: 10px auto;
          width: 99%;
        }

        /* scroll bar styling  */
        .products::-webkit-scrollbar {
          height: 10px;
        }

        /* Track */
        .products::-webkit-scrollbar-track {
          box-shadow: inset 0 0 5px grey;
          border-radius: 8px;
        }

        /* Handle */
        .products::-webkit-scrollbar-thumb {
          background: var(--primary);
          border-radius: 8px;
        }

        /* Handle on hover */
        .products::-webkit-scrollbar-thumb:hover {
          background: #b30000;
        }

        .product {
          box-shadow: var(--box) var(--softgrey);
          margin: 5px 5px;
        }

        .product img {
          height: 150px;
          min-width: 150px;
          border-radius: 10px;
          object-fit: cover;
        }

        .content {
          font-size: 0.8rem;
          text-align: center;
          margin-top: 5px;
        }

        .content h5 {
          font-weight: bold;
        }

        .more-stores {
          text-align: center;
          margin-top: 5px;
        }

        .more-stores a {
          border-bottom: 3px solid var(--primary);
        }

        @media only screen and (min-width: 400px) {
          .store {
            width: 380px;
          }
        }

        @media only screen and (min-width: 700px) {
          .store {
            width: 700px;
          }
        }

        @media only screen and (min-width: 1000px) {
          .stores-wrap {
            grid-template-columns: 1fr 1fr;
          }
          .products::-webkit-scrollbar {
            height: 15px;
          }
          .store {
            width: 450px;
          }
          .content {
            font-size: 0.9rem;
          }
        }

        @media only screen and (min-width: 1200px) {
          h1 {
            font-weight: bold;
            font-size: 1.5rem;
          }
          .stores-wrap {
            width: 90%;
          }

          .store {
            width: 600px;
          }
        }

        @media only screen and (min-width: 1400px) {
          .stores-wrap {
            width: 80%;
          }
        }

        @media only screen and (min-width: 1800px) {
          .stores-wrap {
            width: 60%;
          }
          .store {
            width: 700px;
          }
        }
      `}</style>
    </section>
  );
};
