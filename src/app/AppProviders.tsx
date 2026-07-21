import type { ReactNode } from "react";
import { ConfigProvider, App as AntdApp, theme as antdTheme } from "antd";
import { Toaster } from "sonner";
import { hubologyTheme } from "@/lib/theme";
import { AuthProvider } from "@/features/auth/AuthContext";
import { ServicesProvider } from "@/features/services/ServicesContext";
import { VendorsProvider } from "@/features/vendors/VendorsContext";
import { StoreProvider } from "@/features/store/StoreContext";
import { MembershipProvider } from "@/features/membership/MembershipContext";
import { ForumProvider } from "@/features/forum/ForumContext";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider theme={{ algorithm: antdTheme.darkAlgorithm, ...hubologyTheme }}>
      <AntdApp>
        <AuthProvider>
          <ServicesProvider>
            <VendorsProvider>
              <StoreProvider>
                <MembershipProvider>
                  <ForumProvider>
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
                  </ForumProvider>
                </MembershipProvider>
              </StoreProvider>
            </VendorsProvider>
          </ServicesProvider>
        </AuthProvider>
      </AntdApp>
    </ConfigProvider>
  );
}
