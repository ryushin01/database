import { Typography } from "@components/common";
import { ResponsiveType } from "@types";

export default function LoginNotice({ isDesktop }: ResponsiveType) {
  return (
    <div className="_login-notice">
      <Typography kind={isDesktop ? "body-large" : "body-small"}>전자등기 관리 시스템 사용 문의</Typography>

      <div>
        <a
          href="https://www.bankclear.co.kr"
          target="_blank"
          rel="noopener noreferrer"
        >
          www.bankclear.co.kr
        </a>
        <Typography kind={isDesktop ? "body-medium" : "caption-large"}>Tel. 1877-2495 | Fax. 070-7705-7823</Typography>
        <a href="mailto:service@bankle.co.kr">service@bankle.co.kr</a>
      </div>
    </div>
  );
}