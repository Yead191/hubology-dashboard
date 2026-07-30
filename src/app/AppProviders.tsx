import type { ReactNode } from "react";
import { ConfigProvider, App as AntdApp, theme as antdTheme } from "antd";
import { Toaster } from "sonner";
import { hubologyTheme } from "@/lib/theme";
import { ServicesProvider } from "@/features/services/ServicesContext";
import { VendorsProvider } from "@/features/vendors/VendorsContext";
import { StoreProvider } from "@/features/store/StoreContext";
import { MembershipProvider } from "@/features/membership/MembershipContext";
import { ForumProvider } from "@/features/forum/ForumContext";
import { IFundAyitiProvider } from "@/features/ifundayiti/IFundAyitiContext";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider theme={{ algorithm: antdTheme.darkAlgorithm, ...hubologyTheme }}>
      <AntdApp>
        <ServicesProvider>
          <VendorsProvider>
            <StoreProvider>
              <MembershipProvider>
                <ForumProvider>
                  <IFundAyitiProvider>
                    {children}
                    <Toaster
                      theme="dark"
                      position="top-right"
                      richColors
                      toastOptions={{
                        style: {
                          background: "#141737",
                          border: "1px solid #23274f",
                          color: "#eef0fb",
                        },
                      }}
                    />
                  </IFundAyitiProvider>
                </ForumProvider>
              </MembershipProvider>
            </StoreProvider>
          </VendorsProvider>
        </ServicesProvider>
      </AntdApp>
    </ConfigProvider>
  );
}
