"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import { usePathname } from "next/navigation";
import Link from "next/link";

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
  const drawerWidth = 240;
  const listAppBar = [
    { text: "Đơn hàng", link: "/" },
    { text: "Sản phẩm", link: "/products" },
    { text: "Hình ảnh", link: "/media" },
  ];
  const pathname = usePathname();

  console.log("PATHNAME", pathname);
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
                      <ListItemText primary={li.text} />
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
