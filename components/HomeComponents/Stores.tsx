import React from "react";
import { UsersRes } from "@/Typescript/types";
import { nairaSign, truncate } from "@/utils/helpers";
import { gql } from "graphql-request";
import { useEffect, useState } from "react";
import { useQuery } from "../useQuery";
import { useRouter } from "next/router";
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
  const router = useRouter();
  // check for error after fetching data then pass as a dependency to the custom useQuery hook
  const [checkError, setCheckError] = useState(false);

  const [data, loading, error] = useQuery(
    homeStores,
    {
      query: null,
      limit: 10,
      offset: 0,
    },
    null,
    checkError
  );

  useEffect(() => {
    if (error) {
      setCheckError(!checkError);
    }
  }, []);

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
                <div
                  className="head"
                  tabIndex={0}
                  role="button"
                  aria-label="visit store"
                  onClick={() => router.push(`/store/${s.business_name_slug}`)}
                >
                  <img
                    src={s.business_image || images[i]}
                    alt={s.business_name}
                  />
                  <div className="about">
                    <h2>{s.business_name}</h2>
                    <h3>{truncate(s.business_bio, 60)}</h3>
                  </div>
                </div>
                <section className="products">
                  {s.homeProducts.map((p, i) => (
                    <div
                      className="product"
                      key={i}
                      tabIndex={0}
                      role="button"
                      aria-label="link to product"
                      onClick={() => router.push(`/product/${p.name_slug}`)}
                    >
                      <img src={p.images[0]} alt={p.name} />
                      <div className="content">
                        <h4>{p.name}</h4>
                        <h5>
                          {nairaSign} {p.price}
                        </h5>
                      </div>
                    </div>
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
            <a>More</a>
          </Link>
        </div>
      )}
      <style jsx>{`
        .find-stores {
          margin: 20px 0;
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
          gap: 5px;
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
          margin: auto;
          width: 99%;
        }

        .product {
          box-shadow: var(--box) var(--softgrey);
          margin: 5px 5px;
        }

        .product img {
          height: 200px;
          min-width: 200px;
          border-radius: 8px;
          object-fit: contain;
        }

        .content {
          font-size: 0.9rem;
          text-align: center;
          margin-top: 5px;
        }

        .content h5 {
          font-weight: bold;
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
      `}</style>
    </section>
  );
};
