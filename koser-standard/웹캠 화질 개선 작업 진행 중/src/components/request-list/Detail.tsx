"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FI_REQUEST } from "@constants/path";
import { PROC_STAT_CD } from "@constants/code";
import { Typography } from "@components/common";
import { Button } from "@components/button";
import { Loading } from "@components/common";
import { getRequestInfoData, patchRegistrationHold } from "@services/request";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ResponsiveType } from "@types";
import { getManagerInfo } from "@utils/stringUtil";
import { toastState } from "@stores";
import { useSetAtom } from "jotai";

type DetailDataProps = {
  requestNo: string;
  onClose?: () => void;
};

export default function Detail({
                                 requestNo,
                                 onClose,
                                 isDesktop,
                               }: DetailDataProps & ResponsiveType) {
  const router = useRouter();
  const openToast = useSetAtom(toastState);
  const [isHoldDisabled, setIsHoldDisabled] = useState(false);

  /* 등기자료 정보 조회 */
  const { data: data, isLoading: requestListLoading } = useQuery({
    queryKey: ["request-info", requestNo],
    queryFn: async () => await getRequestInfoData(requestNo),
    select: (response) => response.data?.data,
    enabled: true,
  });

  /* 진행보류 처리 */
  const { mutate: registrationHold } = useMutation({
    mutationKey: ["registration-hold"],
    mutationFn: async () => await patchRegistrationHold(requestNo),
    onSuccess: (res) => {
      console.log("🟢 진행보류 성공", res);
      openToast({
        message: "진행보류 상태로 변경되었습니다.\n관리자 확인 후 처리됩니다.",
        position: isDesktop ? "top" : "bottom",
        afterFunc: onClose,
      });
    },
    onError: (error) => {
      console.log("🔴", error);
      setIsHoldDisabled(false);
    },
  });

  const handelRegistrationHold = () => {
    registrationHold();
    setIsHoldDisabled(true);
  };

  return (
    <>
      {requestListLoading && <Loading />}
      {/* 기본 정보 */}
      <section className="_section">
        <Typography
          as="h2"
          kind={isDesktop ? "title-medium" : "body-large"}
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
                  kind={isDesktop ? "body-large" : "body-small"}
                  isBold={true}
                >
                  의뢰번호
                </Typography>
              </th>
              <td colSpan={3}>
                <Typography
                  kind={isDesktop ? "body-large" : "body-small"}
                >
                  {requestNo}
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
          kind={isDesktop ? "title-medium" : "body-large"}
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
                  kind={isDesktop ? "body-large" : "body-small"}
                  isBold={true}
                >
                  법무대리인
                </Typography>
              </th>
              <td colSpan={3}>
                <Typography
                  kind={isDesktop ? "body-large" : "body-small"}
                >
                  {getManagerInfo(data?.lgagMembNm, data?.lgagMembHpno)}
                </Typography>
              </td>
            </tr>
            <tr>
              <th>
                <Typography
                  kind={isDesktop ? "body-large" : "body-small"}
                  isBold={true}
                >
                  시스템 관리자
                </Typography>
              </th>
              <td colSpan={3}>
                <Typography
                  kind={isDesktop ? "body-large" : "body-small"}
                >
                  {getManagerInfo(data?.mngrMembNm, data?.mngrMembHpno)}
                </Typography>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 보완요청 사유 */}
      {data?.statCd === PROC_STAT_CD.SUPPLEMENT && (
        <section className="_section">
          <Typography
            as="h2"
            kind={isDesktop ? "title-medium" : "body-large"}
            isBold={true}
            className="_title _point"
          >
            보완요청 사유
          </Typography>
          <div className="_notice">
            <Typography as="p" kind={isDesktop ? "body-large" : "body-small"}>
              {data?.procRsnCnts || "-"}
            </Typography>
          </div>
        </section>
      )}

      {/* CTA 버튼 영역 */}
      <section className="_section">
        <div className="_button-wrap">
          <Button
            shape="solid"
            size="md"
            color="grayscale"
            disabled={isHoldDisabled}
            onClick={handelRegistrationHold}
          >
            진행보류
          </Button>

          <Button
            shape="solid"
            size="md"
            color="main100"
            onClick={() => router.push(`${FI_REQUEST}?requestNo=${requestNo}`)}
          >
            다시 제출하기
          </Button>
        </div>
      </section>
    </>
  );
}
