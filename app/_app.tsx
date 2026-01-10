"use client";

import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { Toaster } from "sonner";

export default function App({ Component, pageProps }: any) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
      <Toaster position="top-right" />
    </Provider>
  );
}
