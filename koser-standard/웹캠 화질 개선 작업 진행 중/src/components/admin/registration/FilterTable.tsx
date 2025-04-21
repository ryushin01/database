"use client";

import { ChangeEvent, Dispatch, FormEvent, useState } from "react";
import { PERIOD_LIST } from "@constants/period";
import { PERIOD_EXPANDED_OPTION } from "@constants/option";
import { DatePicker, Typography } from "@components/common";
import { Form, InputField, Select } from "@components/form";
import { Button, ButtonGroup } from "@components/button";
import { filterData } from "@components/admin/registration/List";
import { useDatePicker } from "@hooks";
import { getDateString } from "@utils/dateUtil";
import { ResponsiveType } from "@types";
import "@styles/filter-table.css";

type filterProps = {
  filters: filterData;
  setFilters: Dispatch<React.SetStateAction<filterData>>;
};

export default function FilterTable({
  filters,
  setFilters,
  isMobile,
}: filterProps & ResponsiveType) {
  const { reset, ...datePickerProps } = useDatePicker();
  const [selectedPeriodExpanded, setSelectedPeriodExpanded] = useState(
    PERIOD_EXPANDED_OPTION[0].value,
  );
  const [selectedButtonGroup, setSelectedButtonGroup] = useState<boolean[]>([
    false,
    false,
    false,
  ]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [requestNo, setRequestNo] = useState("");

  /**
   * 버튼 그룹 내 index를 받아 선택 유무를 배열로 저장하고 index에 따라 다른 파라미터로 데이터 페칭하는 함수
   * @param {number} index
   */
  const handleButtonGroup = async (index: number) => {
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

    setFilters({ ...filters, fromDate: calStartDate, toDate: calEndDate });
  };

  const handleResetForm = () => {
    // DatePicker 리셋
    reset();
    setStartDate(null);
    setEndDate(null);

    // ButtonGroup 리셋
    setSelectedButtonGroup([]);
    setRequestNo("");
    sessionStorage?.removeItem("admin-rqstno");
    setFilters({ ...filters, rqstNo: "", fromDate: "", toDate: "" });
  };

  const formMonitoring = (e: ChangeEvent<HTMLFormElement>) => {
    const { name, value } = e.target;

    if (name === "rqstNo") {
      setRequestNo(value);
    }

    if (name === "searchType") {
      setFilters({
        ...filters,
        searchType: value,
      });
    }

    // DatePicker 값 처리
    if (
      datePickerProps &&
      !!datePickerProps?.startDate &&
      !!datePickerProps?.endDate
    ) {
      const newStartDate = datePickerProps?.startDate
        ? getDateString(datePickerProps?.startDate)
        : "";
      const newEndDate = datePickerProps?.endDate
        ? getDateString(datePickerProps?.endDate)
        : "";

      const updatedFilters = {
        ...filters, // 기존 필터 값을 유지
        fromDate: newStartDate, // fromDate 업데이트
        toDate: newEndDate, // toDate 업데이트
      };

      setFilters(updatedFilters);
    }
  };

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [startDate, endDate] = dates;
    setStartDate(startDate);
    setEndDate(endDate);

    const newStartDate = startDate ? getDateString(startDate) : "";
    const newEndDate = endDate ? getDateString(endDate) : "";
    // DatePicker 값도 필터에 추가
    let updatedFilters = { ...filters };
    updatedFilters = {
      ...filters, // 기존 필터 값을 유지
      fromDate: newStartDate, // fromDate 업데이트
      toDate: newEndDate, // toDate 업데이트
    };

    setSelectedButtonGroup([false, false, false]);
    // setForm 업데이트
    setFilters(updatedFilters);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFilters({
      ...filters,
      fromDate: getDateString(startDate),
      toDate: getDateString(endDate),
      rqstNo: requestNo,
      searchTime: new Date(),
    });
  };

  return (
    <div className="_filter-table-wrapper mt-6">
      <Form
        onSubmit={handleSubmit}
        legendText="전자등기 현황조회 검색 필터 양식"
        isHiddenLegend={true}
        onInput={formMonitoring}
      >
        <div className="_responsive-table-inner-wrapper _no-thead border-none">
          <table className="_responsive-table _col-8-type">
            <caption className="_hidden-table-caption">
              등기관리 필터 표
            </caption>
            <tbody>
              <tr>
                <th>
                  <Typography
                    kind={isMobile ? "body-medium" : "title-small"}
                    isBold={true}
                  >
                    의뢰번호
                  </Typography>
                </th>
                <td colSpan={2}>
                  <div className="min-w-52">
                    <InputField
                      name="rqstNo"
                      defaultValue={!!requestNo ? requestNo : filters.rqstNo}
                      required={false}
                      placeholder={"의뢰번호를 입력해 주세요"}
                      isError={false}
                      inputSize="sm"
                    />
                  </div>
                </td>
                <td colSpan={5}></td>
              </tr>
              <tr>
                <th>
                  <Select
                    id="searchType"
                    name="searchType"
                    shape={isMobile ? "default" : "none"}
                    selectSize="md"
                    options={PERIOD_EXPANDED_OPTION}
                    value={filters.searchType || selectedPeriodExpanded}
                    onChange={(e) => setSelectedPeriodExpanded(e.target.value)}
                    isError={false}
                    className={isMobile ? "body-medium" : "title-small"}
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
                <td colSpan={4}></td>
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
