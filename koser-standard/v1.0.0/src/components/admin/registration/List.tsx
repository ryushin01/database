"use client";

import { Dispatch, useState, useEffect } from "react";
import { Loading, Pagination } from "@components/common";
import { Grid, GridItem } from "@components/layout";
import { Select } from "@components/form";
import { TabCountData } from "@components/admin/registration/Main";
import { NUMERIC_SORT_OPTION, PERIOD_SORT_OPTION } from "@constants/option";
import { PAGE_LIMIT_ADMIN, PAGE_COUNT_PC } from "@constants/page";
import { ResponsiveType } from "@types";
import { useQuery } from "@tanstack/react-query";
import { getRegistrationListData } from "@services/registrationManagement";
import { toastState } from "@stores";
import { useSetAtom } from "jotai";
import FilterTable from "./FilterTable";
import Table from "./Table";

type listDataProps = {
  tabSelection: string;
  setTabCount: Dispatch<React.SetStateAction<TabCountData>>;
};

export type filterData = {
  rqstNo: string;
  searchType: string;
  fromDate: string;
  toDate: string;
  searchTime: Date | null;
};

export default function List({
                               tabSelection,
                               setTabCount,
                               isDesktop,
                             }: listDataProps & ResponsiveType) {
  const openToast = useSetAtom(toastState);
  const [selectedPeriod, setSelectedPeriod] = useState(
    PERIOD_SORT_OPTION[0].value,
  );
  const [selectedNumeric, setSelectedNumeric] = useState(
    NUMERIC_SORT_OPTION[0].value,
  );
  const [filters, setFilters] = useState<filterData>({
    rqstNo: "",
    searchType: "EXEC", // 초기값 : 대출실행
    fromDate: "",
    toDate: "",
    searchTime: null,
  }); // 필터 상태 관리
  const [page, setPage] = useState(1);

  const { data: registrationListData, isLoading: registrationListLoading } =
    useQuery({
      queryKey: [
        "admin-registration-list",
        tabSelection,
        page,
        filters,
        selectedPeriod,
        selectedNumeric,
      ],
      queryFn: async () =>
        await getRegistrationListData({
          tabSelection: tabSelection,
          rqstNo: filters.rqstNo,
          searchType: filters.searchType,
          fromDate: filters.fromDate,
          toDate: filters.toDate,
          sortOrder: selectedPeriod,
          page: page,
          size: parseInt(selectedNumeric),
        }),
      select: (response) => {
        //등기의뢰번호 및 검색일자 조회 시 데이터 없을 경우 처리
        if (
          (!!filters.rqstNo || !!filters.fromDate || !!filters.toDate) &&
          response?.data?.data?.totalElements === 0
        ) {
          openToast({
            message: "일치하는 검색결과가 없습니다",
            position: isDesktop ? "top" : "bottom",
          });
        }

        return response?.data?.data;
      },
      enabled: !!page,
    });

  useEffect(() => {
    setPage(1);
  }, [tabSelection, filters.searchTime]);

  //헤더 의뢰번호 검색 후 처리
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRqstNo = sessionStorage.getItem("admin-rqstno");
      if (storedRqstNo) {
        setFilters({ ...filters, rqstNo: storedRqstNo });
      }
    }

    return () => {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("admin-rqstno");
      }
    };
  }, []);

  useEffect(() => {
    const rgstrStatistics = registrationListData?.rgstrStatistics;
    const tabCount: TabCountData = {
      total: rgstrStatistics?.total,
      rqst: rgstrStatistics?.rqst,
      mtchCmpt: rgstrStatistics?.mtchCmpt,
      loanExec: rgstrStatistics?.loanExec,
      rqstProg: rgstrStatistics?.rqstProg,
      rqstRtun: rgstrStatistics?.rqstRtun,
      rqstCmpt: rgstrStatistics?.rqstCmpt,
      progHold: rgstrStatistics?.progHold,
      progCncl: rgstrStatistics?.progCncl,
    };
    setTabCount(tabCount);
  }, [registrationListData]);

  return (
    <>
      {registrationListLoading && <Loading />}
      <FilterTable
        isDesktop={isDesktop}
        filters={filters}
        setFilters={setFilters}
      />
      <Grid className="_without-padding mt-6 mb-4 justify-end">
        <GridItem mobile={12} tablet={12} desktop={3}>
          <div className="flex gap-x-4">
            <Select
              id="sortOrder"
              name="sortOrder"
              selectSize="sm"
              options={PERIOD_SORT_OPTION}
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              isError={false}
            />
            <Select
              id="pageSize"
              name="pageSize"
              selectSize="sm"
              options={NUMERIC_SORT_OPTION}
              value={selectedNumeric}
              onChange={(e) => setSelectedNumeric(e.target.value)}
              isError={false}
            />
          </div>
        </GridItem>
      </Grid>
      <Table data={registrationListData} isDesktop={isDesktop} />
      <Pagination
        total={registrationListData?.totalElements}
        page={page}
        limit={PAGE_LIMIT_ADMIN}
        pageCount={PAGE_COUNT_PC}
        setPage={setPage}
      />
    </>
  );
}
