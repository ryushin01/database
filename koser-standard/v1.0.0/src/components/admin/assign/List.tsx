"use client";

import { useEffect, useState } from "react";
import { Loading, Pagination } from "@components/common";
import { Grid, GridItem } from "@components/layout";
import { NUMERIC_SORT_OPTION, PERIOD_SORT_OPTION } from "@constants/option";
import { Select } from "@components/form";
import NotAllottedTable from "./NotAllottedTable";
import { useQuery } from "@tanstack/react-query";
import { getSupplimentListData } from "@services/adminAssign";
import { useResponsive } from "@hooks";
import { toastState } from "@stores";
import { useSetAtom } from "jotai";
import Table from "./Table";

interface ListProps {
  tabIndex: string;
  searchRqstNo: string;
  unMatchData: (data: number) => void;
}

export default function List({
                               tabIndex,
                               searchRqstNo,
                               unMatchData,
                             }: ListProps) {
  const { isDesktop } = useResponsive();
  const openToast = useSetAtom(toastState);
  const [selectedPeriod, setSelectedPeriod] = useState(
    PERIOD_SORT_OPTION[0].value,
  );
  const [selectedNumeric, setSelectedNumeric] = useState(
    NUMERIC_SORT_OPTION[0].value,
  );

  const [unMatchCount, setUnMatchCount] = useState<number>();
  const [page, setPage] = useState<number>(1);
  const [data, setData] = useState([]); // 테이블 데이터
  const [total, setTotal] = useState<number>(0); // 전체 데이터 개수

  /* 1. 탭인덱스가 바뀌면 페이지는 무조건 1로 세팅 */
  useEffect(() => {
    setPage(1);
  }, [tabIndex, searchRqstNo]);

  /* 2. 트리거중에 하나가 변경될 때 마다 refetch */
  useEffect(() => {
    refetch();
  }, [page, selectedNumeric, tabIndex, searchRqstNo, selectedPeriod]);

  /* 3. 배정관리 목록 조회 api */
  const {
    data: spplListData,
    refetch,
    isLoading: spplListDataLoading,
  } = useQuery({
    queryKey: [
      "search-supplementlist",
      page,
      tabIndex,
      searchRqstNo,
      selectedPeriod,
      selectedNumeric,
    ],
    queryFn: async () =>
      await getSupplimentListData({
        pageNum: page,
        pageSize: Number(selectedNumeric),
        searchRqstNo,
        tabSelection: tabIndex,
        sortOrder: selectedPeriod,
      }),

    select: (response) => response.data,
    enabled: true,
  });

  /* 4. api 조회 완료시 데이터 셋 */
  useEffect(() => {
    if (spplListData) {
      if (!!searchRqstNo && spplListData.totalElements === 0) {
        openToast({
          message: "일치하는 검색결과가 없습니다",
          position: isDesktop ? "top" : "bottom",
        });
      }
      setData(spplListData?.mtchList || []); // data set
      setTotal(spplListData?.totalElements || 0); //total set
      setUnMatchCount(spplListData?.unMtchCnt || 0); //unmatch set
    }
  }, [spplListData]);

  /* 5. 미배정건 데이터 상위 Main으로 전달 */
  useEffect(() => {
    if (unMatchCount) {
      pushUnmatchData(unMatchCount);
    }
  }, [unMatchCount]);

  const pushUnmatchData = (unMatchCount: number) => {
    unMatchData(unMatchCount);
  };

  return (
    <>
      {spplListDataLoading && <Loading />}
      <Grid className="_without-padding mt-6 mb-4 justify-end">
        <GridItem mobile={12} tablet={12} desktop={3}>
          <div className="flex gap-x-4">
            <Select
              id="select1"
              name="select1"
              selectSize="sm"
              options={PERIOD_SORT_OPTION}
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              isError={false}
            />
            <Select
              id="select2"
              name="select2"
              selectSize="sm"
              options={NUMERIC_SORT_OPTION}
              value={selectedNumeric}
              onChange={(e) => setSelectedNumeric(e.target.value)}
              isError={false}
            />
          </div>
        </GridItem>
      </Grid>

      {tabIndex === "00" ? (
        /* 미배정 테이블 */
        <NotAllottedTable isDesktop={isDesktop} data={data} />
      ) : (
        /* 배정완료 / 진행보류 / 진행취소 테이블 */
        <Table isDesktop={isDesktop} data={data} />
      )}

      <Pagination
        total={total}
        page={page}
        limit={Number(selectedNumeric)}
        pageCount={10}
        setPage={setPage}
      />
    </>
  );
}
