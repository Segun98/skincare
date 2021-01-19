import Link from "next/link";
import { mainCategoriesList } from "@/utils/helpers";

export const Categories = () => {
  const images = [
    "https://images.unsplash.com/photo-1602037299890-c593f4c81d47?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80",
    "https://images.unsplash.com/photo-1531895861208-8504b98fe814?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=750&q=80",
    "https://images.unsplash.com/photo-1591019479261-1a103585c559?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTB8fHNraW4lMjBjYXJlJTIwcHJvZHVjdHxlbnwwfDB8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1505944270255-72b8c68c6a70?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80",
    "https://images.unsplash.com/photo-1565357419076-6acd4a10094e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80",
    "https://images.unsplash.com/photo-1571937544778-3ad68aa84a36?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80",
  ];

  return (
    <div className="categories">
      <h1>Shop By Categories</h1>
      <div className="wrap">
        {mainCategoriesList.map((c, i) => (
          <div className="item" key={i}>
            <img src={images[i]} alt={c} loading="lazy" />
            <div className="content">
              <h2>{c}</h2>
              <Link href={`/main?category=${c}`}>
                <a>Shop Now</a>
              </Link>
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        .wrap {
          margin: auto;
          width: 80%;
        }

        h1 {
          text-align: center;
          font-weight: bold;
        }
        .item {
          margin: 20px 0;
        }
        img {
          height: 200px;
          width: 100%;
          object-fit: cover;
          border-radius: 5px;
        }

        .content {
          text-align: center;
          z-index: 999;
          margin: 5px 0 10px 0;
        }
        h2 {
          font-weight: bold;
        }
        a {
          border-bottom: 2px solid var(--primary);
        }

        @media only screen and (min-width: 700px) {
          .wrap {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            column-gap: 8px;
          }

          h1 {
            font-weight: bold;
            font-size: 1.2rem;
          }
        }

        @media only screen and (min-width: 1000px) {
          .categories {
            margin-top: -20px;
          }
        }

        @media only screen and (min-width: 1200px) {
          .categories {
            margin-top: -70px;
          }
          img {
            border-radius: 7px;
            height: 220px;
          }

          h1 {
            font-size: 1.5rem;
          }

          h2 {
            font-size: 1.1rem;
            margin-top: 2px;
          }
        }

        @media only screen and (min-width: 1800px) {
          .categories {
            margin-top: -80px;
          }
          .wrap {
            grid-template-columns: repeat(3, 1fr);
            column-gap: 8px;
            width: 70%;
          }
          img {
            height: 250px;
          }

          h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
          }

          h2 {
            font-size: 1.2rem;
            margin-top: 3px;
          }
        }
      `}</style>
    </div>
  );
};
