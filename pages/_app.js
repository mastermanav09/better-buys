import { useEffect } from "react";
import "../styles/globals.css";
import Layout from "../components/Layout";
import store from "../utils/store/store";
import { Provider as StoreProvider } from "react-redux";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import PageLoader from "../components/progress/PageLoader";
import { Progress } from "../components/progress";
import { useProgressStore } from "../utils/store/progress-store/useProgressStore";

function MyApp({ Component, pageProps }) {
  const setIsAnimating = useProgressStore((state) => state.setIsAnimating);
  const isAnimating = useProgressStore((state) => state.isAnimating);
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => {
      setIsAnimating(true);
    };

    const handleStop = () => {
      setIsAnimating(false);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router, setIsAnimating]);

  return (
    <SessionProvider session={pageProps.session}>
      <StoreProvider store={store}>
        <Progress isAnimating={isAnimating} />
        {Component.auth ? (
          <Auth adminOnly={Component.auth.adminOnly}>
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

function Auth({ children, adminOnly }) {
  const router = useRouter();
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/unauthorized?message=login required");
    },
  });

  if (status === "loading") {
    return <PageLoader />;
  }

  if (adminOnly && !session.user.isAdmin) {
    router.push("/unauthorized?message=admin login required");
  }

  return children;
}

export default MyApp;
