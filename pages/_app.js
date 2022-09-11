import "../styles/globals.css";
import Layout from "../components/Layout";
import store from "../utils/store/store";
import { Provider as StoreProvider } from "react-redux";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import PageLoader from "../components/svg/PageLoader";

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <StoreProvider store={store}>
        {Component.auth ? (
          <Auth>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </Auth>
        ) : (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
      </StoreProvider>
    </SessionProvider>
  );
}

function Auth({ children }) {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/unauthorized?message=login required");
    },
  });

  if (status === "loading") {
    return <PageLoader />;
  }

  return children;
}

export default MyApp;
