import { Products } from "@/Typescript/types";
import Link from "next/link";

interface props {
  data: Products[];
}
export const Categories: React.FC<props> = ({ data }) => {
  const categories = [
    "Body",
    "Hair",
    "Sunscreen",
    "Face Cosmetics",
    "Soap",
    "Make Up",
  ];

  return (
    <div className="categories">
      <h1>Shop By Categories</h1>
      <div className="wrap">
        {data.map((c, i) => (
          <div className="item" key={c.id}>
            <img src={c.images[0]} alt={c.name} />
            <div className="content">
              <h2>{categories[i]}</h2>
              <Link href={`/product/${c.name_slug}`}>
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
        }
        .item {
          margin: 15px 0;
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
          img {
            border-radius: 5px;
          }
        }

        @media only screen and (min-width: 1200px) {
          .categories {
            margin-top: -70px;
          }
          img {
            border-radius: 8px;
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
