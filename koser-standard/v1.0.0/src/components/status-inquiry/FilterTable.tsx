"use client";

import { ChangeEvent, Dispatch, FormEvent, useEffect, useState } from "react";
import { PERIOD_OPTION } from "@constants/option";
import { PERIOD_LIST } from "@constants/period";
import { DatePicker, Typography } from "@components/common";
import { Form, InputField, Select } from "@components/form";
import { Button, ButtonGroup } from "@components/button";
import { filters } from "@components/status-inquiry/List";
import { useDatePicker } from "@hooks";
import { getDateString } from "@utils/dateUtil";
import { getStatusCdData } from "@services/statusInquiry";
import { useQuery } from "@tanstack/react-query";
import "@styles/filter-table.css";

type defineProps = {
  isDesktop?: boolean;
  setFilters: Dispatch<React.SetStateAction<filters>>;
  rqstNo?: string;
};

export default function FilterTable({
                                      isDesktop,
                                      setFilters,
                                      rqstNo,
                                    }: defineProps) {
  const { reset, ...datePickerProps } = useDatePicker();
  const [selectedButtonGroup, setSelectedButtonGroup] = useState<boolean[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [filters, setForm] = useState<filters>({
    rqstNo: rqstNo || "",
    statCd: "",
    acptNo: "",
    searchType: "EXEC",
    fromDate: "",
    toDate: "",
    dbtrNm: "",
    queryTime: null,
  });

  // 진행상태 데이터 api 호출
  const { data } = useQuery({
    queryKey: ["search-statistics"],
    queryFn: async () => await getStatusCdData(),
    select: (response) => response?.data?.commCodeList || [],
    enabled: true,
  });

  const transformStatusData = (data: { code: string; codeNm: string }[]) => {
    return (data || []).map((item) => ({
      value: item.code,
      label: item.codeNm,
    }));
  };

  const STATUS_OPTION = [
    { value: "", label: "전체" },
    ...transformStatusData(data),
  ];

  useEffect(() => {
    if (rqstNo) {
      setForm((prevForm) => ({
        ...prevForm,
        rqstNo: rqstNo,
      }));
    }
  }, [rqstNo]);

  /**
   * 버튼 그룹 내 index를 받아 선택 유무를 배열로 저장하고 index에 따라 다른 파라미터로 데이터 페칭하는 함수
   * @param {number} index
   */
  const handleButtonGroup = (index: number) => {
    // 모든 버튼을 false로 초기화한 후, 선택한 버튼만 true로 설정
    const updatedSelection = PERIOD_LIST.map((_, i) => i === index);
    setSelectedButtonGroup(updatedSelection);

    // 현재 날짜 기준으로 선택한 기간만큼 startDate를 조정
    const today = new Date();
    const newStartDate = new Date();
    newStartDate.setDate(today.getDate() - PERIOD_LIST[index].days);

    // 상태 업데이트
    setStartDate(newStartDate);
    setEndDate(today);

    const calStartDate = newStartDate ? getDateString(newStartDate) : "";
    const calEndDate = today ? getDateString(today) : "";

    let updatedFilters = { ...filters };
    updatedFilters = {
      ...filters, // 기존 필터 값을 유지
      fromDate: calStartDate, // fromDate 업데이트
      toDate: calEndDate, // toDate 업데이트
    };

    // setForm 업데이트
    setForm(updatedFilters);
    setFilters(updatedFilters); // 상위 컴포넌트로 전달
  };

  /* 초기화시 상위컴포넌트에도 초기값 전달 */
  const handleResetForm = () => {
    reset();
    setSelectedButtonGroup([]);
    setStartDate(null);
    setEndDate(null);
    const resetFilters = {
      rqstNo: "",
      statCd: "",
      acptNo: "",
      searchType: "",
      fromDate: "",
      toDate: "",
      dbtrNm: "",
      queryTime: new Date(),
    };
    setForm(resetFilters);
    setFilters(resetFilters);
  };

  // 조회타입 업데이트
  const handleChangeSearchType = (e: ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setForm((prev) => ({ ...prev, searchType: newValue }));
    setFilters(filters);
  };

  // 진행상태 업데이트
  const handleSelectedStatus = (e: ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setForm((prev) => ({ ...prev, statCd: newValue }));
    setFilters(filters);
  };

  const formMonitoring = (e: ChangeEvent<HTMLFormElement>) => {
    const { name, value } = e.target;

    let updatedFilters = { ...filters };

    // 날짜 선택 값 업데이트
    if (datePickerProps) {
      const newStartDate = datePickerProps?.startDate
        ? getDateString(datePickerProps?.startDate)
        : "";
      const newEndDate = datePickerProps?.endDate
        ? getDateString(datePickerProps?.endDate)
        : "";

      updatedFilters = {
        ...updatedFilters,
        rqstNo: updatedFilters.rqstNo,
        fromDate: newStartDate,
        toDate: newEndDate,
      };
    }
    // 버튼그룹 선택시 업데이트
    if (selectedButtonGroup) {
      const getTrueIndex = selectedButtonGroup.findIndex((val) => val === true);

      if (getTrueIndex !== -1) {
        const today = new Date();
        const newStartDate = new Date();
        newStartDate.setDate(today.getDate() - PERIOD_LIST[getTrueIndex].days);

        setStartDate(newStartDate);
        setEndDate(today);

        const calStartDate = getDateString(newStartDate);
        const calEndDate = getDateString(today);

        updatedFilters = {
          ...updatedFilters,
          fromDate: calStartDate,
          toDate: calEndDate,
        };
      }
    }

    // 최신 상태로 업데이트
    updatedFilters = {
      ...filters,
      [name]: value,
    };

    // 최종 상태 업데이트
    setForm((prevForm) => {
      const newForm = { ...prevForm, ...updatedFilters };
      return newForm;
    });

    console.log("updatedFilters", updatedFilters);
  };

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [startDate, endDate] = dates;
    setStartDate(startDate);
    setEndDate(endDate);

    const newStartDate = startDate ? getDateString(startDate) : "";
    const newEndDate = endDate ? getDateString(endDate) : "";
    // DatePicker 값도 필터에 추가
    let updatedFilters = { ...filters };

    // setForm 업데이트
    updatedFilters = {
      ...filters, // 기존 필터 값을 유지
      fromDate: newStartDate, // fromDate 업데이트
      toDate: newEndDate, // toDate 업데이트
    };

    setSelectedButtonGroup([]);
    setForm(updatedFilters);
    setFilters(updatedFilters);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setFilters({ ...filters, queryTime: new Date() }); // 상위 컴포넌트로 전달
  };

  return (
    <div className="_filter-table-wrapper">
      <Form
        onSubmit={handleSubmit}
        legendText="전자등기 현황조회 검색 필터 양식"
        isHiddenLegend={true}
        onInput={formMonitoring}
      >
        <div className="_responsive-table-inner-wrapper _no-thead border-none">
          <table className="_responsive-table _col-8-type">
            <caption className="_hidden-table-caption">
              전자등기 현황조회 필터 표
            </caption>
            <tbody>
            <tr>
              <th>
                <Typography
                  kind={isDesktop ? "title-small" : "body-medium"}
                  isBold={true}
                >
                  의뢰번호
                </Typography>
              </th>
              <td colSpan={2}>
                <div className="min-w-52">
                  <InputField
                    name="rqstNo"
                    defaultValue={filters.rqstNo}
                    required={false}
                    placeholder={"의뢰번호를 입력해 주세요"}
                    isError={false}
                    inputSize="sm"
                  />
                </div>
              </td>
              <td className="_hidden-in-mobile">&nbsp;</td>
              <th>
                <Typography
                  kind={isDesktop ? "title-small" : "body-medium"}
                  isBold={true}
                >
                  진행상태
                </Typography>
              </th>
              <td>
                <Select
                  id="statCd"
                  name="statCd"
                  selectSize="sm"
                  options={STATUS_OPTION}
                  value={filters.statCd}
                  onChange={handleSelectedStatus}
                  isError={false}
                />
              </td>
              <th className="_hidden-in-mobile">
                <Typography
                  kind={isDesktop ? "title-small" : "body-medium"}
                  isBold={true}
                >
                  접수번호
                </Typography>
              </th>
              <td className="_hidden-in-mobile">
                <InputField
                  name="acptNo"
                  defaultValue={filters.acptNo}
                  required={false}
                  placeholder={"접수번호를 입력해 주세요"}
                  isError={false}
                  inputSize="sm"
                />
              </td>
            </tr>
            <tr>
              <th>
                <Typography
                  kind={isDesktop ? "title-small" : "body-medium"}
                  isBold={true}
                  className="_hidden-in-desktop"
                >
                  조회기간
                </Typography>

                <Select
                  id="searchType"
                  name="searchType"
                  shape={isDesktop ? "none" : "default"}
                  selectSize={isDesktop ? "md" : "sm"}
                  options={PERIOD_OPTION}
                  value={filters.searchType}
                  onChange={handleChangeSearchType}
                  isError={false}
                />
              </th>
              <td colSpan={3}>
                  <span className="_datepicker-and-button-group-wrapper">
                    <DatePicker
                      id="execution-date"
                      {...datePickerProps}
                      isMultiComponent={true}
                      handleDatesPicker={handleDateChange}
                      startDate={startDate}
                      endDate={endDate}
                    />

                    <ButtonGroup
                      size="small"
                      data={PERIOD_LIST}
                      selectedButtonGroup={selectedButtonGroup}
                      handleButtonGroup={handleButtonGroup}
                    />
                  </span>
              </td>
              <th className="_hidden-in-mobile">
                <Typography
                  kind={isDesktop ? "title-small" : "body-medium"}
                  isBold={true}
                >
                  채무자
                </Typography>
              </th>
              <td className="_hidden-in-mobile">
                <InputField
                  type="text"
                  name="dbtrNm"
                  defaultValue={filters.dbtrNm}
                  required={false}
                  placeholder={"채무자를 입력해 주세요"}
                  isError={false}
                  inputSize="sm"
                />
              </td>
              <td colSpan={2} className="_hidden-in-mobile">
                &nbsp;
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <div className="_button-wrap">
          <Button shape="solid" size="md" color="main100" type="submit">
            검색
          </Button>
          <Button
            type="reset"
            shape="outline"
            size="md"
            color="grayscale"
            onClick={handleResetForm}
          >
            초기화
          </Button>
        </div>
      </Form>
    </div>
  );
}
