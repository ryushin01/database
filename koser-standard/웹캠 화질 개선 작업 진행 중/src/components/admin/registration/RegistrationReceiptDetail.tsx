import { Typography } from "@components/common";
import { ResponsiveType } from "@types";
import { useQuery } from "@tanstack/react-query";
import { getRegistrationAcceptData } from "@services/registrationManagement";
import { getDetailAddress, getManagerInfo } from "@utils/stringUtil";

type RegistrationReceiptDataProps = {
  requestNo: string;
};

export default function RegistrationReceiptDetail({
  requestNo,
  isMobile,
}: RegistrationReceiptDataProps & ResponsiveType) {
  /* 등기접수증 정보 조회 */
  const { data: data } = useQuery({
    queryKey: ["admin-registration-receipt", requestNo],
    queryFn: async () => await getRegistrationAcceptData(requestNo),
    select: (response) => response.data?.data,
    enabled: !!requestNo,
  });
  return (
    <>
      {/* 담보목적물 주소 */}
      <section className="_section">
        <Typography
          as="h2"
          kind={isMobile ? "body-large" : "title-medium"}
          isBold={true}
          className="_title"
        >
          담보목적물 주소
        </Typography>
        <div className="_responsive-table-inner-wrapper _no-thead">
          <table className="_responsive-table">
            <caption className="_hidden-table-caption">
              담보목적물 주소 표
            </caption>
            <tbody>
              <tr>
                <th>
                  <Typography
                    kind={isMobile ? "body-small" : "body-large"}
                    isBold={true}
                  >
                    지번
                  </Typography>
                </th>
                <td colSpan={3}>
                  <Typography kind={isMobile ? "body-small" : "body-large"}>
                    {data?.lotnumAddr || "-"}
                  </Typography>
                </td>
              </tr>
              <tr>
                <th>
                  <Typography
                    kind={isMobile ? "body-small" : "body-large"}
                    isBold={true}
                  >
                    도로명
                  </Typography>
                </th>
                <td colSpan={3}>
                  <Typography kind={isMobile ? "body-small" : "body-large"}>
                    {data?.rdnmAddr || "-"}
                  </Typography>
                </td>
              </tr>
              <tr>
                <th>
                  <Typography
                    kind={isMobile ? "body-small" : "body-large"}
                    isBold={true}
                  >
                    상세주소
                  </Typography>
                </th>
                <td colSpan={3}>
                  <Typography kind={isMobile ? "body-small" : "body-large"}>
                    {getDetailAddress(data?.bldg, data?.unit)}
                  </Typography>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 기본 정보 */}
      <section className="_section">
        <Typography
          as="h2"
          kind={isMobile ? "body-large" : "title-medium"}
          isBold={true}
          className="_title"
        >
          기본 정보
        </Typography>
        <div className="_responsive-table-inner-wrapper _no-thead">
          <table className="_responsive-table">
            <caption className="_hidden-table-caption">기본 정보 표</caption>
            <tbody>
              <tr>
                <th>
                  <Typography
                    kind={isMobile ? "body-small" : "body-large"}
                    isBold={true}
                  >
                    의뢰번호
                  </Typography>
                </th>
                <td>
                  <Typography kind={isMobile ? "body-small" : "body-large"}>
                    {requestNo}
                  </Typography>
                </td>
                <th>
                  <Typography
                    kind={isMobile ? "body-small" : "body-large"}
                    isBold={true}
                  >
                    채무자
                  </Typography>
                </th>
                <td>
                  <Typography kind={isMobile ? "body-small" : "body-large"}>
                    {data?.dbtrNm || "-"}
                  </Typography>
                </td>
              </tr>
              <tr>
                <th>
                  <Typography
                    kind={isMobile ? "body-small" : "body-large"}
                    isBold={true}
                  >
                    대출실행일
                  </Typography>
                </th>
                <td>
                  <Typography kind={isMobile ? "body-small" : "body-large"}>
                    {data?.execDt || "-"}
                  </Typography>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 등기접수 정보 */}
      <section className="_section">
        <Typography
          as="h2"
          kind={isMobile ? "body-large" : "title-medium"}
          isBold={true}
          className="_title"
        >
          등기접수 정보
        </Typography>
        <div className="_responsive-table-inner-wrapper _no-thead">
          <table className="_responsive-table">
            <caption className="_hidden-table-caption">
              등기접수 정보 표
            </caption>
            <tbody>
              <tr>
                <th>
                  <Typography
                    kind={isMobile ? "body-small" : "body-large"}
                    isBold={true}
                  >
                    관할법원
                  </Typography>
                </th>
                <td colSpan={3}>
                  <Typography kind={isMobile ? "body-small" : "body-large"}>
                    {data?.judtCourtNm || "-"}
                  </Typography>
                </td>
              </tr>
              <tr>
                <th>
                  <Typography
                    kind={isMobile ? "body-small" : "body-large"}
                    isBold={true}
                  >
                    등기소
                  </Typography>
                </th>
                <td colSpan={3}>
                  <Typography kind={isMobile ? "body-small" : "body-large"}>
                    {data?.regrNm || "-"}
                  </Typography>
                </td>
              </tr>
              <tr>
                <th>
                  <Typography
                    kind={isMobile ? "body-small" : "body-large"}
                    isBold={true}
                  >
                    접수번호
                  </Typography>
                </th>
                <td colSpan={3}>
                  <Typography kind={isMobile ? "body-small" : "body-large"}>
                    {data?.acptNo || "-"}
                  </Typography>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 담당자 정보 */}
      <section className="_section">
        <Typography
          as="h2"
          kind={isMobile ? "body-large" : "title-medium"}
          isBold={true}
          className="_title"
        >
          담당자 정보
        </Typography>
        <div className="_responsive-table-inner-wrapper _no-thead">
          <table className="_responsive-table">
            <caption className="_hidden-table-caption">담당자 정보 표</caption>
            <tbody>
              <tr>
                <th>
                  <Typography
                    kind={isMobile ? "body-small" : "body-large"}
                    isBold={true}
                  >
                    금융기관
                  </Typography>
                </th>
                <td colSpan={3}>
                  <Typography kind={isMobile ? "body-small" : "body-large"}>
                    {getManagerInfo(data?.bndMembNm, data?.bndMembHpno)}
                  </Typography>
                </td>
              </tr>
              <tr>
                <th>
                  <Typography
                    kind={isMobile ? "body-small" : "body-large"}
                    isBold={true}
                  >
                    법무대리인
                  </Typography>
                </th>
                <td colSpan={3}>
                  <Typography kind={isMobile ? "body-small" : "body-large"}>
                    {getManagerInfo(data?.lgagMembNm, data?.lgagMembHpno)}
                  </Typography>
                </td>
              </tr>
              <tr>
                <th>
                  <Typography
                    kind={isMobile ? "body-small" : "body-large"}
                    isBold={true}
                  >
                    시스템 관리자
                  </Typography>
                </th>
                <td colSpan={3}>
                  <Typography kind={isMobile ? "body-small" : "body-large"}>
                    {getManagerInfo(data?.mngrMembNm, data?.mngrMembHpno)}
                  </Typography>
                </td>
              </tr>
              <tr>
                <th>
                  <Typography
                    kind={isMobile ? "body-small" : "body-large"}
                    isBold={true}
                  >
                    전달사항
                  </Typography>
                </th>
                <td colSpan={3}>
                  <Typography kind={isMobile ? "body-small" : "body-large"}>
                    {data?.mngrDlvrCnts || "-"}
                  </Typography>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
