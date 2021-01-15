import { PurchaseSteps } from "@/components/customer/PurchaseSteps";
import { Categories } from "@/components/HomeComponents/Categories";
import { MainHome } from "@/components/HomeComponents/Main";
import { StoresHome } from "@/components/HomeComponents/Stores";
import { Layout } from "@/components/Layout";
import { featuredProducts } from "@/graphql/vendor";
import { graphQLClient } from "@/utils/client";
import React from "react";

export async function getServerSideProps() {
  try {
    const res = await graphQLClient.request(featuredProducts, { limit: 10 });
    const data = res.featuredProducts;
    return {
      props: {
        data,
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

const Home = ({ data }) => {
  return (
    <Layout>
      <MainHome />
      <Categories data={data} />
      <StoresHome />
      <PurchaseSteps />
    </Layout>
  );
};

export default Home;
