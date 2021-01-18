import React, { useRef } from "react";
import Link from "next/link";

import { Icon, Spinner } from "@chakra-ui/core";

import { useQuery } from "@/components/useQuery";

import { featuredProducts } from "@/graphql/vendor";
import { ProductsRes } from "@/Typescript/types";

import { Commas } from "@/utils/helpers";

export const Featured = () => {
  //Featured Products Section Scroll
  const scrollRef = useRef(null);

  const [data, loading, error] = useQuery(featuredProducts, { limit: 10 });

  return (
    <div className="main-section">
      <section className="featured">
        <h1>Top Picks For You</h1>
        <div className="scroll-direction">
          <button
            title="scroll left"
            aria-label="scroll left"
            onClick={() => {
              if (scrollRef.current) {
                scrollRef.current.scrollLeft -= 30;
              }
            }}
          >
            <Icon name="chevron-left" size="32px" />
          </button>

          <button
            title="scroll right"
            aria-label="scroll right"
            onClick={() => {
              if (scrollRef.current) {
                scrollRef.current.scrollLeft += 30;
              }
            }}
          >
            <Icon name="chevron-right" size="32px" />
          </button>
        </div>
        {!data && (
          <div style={{ textAlign: "center" }}>
            <Spinner speed="1s"></Spinner>
          </div>
        )}
        <div className="featured-wrap" ref={scrollRef}>
          {data &&
            data.featuredProducts.map((p: ProductsRes) => (
              <div className="featured-item" key={p.id}>
                <Link href={`/product/${p.name_slug}`}>
                  <a>
                    <img src={p.images[0]} alt={`${p.name}`} />
                    <hr />
                    <div className="featured-desc">
                      <h2>{p.name}</h2>
                      <p>&#8358; {Commas(p.price)}</p>
                    </div>
                  </a>
                </Link>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
};
