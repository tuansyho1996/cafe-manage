"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useMediaQuery("(max-width:768px)");
  const drawerWidth = isCollapsed ? 60 : 240;
  const listAppBar = [
    { text: "Quản lý", link: "/", icon: "🏠" },
    { text: "Sản phẩm", link: "/products", icon: "📦" },
    { text: "Hình ảnh", link: "/media", icon: "🖼️" },
    { text: "Đơn hàng", link: "/order", icon: "📋" },
  ];
  const pathname = usePathname();

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
        <div className="flex">
          {/* Sidebar */}
          <Drawer
            variant="permanent"
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: {
                width: drawerWidth,
                boxSizing: "border-box",
              },
            }}
          >
            <div className="p-2">
              <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                ☰
              </IconButton>
            </div>
            <List>
              {listAppBar.map((li) => (
                <Link key={li.link} href={li.link} passHref>
                  <ListItem disablePadding>
                    <ListItemButton
                      selected={pathname === li.link}
                      sx={{
                        "&.Mui-selected": {
                          backgroundColor: "var(--background)", // Custom background color for selected state
                          "&:hover": {
                            backgroundColor: "darkred", // Custom background color on hover when selected
                          },
                        },
                        "&:hover": {
                          backgroundColor: "var(--foreground)", // Custom background color on hover when not selected
                        },
                      }}
                    >
                      <span className="mr-2">{li.icon}</span>
                      {!isCollapsed && <ListItemText primary={li.text} />}
                    </ListItemButton>
                  </ListItem>
                </Link>
              ))}
            </List>
          </Drawer>

          {/* Nội dung chính */}
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
