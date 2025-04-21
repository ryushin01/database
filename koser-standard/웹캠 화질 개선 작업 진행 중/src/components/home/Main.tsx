"use client";

import { useEffect } from "react";
import { Loading } from "@components/common";
import { useResponsive } from "@hooks";
import { useAtomValue } from "jotai";
import { authAtom } from "@/stores";
import { useQuery } from "@tanstack/react-query";
import {
  getStatisticsData,
  getRegistrationListData,
  getHomeNoticeListData,
} from "@services/home";
import Banner from "./Banner";
import Contents from "./Contents";
import "@styles/home.css";

interface StatisticsData {
  data: {
    cntExec: number;
    cntProg: number;
    cntComplete: number;
  };
}

type RegistrationListData = {
  data: RegistrationitemsData;
};
type RegistrationitemsData = {
  rgstrMasterList: RegistrationData[];
};

type RegistrationData = {
  rqstNo: string;
  dbtrNm: string;
  lgagMembNm: string;
  statCdNm: string;
  acptNo: string;
};

type NoticeListData = {
  data: NoticeitemsData;
};

type NoticeitemsData = {
  homeBoardListRes: NoticeData[];
};

type NoticeData = {
  boardTitles: string;
  crtDtm: string;
  emcyYn: boolean;
};

export default function Main() {
  const authInfo = useAtomValue(authAtom);
  const { isDesktop } = useResponsive();
  const { data, refetch } = useQuery<StatisticsData>({
    queryKey: ["search-statistics"],
    queryFn: async () => await getStatisticsData(),
    select: (response) => response,
    enabled: true,
  });

  const {
    data: getRegiListData,
    refetch: refetchRegiListData,
    isLoading: regiListDataLoading,
  } = useQuery<RegistrationListData>({
    queryKey: ["search-regiList"],
    queryFn: async () => await getRegistrationListData(),
    select: (response) => response,
    enabled: true,
  });

  const { data: getNotiListData, refetch: refetchNotiListData } =
    useQuery<NoticeListData>({
      queryKey: ["search-notiList"],
      queryFn: async () => await getHomeNoticeListData(),
      select: (response) => response,
      enabled: true,
    });

  useEffect(() => {
    refetch();
    refetchRegiListData();
    refetchNotiListData();
  }, [data, getRegiListData, getNotiListData]);

  const regiLilstData: RegistrationListData = getRegiListData
    ? { data: getRegiListData.data }
    : { data: { rgstrMasterList: [] } };

  const notiLilstData: NoticeListData = getNotiListData
    ? { data: getNotiListData.data }
    : { data: { homeBoardListRes: [] } };

  return (
    <div className="_main">
      {regiListDataLoading && <Loading />}
      <div className="_banner-section">
        <Banner
          name={`${authInfo.membNm}`}
          totalcount={data?.data?.cntExec ?? 0}
          inprogress={data?.data?.cntProg ?? 0}
          application={data?.data?.cntComplete ?? 0}
        />
      </div>

      <div className="_contents-section">
        <Contents
          isDesktop={isDesktop}
          getRegiListData={regiLilstData ?? []}
          getNoticeListData={notiLilstData ?? []}
        />
      </div>
    </div>
  );
}
