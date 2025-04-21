"use client";

import { Dispatch, useState } from "react";
import { ResponsiveSwiper, Typography } from "@components/common";
import { ATTC_FIL_CD, PROC_STAT_CD } from "@constants/code";
import { Grid, GridItem } from "@components/layout";
import { Button } from "@components/button";
import { Modal } from "@components/modal";
import { useDisclosure } from "@hooks";
import RegistrationDataDetail from "@components/status-inquiry/RegistrationDataDetail";
import { ResponsiveType } from "@types";
import Detail from "./Detail";
import "@styles/responsive-table.css";

type RequestListDataProps = {
  data: RequestListData;
  setQueryTime: Dispatch<React.SetStateAction<Date>>;
};

type RequestListData = {
  totalPages: number;
  totalElements: number;
  rqstList: RequestListItemData[];
};

type RequestListItemData = {
  rqstNo: string;
  execDt: string;
  crtDtm: string;
  statNm: string;
  statCd: string;
};

/**
 * @name List
 * @param data 금융기관 - 전자등기 의뢰목록 조회 결과
 * @param isMobile 모바일 여부
 * @version 1.0.0
 * @author 이은희 <leun1013@bankle.co.kr>
 * @description 금융기관 - 전자등기 의뢰목록 조회
 */
export default function Table({
                                data,
                                setQueryTime,
                                isDesktop,
                              }: RequestListDataProps & ResponsiveType) {
  const [requestNo, setRequestNo] = useState<string>("");

  const {
    isOpen: isModalOpen,
    open: openModal,
    close: closeModal,
  } = useDisclosure();

  const {
    isOpen: isRegistrationDataModalOpen,
    open: openRegistrationDataModal,
    close: closeRegistrationDataModal,
  } = useDisclosure();

  const handleClick = (requestNo: string, statCd: string) => {
    setRequestNo(requestNo);

    if (statCd === PROC_STAT_CD.REQUEST || statCd === PROC_STAT_CD.SUPPLEMENT) {
      openModal();
    } else {
      openRegistrationDataModal();
    }
  };

  //등기자료(보완필요) - 진행보류 처리 후 리스트 재조회
  const handleCloseModal = () => {
    closeModal();
    setQueryTime(new Date());
  };

  //등기자료 - 진행보류 처리 후 리스트 재조회
  const handelCloseRegistrationDataModal = () => {
    closeRegistrationDataModal();
    setQueryTime(new Date());
  };

  return (
    <>
      <div className="_responsive-table-inner-wrapper _has-thead">
        <table className="_responsive-table _col-5-type">
          <caption className="_hidden-table-caption">
            전자등기 의뢰목록 미배정 표
          </caption>
          <thead>
          <tr>
            <th>
              <Typography
                kind={isDesktop ? "title-medium" : "body-medium"}
                isBold={true}
              >
                의뢰번호
              </Typography>
            </th>
            <th>
              <Typography
                kind={isDesktop ? "title-medium" : "body-medium"}
                isBold={true}
              >
                대출실행일
              </Typography>
            </th>
            <th>
              <Typography
                kind={isDesktop ? "title-medium" : "body-medium"}
                isBold={true}
              >
                의뢰일시
              </Typography>
            </th>
            <th>
              <Typography
                kind={isDesktop ? "title-medium" : "body-medium"}
                isBold={true}
              >
                진행상태
              </Typography>
            </th>
            <th>
              <Typography
                kind={isDesktop ? "title-medium" : "body-medium"}
                isBold={true}
              >
                등기자료
              </Typography>
            </th>
          </tr>
          </thead>
          <tbody>
          {data?.rqstList?.map((item: RequestListItemData) => {
            const { rqstNo, execDt, crtDtm, statNm, statCd } = item;
            return (
              <tr key={rqstNo}>
                <td>
                  <Typography
                    kind={isDesktop ? "title-medium" : "body-medium"}
                  >
                    {rqstNo}
                  </Typography>
                </td>
                <td>
                  <Typography
                    kind={isDesktop ? "title-medium" : "body-medium"}
                  >
                    {execDt}
                  </Typography>
                </td>
                <td>
                  <Typography
                    kind={isDesktop ? "title-medium" : "body-medium"}
                  >
                    {crtDtm}
                  </Typography>
                </td>
                <td>
                  <Typography
                    kind={isDesktop ? "title-medium" : "body-medium"}
                    className={`_status ${
                      statCd === PROC_STAT_CD.SUPPLEMENT ? "_supplement" : ""
                    }`}
                  >
                    {statNm}
                  </Typography>
                </td>
                <td>
                    <span className="_table-button-wrapper">
                      <Button
                        shape="solid"
                        size="sm"
                        color="main60"
                        onClick={() => handleClick(rqstNo, statCd)}
                      >
                        등기자료
                      </Button>
                    </span>
                </td>
              </tr>
            );
          })}
          </tbody>
        </table>
      </div>

      {/* 등기자료 모달 - 보완필요 상태 */}
      {isModalOpen && (
        <Modal title="등기자료" onClose={closeModal}>
          <Grid>
            <GridItem desktop={5} tablet={12} mobile={12}>
              <ResponsiveSwiper
                isDesktop={isDesktop}
                requestNo={requestNo}
                attachFileCode={ATTC_FIL_CD.REGISTRATION_DATA}
              />
            </GridItem>
            <GridItem desktop={7} tablet={12} mobile={12}>
              <Detail
                isDesktop={isDesktop}
                requestNo={requestNo}
                onClose={handleCloseModal}
              />
            </GridItem>
          </Grid>
        </Modal>
      )}

      {/* 등기자료 모달 */}
      {isRegistrationDataModalOpen && (
        <Modal title="등기자료" onClose={closeRegistrationDataModal}>
          <Grid>
            <GridItem desktop={5} tablet={12} mobile={12}>
              <ResponsiveSwiper
                isDesktop={isDesktop}
                requestNo={requestNo}
                attachFileCode={ATTC_FIL_CD.REGISTRATION_DATA}
              />
            </GridItem>
            <GridItem desktop={7} tablet={12} mobile={12}>
              <RegistrationDataDetail
                isDesktop={isDesktop}
                requestNo={requestNo}
                onClose={handelCloseRegistrationDataModal}
              />
            </GridItem>
          </Grid>
        </Modal>
      )}
    </>
  );
}
