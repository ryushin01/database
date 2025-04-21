"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Breadcrumb, Typography } from "@components/common";
import { useResponsive } from "@hooks";
import DetailForm from "./DetailForm";

export default function Main() {
  const { isMobile } = useResponsive();
  const { rqstNo } = useParams();
  const [requestNo, setRqstNo] = useState("");

  useEffect(() => {
    if (rqstNo) {
      const normalizedRqstNo = Array.isArray(rqstNo) ? rqstNo[0] : rqstNo;
      setRqstNo(normalizedRqstNo);
    }
  }, [rqstNo]);

  return (
    <section>
      <Breadcrumb />

      <Typography
        as="h2"
        kind={isMobile ? "title-large" : "headline-medium"}
        isBold={true}
        className={isMobile ? "pb-4" : "py-6"}
      >
        전자등기 배정
      </Typography>

      <DetailForm isMobile={isMobile} rqstNo={requestNo} />
    </section>
  );
}
