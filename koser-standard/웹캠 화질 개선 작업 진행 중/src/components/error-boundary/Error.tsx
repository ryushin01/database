"use client";

import { useRouter, usePathname } from "next/navigation";
import { FI_HOME, AD_ASSIGN } from "@constants/path";
import { Typography } from "@components/common";
import { Button } from "@components/button";
import { useResponsive } from "@hooks";

type ErrorProps = {
  onReset?: () => void;
}

/**
 * @name Error
 * @version 1.1.0
 * @author 류창선 <zero.ryushin@bankle.co.kr>
 * @description react-error-boundary 사용 시 클라이언트 컴포넌트이어야 합니다.
 * @property {function} onReset   - 에러 초기화 함수
 */
const Error = ({ onReset }: ErrorProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isMobile } = useResponsive();

  const goToFIHome = () => router.push(FI_HOME);

  const goToADHome = () => router.push(AD_ASSIGN);

  return (
    <section className="_error-page">
      <div className="_error-page-inner-wrapper">
        <div>
          <Typography
            as="h1"
            kind={isMobile ? "error-subtitle" : "error-title"}
            isBold={true}
          >
            일시적인 오류가 발생했습니다.
          </Typography>

          <Typography
            as="h2"
            kind={isMobile ? "error-text" : "error-subtitle"}
            isBold={true}
          >
            서비스 이용에 불편을 드려 죄송합니다.<br />
            잠시 후 다시 시도해 주세요.
          </Typography>
        </div>

        <div>
          <Button
            type="button"
            shape="outline"
            size={isMobile ? "sm" : "lg"}
            color="grayscale"
            onClick={pathname.includes("admin") ? goToADHome : goToFIHome}
          >
            홈으로 이동하기
          </Button>

          <Button
            type="button"
            shape="solid"
            size={isMobile ? "sm" : "lg"}
            color="main100"
            onClick={onReset}
          >
            새로고침
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Error;