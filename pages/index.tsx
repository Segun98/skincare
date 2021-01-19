import { Layout } from "@/components/Layout";

import { PurchaseSteps } from "@/components/customer/PurchaseSteps";
import { Categories } from "@/components/HomeComponents/Categories";
import { MainHome } from "@/components/HomeComponents/Main";
import { StoresHome } from "@/components/HomeComponents/Stores";
import { Featured } from "@/components/HomeComponents/Featured";

import Link from "next/link";
import { Icon } from "@chakra-ui/core";

const Home = () => {
  return (
    <Layout>
      <MainHome />
      <Categories />
      <StoresHome />
      <Featured />
      <PurchaseSteps />
      <section className="home-vendor-onboarding">
        <h1>Sell On Tadlace</h1>
        <div>
          <Link href="/become-a-vendor">
            <a>
              Learn More
              <Icon name="external-link" />
            </a>
          </Link>
        </div>
      </section>
      <style jsx>{`
        .home-vendor-onboarding {
          height: 200px;
          background: var(--deepblue);
          color: white;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .home-vendor-onboarding h1 {
          font-weight: bolder;
          font-size: 2rem;
          font-style: normal;
        }
        .home-vendor-onboarding div {
          margin-top: 10px;
        }

        @media only screen and (min-width: 700px) {
          .home-vendor-onboarding {
            height: 250px;
          }
          .home-vendor-onboarding h1 {
            font-size: 3rem;
          }
        }
      `}</style>
    </Layout>
  );
};

export default Home;
