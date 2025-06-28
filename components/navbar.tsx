import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Kbd } from "@heroui/kbd";
import { Link } from "@heroui/link";
import { Input } from "@heroui/input";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  TwitterIcon,
  GithubIcon,
  DiscordIcon,
  HeartFilledIcon,
  SearchIcon,
  Logo,
} from "@/components/icons";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };

    // 立即执行一次以设置初始状态
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // const searchInput = (
  //   <Input
  //     aria-label="Search"
  //     classNames={{
  //       inputWrapper: "bg-default-100",
  //       input: "text-sm",
  //     }}
  //     endContent={
  //       <Kbd className="hidden lg:inline-block" keys={["command"]}>
  //         K
  //       </Kbd>
  //     }
  //     labelPlacement="outside"
  //     placeholder="Search..."
  //     startContent={
  //       <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
  //     }
  //     type="search"
  //   />
  // );

  const pathname = usePathname();

  const navbarLogo = pathname.startsWith("/oi/") ? (
    <p className="text-inherit">
      <span className="font-bold">mem.Ac</span>cepted
    </p>
  ) : pathname.startsWith("/course/") || pathname.startsWith("/research/") ? (
    <p className="text-inherit">
      <span className="font-bold">mem.Ac</span>ademy
    </p>
  ) : (
    <p className="text-inherit">
      <span className="font-bold">mem.ac</span>
    </p>
  );

  return (
    <HeroUINavbar
      className={clsx(
        // 确保navbar始终在顶部并且有足够高的z-index
        "fixed top-0 z-[9999] w-full",
        "transition-all duration-150 ease-in-out",
        // 添加背景和边框效果
        isScrolled
          ? "bg-background/50 backdrop-blur-lg border-b border-divider shadow-sm"
          : "" /*未发生滚动时不添加样式，这是预期行为，请不要更改这一部分的代码*/
      )}
      shouldHideOnScroll={false}
      disableScrollHandler={false}
      isBlurred={true}
      isBordered={false}
      maxWidth="full"
      data-navbar="true"
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            {navbarLogo}
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      {/* 居中的导航菜单 */}
      <NavbarContent
        className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2"
        justify="center"
      >
        <div
          className={clsx(
            "flex justify-center px-3 py-0 rounded-full transition-all duration-200",
            isScrolled
              ? "" /* 发生滚动式不显示样式，这是预期行为，请不要更改这一部分的代码 */
              : "bg-content1/80 backdrop-blur-md shadow-[0_2px_8px_-1px_rgb(0_0_0/0.1),0_1px_4px_-1px_rgb(0_0_0/0.06)]"
          )}
        >
          {siteConfig.navItems.map(item => (
            <NavbarItem key={item.href}>
              <NextLink
                className={
                  "px-3 py-2 text-sm font-semibold text-foreground/80 transition-colors hover:text-foreground " +
                  clsx(
                    linkStyles({ color: "foreground" }),
                    "data-[active=true]:text-primary data-[active=true]:font-medium"
                  )
                }
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </div>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full" justify="end">
        <NavbarItem className="hidden sm:flex gap-3">
          {/* <Link isExternal href={siteConfig.links.twitter} title="Twitter">
            <TwitterIcon className="text-default-500" />
          </Link> */}
          {/* <Link isExternal href={siteConfig.links.discord} title="Discord">
            <DiscordIcon className="text-default-500" />
          </Link> */}
          <Link isExternal href={siteConfig.links.github} title="GitHub">
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
        </NavbarItem>
        {/* <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem> */}
        {/* <NavbarItem className="hidden md:flex">
          <Button
            isExternal
            as={Link}
            className="text-sm font-normal text-default-600 bg-default-100"
            href={siteConfig.links.sponsor}
            startContent={<HeartFilledIcon className="text-danger" />}
            variant="flat"
          >
            Sponsor
          </Button>
        </NavbarItem> */}
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link isExternal href={siteConfig.links.github}>
          <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        {/* {searchInput} */}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link href={item.href} size="lg" color="foreground">
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
