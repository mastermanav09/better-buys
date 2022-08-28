import Head from "next/head";
import ProductItem from "../components/ProductItem";
import data from "../utils/data";

const Home = (props) => {
  const { products } = props;

  return (
    <>
      <Head>
        <title>Better Buys</title>
        <meta name="description" content="Ecommerce website" />
      </Head>
      <div className="grid grid-cols-2 xs-max:grid-cols-1 gap-2 md:grid-cols-3 lg:grid-cols-4 text-xs lg:text-sm md:gap-4">
        {products.map((product) => (
          <ProductItem key={product.slug} product={product} />
        ))}
      </div>
    </>
  );
};

export default Home;

export async function getStaticProps() {
  const { products } = JSON.parse(data);
  return {
    props: {
      products,
    },
  };
}
