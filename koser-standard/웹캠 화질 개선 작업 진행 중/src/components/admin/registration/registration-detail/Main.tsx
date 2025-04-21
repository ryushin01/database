"use client";

import { usePathname } from "next/navigation";
import { Breadcrumb, Typography } from "@components/common";
import { useResponsive } from "@hooks";
import List from "./List";

export default function Main() {
  const { isMobile } = useResponsive();
  const pathname = usePathname();
  const pathArray = pathname.split("/").slice(2);
  const requestNo = pathArray[pathArray.length - 1];

  return (
    <section className="_registration-detail">
      <Breadcrumb />

      <Typography
        as="h2"
        kind={isMobile ? "title-large" : "headline-medium"}
        isBold={true}
        className={isMobile ? "pb-4" : "py-6"}
      >
        등기관리 상세
      </Typography>

      <List requestNo={requestNo} isMobile={isMobile} />
    </section>
  );
}
