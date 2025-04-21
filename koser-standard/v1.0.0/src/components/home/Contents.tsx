"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { NarrowRightIcon } from "@icons20";
import { FI_NOTICE, FI_STATUS_INQUIRY } from "@constants/path";
import { Typography } from "@components/common";
import { Grid, GridItem } from "@components/layout";
import { Button } from "@components/button";
import RegistrationStratus from "./RegistrationStatus";
import Announcement from "./Announcement";
import EmptyBox from "./EmptyBox";

type contentsType = {
  isDesktop: boolean;
  getRegiListData: RegistrationListData;
  getNoticeListData: NoticeListData;
};

interface RegistrationListData {
  data: {
    rgstrMasterList: RegistrationData[];
  };
}

type RegistrationData = {
  rqstNo: string;
  dbtrNm: string;
  lgagMembNm: string;
  statCdNm: string;
  acptNo: string;
};

interface NoticeListData {
  data: {
    homeBoardListRes: NoticeData[];
  };
}

type NoticeData = {
  boardTitles: string;
  crtDtm: string;
  emcyYn: boolean;
};

export default function Contents({
                                   isDesktop,
                                   getRegiListData,
                                   getNoticeListData,
                                 }: contentsType) {
  const router = useRouter();

  const regiListData = getRegiListData.data.rgstrMasterList ?? [];
  const notiListData = getNoticeListData.data.homeBoardListRes ?? [];

  return (
    <Grid>
      <GridItem desktop={7} tablet={12} mobile={12}>
        <div
          className={`relative pt-8 w-full h-full ${isDesktop ? "" : "pb-8"}`}
        >
          <div className="m-2">
            <Typography
              kind={isDesktop ? "headline-small" : "title-large"}
              isBold={true}
            >
              실시간 등기현황
            </Typography>
          </div>

          {regiListData.length === 0 ? (
            <EmptyBox element="오늘 실행 건이 없습니다." />
          ) : (
            <RegistrationStratus data={regiListData} />
          )}

          <div className="absolute right-0 top-9">
            <Button
              shape="none"
              size="sm"
              color="grayscale"
              icon={
                <Image
                  src={NarrowRightIcon.src}
                  alt="더보기 화살표"
                  width={20}
                  height={20}
                />
              }
              iconPosition="right"
              onClick={() => router.push(FI_STATUS_INQUIRY)}
            >
              더보기
            </Button>
          </div>
        </div>
      </GridItem>
      <GridItem desktop={5} tablet={12} mobile={12}>
        <div
          className={`relative pt-8 w-full h-full ${isDesktop ? "" : "pb-20"}`}
        >
          <div className="m-2">
            <Typography
              kind={isDesktop ? "headline-small" : "title-large"}
              isBold={true}
            >
              공지사항
            </Typography>
          </div>
          {notiListData.length === 0 ? (
            <EmptyBox element="공지사항이 없습니다." />
          ) : (
            <Announcement data={notiListData} />
          )}

          <div className="absolute right-0 top-9">
            <Button
              shape="none"
              size="sm"
              color="grayscale"
              icon={
                <Image
                  src={NarrowRightIcon.src}
                  alt="더보기 화살표"
                  width={20}
                  height={20}
                />
              }
              iconPosition="right"
              onClick={() => router.push(FI_NOTICE)}
            >
              더보기
            </Button>
          </div>
        </div>
      </GridItem>
    </Grid>
  );
}
