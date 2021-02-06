import { companyName } from "@/utils/helpers";
import Head from "next/head";

//The other layout doesn't cover the vendor aspect of things
export const GlobalLayout = ({ children }) => {
  return (
    <div>
      {/* GLOBAL HEAD TAGS  */}
      <Head>
        <title>
          {companyName} | The number one #1 market place for Skin and body care
          products
        </title>
        <meta
          name="description"
          content="The number one #1 market place for Skin and Body care products, Male and Female, in Lagos, Nigeria"
        />
        <meta
          name="keywords"
          content="Skin Care,Beauty, E-Commerce, Online Store, Market, Lagos"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2D2D2D" />
        <link rel="icon" href="/home-alt.svg" />
        <link rel="apple-touch-icon" href="/home-alt.svg" />
      </Head>
      {children}
      {/* GLOBAL STYLES  */}
      <style jsx global>{`
        :root {
          --primary: #2d2d2d;
          --soft: #fafafb;
          --secondary: #2a69ac;

          --box: 0 1px 6px 0;
          --softgrey: rgba(32, 33, 36, 0.28);
          --lightblue: #cbd8f9;
          --shinyblue: #2d2d2d;
          --deepblue: #2d2d2d;
          --text: #1f2c35;
          --softblue: #fafafb;
          --pink: #f082ac;
          --green: #2cc096;
        }
      `}</style>
    </div>
  );
};
