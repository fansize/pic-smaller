import { ConfigProvider, App as AntApp } from "antd";
import { observer } from "mobx-react-lite";
import { gstate } from "./global";
import { ContextAction } from "./ContextAction";
import { Analytics } from "@vercel/analytics/react";
import { Loading } from "./components/Loading";
import { useResponse } from "./media";
import { useEffect } from "react";

function useMobileVConsole() {
  const { isMobile } = useResponse();
  useEffect(() => {
    if (!isMobile || !import.meta.env.DEV) return;
    let vConsole: any = null;
    import("vconsole").then((result) => {
      vConsole = new result.default({ theme: "dark" });
    });
    return () => vConsole?.destroy();
  }, [isMobile]);
}

function useUmamiTracker() {
  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.defer = true;
    script.setAttribute('data-website-id', '82f5691a-c934-4507-85ec-8b2942a5de17');
    script.src = 'https://umami-selfhost-dusky.vercel.app/script.js';

    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);
}

export const App = observer(() => {
  useMobileVConsole();
  useUmamiTracker();

  return (
    <ConfigProvider
      locale={gstate.locale?.antLocale}
      theme={{
        token: {
          colorPrimary: "#1da565",
          colorLink: "#1da565",
          colorSuccess: "#1da565",
        },
      }}
    >
      <AntApp>
        <ContextAction />
      </AntApp>
      {import.meta.env.MODE === "production" && <Analytics />}
      {gstate.page}
      {gstate.loading && <Loading />}
    </ConfigProvider>
  );
});
