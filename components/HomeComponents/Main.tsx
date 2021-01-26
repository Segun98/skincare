import { useState } from "react";
import { useRouter } from "next/router";

import { Icon, Input, InputGroup, InputLeftElement } from "@chakra-ui/core";

export const MainHome = () => {
  const [search, setSearch] = useState("");

  const router = useRouter();

  function handleSearch(e) {
    e.preventDefault();
    if (search.trim() !== "") {
      router.push(`/search?query=${search}`);
    }
  }
  return (
    <div>
      <main>
        <div className="main_content">
          <h1>
            Welcome to the #1 online marketplace for quality skin and hair care
            products
          </h1>
          <form onSubmit={handleSearch} autoComplete="new-password">
            <InputGroup size="md">
              <InputLeftElement
                cursor="pointer"
                onClick={handleSearch}
                pointerEvents="all"
                children={<Icon name="search" color="var(--primary)" />}
              />

              <Input
                autoComplete="new-password"
                aria-label="search"
                title="search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                name="search"
                id="search"
                className="search"
                placeholder="Search our 1000+ products"
                borderRadius="12px"
                color="var(--primary)"
              />
            </InputGroup>
          </form>
        </div>
      </main>
      <img src="/wave.svg" alt="" />
      <style jsx>{`
        main {
          z-index: 999;
          height: 250px;
          background: #2d2d2d; /* fallback for old browsers */
          background: -webkit-linear-gradient(
            to top,
            #2d2d2d,
            #2d2d2d
          ); /* Chrome 10-25, Safari 5.1-6 */
          background: linear-gradient(
            to top,
            #2d2d2d,
            #2d2d2d
          ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        img {
          margin-top: -30px;
        }

        .main_content {
          display: flex;
          flex-direction: column;
          margin: auto;
          width: 90%;
        }

        h1 {
          margin-bottom: 15px;
          text-align: center;
        }

        @media only screen and (min-width: 700px) {
          .main_content {
            width: 75%;
          }

          h1 {
            font-size: 1.1rem;
          }
        }

        @media only screen and (min-width: 1200px) {
          main {
            height: 300px;
          }
          .main_content {
            margin-top: 150px;
            width: 60%;
          }
          h1 {
            font-size: 1.5rem;
            margin-bottom: 25px;
          }
        }

        @media only screen and (min-width: 1800px) {
          main {
            height: 400px;
          }
          .main_content {
            margin-top: 200px;
            width: 50%;
          }
          h1 {
            font-size: 2rem;
            margin-bottom: 35px;
          }
        }
      `}</style>
    </div>
  );
};
