import Head from "next/head";
import { Layout } from "@/components/Layout";
import Link from "next/link";
import { Text } from "@chakra-ui/core";
import { ContactForm } from "@/components/ContactForm";
import { companyName } from "@/utils/helpers";

const Sell = () => {
  return (
    <Layout>
      <Head>
        <title>Become a Vendor | {companyName}</title>
        <meta
          name="description"
          content="Become a vendor on Tadlace, start selling and boost your sales. The number one #1 market place for Skin care products, Male and Female, in Lagos, Nigeria"
        />
        <meta
          name="keywords"
          content="Sell on Tadlace, become a vendor tadlace, Skin Care,Beauty, E-Commerce, Online Store, Market, Lagos"
        />
      </Head>
      <div className="become-a-vendor">
        <header>
          <div className="split">
            <div className="left">
              <h1>Partner With Us, Grow Your Business The Right Way!</h1>
              <p>
                Start selling today on {companyName}, we handle everything, from
                delivery to order management. All you have to do is make your
                products available as orders roll in, that easy!
              </p>
              <Link href="/vendor/register">
                <a>Get Started</a>
              </Link>
            </div>
            <div className="right">
              <img src="/vendor-store.png" alt="become a vendor" />
            </div>
          </div>
        </header>

        <section className="how-it-works">
          <h1>How {companyName} Works</h1>
          <div className="wrap">
            <div className="split">
              <h2>List your store with us</h2>
              <p>
                Sign up and start adding your products to your public store page
                for free
              </p>
            </div>
            <div className="split">
              <h2>Recieve Orders</h2>
              <p>
                Start acknowledging orders from your comprehensive dashboard
              </p>
            </div>
            <div className="split">
              <h2>Delivery</h2>
              <p>
                A delivery person comes to pick up the product(s) customers have
                ordered. It's that simple.
              </p>
            </div>
            <div className="split">
              <h2>Payment</h2>
              <p>
                Once an order has been delivered to customers, your wallet gets
                funded instantly and is available for withdrawal anytime
              </p>
            </div>
          </div>
        </section>

        <section className="product">
          <div className="wrap">
            <div className="dashboard">
              <div className="split">
                <img src="/dashboard.png" alt="vendor dashboard" />
              </div>
              <div className="split">
                <h1>Your Dashboard</h1>
                <p>
                  Your comprehensive dashboard highlights your order status,
                  completed orders are orders that have been delivered to
                  customers. A sales metrics showing your completed orders by
                  month and recent orders are also highlighted.
                </p>
              </div>
            </div>

            <div className="orders">
              <div className="split">
                <h1>Manage Orders</h1>
                <p>
                  All the necessary information about an order is provided here.
                  This is where you acknowledge and track the orders you
                  recieve.
                </p>
              </div>

              <div className="split">
                <img src="/orders-page.png" alt="vendor orders" />
              </div>
            </div>

            <div className="store">
              <div className="split">
                <img src="/td-store.png" alt="vendor public store" />
              </div>
              <div className="split">
                <h1>Your Public Store</h1>
                <p>
                  Get a public store page with a unique url, customers can
                  easily purchase your products from this SEO backed page. Your
                  store and products are promoted on our main maketplace
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="start">
          <h1>Grow Your Business With Less Effort</h1>
          <Text as="div" className="mr-2 ml-2">
            <Link href="/vendor/register">
              <a>Get Started</a>
            </Link>
          </Text>
        </section>

        <section style={{ background: "var(--softblue)" }}>
          <ContactForm />
        </section>
      </div>
      <style jsx>{``}</style>
    </Layout>
  );
};

export default Sell;
