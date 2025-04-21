import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LOGIN_PATH, FI_PATH, FI_HOME, AD_PATH, AD_ASSIGN, LA_PATH } from "@constants/path";
import { PUBLIC_FILES_REG_EXP } from "@constants/reg-exp";

/**
 * @name middleware
 * @version 1.0.0
 * @author 류창선 <zero.ryushin@bankle.co.kr>
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const membGbCd = request.cookies.get("membGbCd");
  const isLogin: boolean = !!membGbCd?.value;
  const isFinancial = membGbCd?.value === "00";
  const isAdmin = membGbCd?.value === "20";
  const isFinancialPage = [FI_PATH].some((path) => pathname.includes(path));
  const isAdminPage = [AD_PATH].some((path) => pathname.includes(path));
  const isMemberPage = [
    FI_PATH,
    AD_PATH,
    LA_PATH,
  ].some((path) => pathname.includes(path));
  const isValidPublicFiles = request.nextUrl.pathname.match(PUBLIC_FILES_REG_EXP);

  // 정적 파일 정상 유무 확인
  if (isValidPublicFiles) {
    return NextResponse.next();
  }

  // 금융기관 로그인 상태에서 금융기관 권한 외 접근 시
  if (isFinancial && !isFinancialPage) {
    return NextResponse.redirect(new URL(FI_HOME, request.url));
  }

  // 관리자 로그인 상태에서 관리자 권한 외 접근 시
  if (isAdmin && !isAdminPage) {
    return NextResponse.redirect(new URL(AD_ASSIGN, request.url));
  }

  // 미 로그인 상태에서 권한 페이지 접근 시
  if (!isLogin && isMemberPage) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
