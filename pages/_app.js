import "../styles/globals.css";
import Layout from "../components/Layout";
import store from "../utils/store/store";
import { Provider as StoreProvider } from "react-redux";
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <StoreProvider store={store}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </StoreProvider>
    </SessionProvider>
  );
}

export default MyApp;
