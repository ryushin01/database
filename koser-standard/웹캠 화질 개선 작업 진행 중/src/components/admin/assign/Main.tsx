"use client";

import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AD_ASSIGN_CREATE } from "@constants/path";
import { Badge, TabGroup, Typography } from "@components/common";
import { Grid, GridItem } from "@components/layout";
import { Form, InputField } from "@components/form";
import { REQUEST_NUMBER_INPUT } from "@constants/input";
import { Button } from "@components/button";
import List from "./List";

export default function Main() {
  const router = useRouter();
  const [tabCode, setTabCode] = useState("00");
  const [searchRqstNo, setsearchRqstNo] = useState("");
  const [submittedRqstNo, setSubmittedRqstNo] = useState("");
  const [unMatchCount, setUnMatchCount] = useState<number>();

  /* List 컴포넌트에서 미배정건 데이터 받기 */
  const onChangeMatchData = (newData: number) => {
    setUnMatchCount(newData);
  };

  const TAB_LIST = [
    {
      label: "미배정",
      content: (
        <List
          tabIndex={tabCode}
          searchRqstNo={submittedRqstNo}
          unMatchData={onChangeMatchData}
        />
      ),
    },
    {
      label: "배정완료",
      content: (
        <List
          tabIndex={tabCode}
          searchRqstNo={submittedRqstNo}
          unMatchData={onChangeMatchData}
        />
      ),
    },
    {
      label: "진행보류",
      content: (
        <List
          tabIndex={tabCode}
          searchRqstNo={submittedRqstNo}
          unMatchData={onChangeMatchData}
        />
      ),
    },
    {
      label: "진행취소",
      content: (
        <List
          tabIndex={tabCode}
          searchRqstNo={submittedRqstNo}
          unMatchData={onChangeMatchData}
        />
      ),
    },
  ];

  /* tab 인덱스 바뀌면 value tabCode에 셋팅 */
  const handleTabChange = (index: number) => {
    let tabIndex;
    switch (index) {
      case 0:
        tabIndex = "00"; // 미배정
        break;
      case 1:
        tabIndex = "01"; // 배정완료
        break;
      case 2:
        tabIndex = "02"; // 진행보류
        break;
      case 3:
        tabIndex = "03"; // 진행취소
        break;
      default:
        tabIndex = "00"; // 미배정
        break;
    }
    setTabCode(tabIndex);
  };

  /* 의뢰번호 입력시 searchRqstNo 값 셋팅 */
  const handleFormChange = (event: ChangeEvent<HTMLFormElement>) => {
    setsearchRqstNo(event.target.value);
  };

  /* 검색버튼 클릭시 searchRqstNo값 submittedRqstNo값에 셋팅 */
  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // 페이지 새로고침 방지
    setSubmittedRqstNo(searchRqstNo);
  };

  const handleReset = () => {
    setsearchRqstNo("");
    window.location.reload();
  };

  return (
    <section className="pb-5">
      <div className="flex items-center gap-x-[10px]">
        <Typography
          as="h2"
          kind="headline-medium"
          isBold={true}
          className="py-6"
        >
          배정관리
        </Typography>

        <Badge type="text" colorType="default">
          미배정 {unMatchCount}건
        </Badge>
      </div>

      <div className="mb-3 [&>div>div]:p-0">
        <Grid className="justify-between">
          <GridItem mobile={12} tablet={12} desktop={5}>
            <Form
              onSubmit={handleSearchSubmit}
              onChange={handleFormChange}
              legendText="의뢰번호 검색"
              isHiddenLegend={true}
              className="[&>fieldset]:flex [&>fieldset]:gap-x-3 [&>fieldset>div]:mr-1"
            >
              <div className="flex-1">
                <InputField
                  name="searchRqstNo"
                  defaultValue={searchRqstNo}
                  type="number"
                  inputSize="md"
                  // required={true}
                  placeholder={REQUEST_NUMBER_INPUT.placeHolder}
                  isError={false}
                  // disabled={true}
                />
              </div>
              <div className="w-[136px]">
                <Button
                  shape="solid"
                  type="submit"
                  size="md"
                  color="main100"
                  // onClick={() => console.log("검색")}
                >
                  검색
                </Button>
              </div>
              <div className="w-[136px]">
                <Button
                  type="reset"
                  shape="outline"
                  size="md"
                  color="grayscale"
                  onClick={handleReset}
                >
                  초기화
                </Button>
              </div>
            </Form>
          </GridItem>

          <GridItem mobile={12} tablet={12} desktop={2}>
            <Button
              shape="solid"
              size="md"
              color="main100"
              onClick={() => router.push(AD_ASSIGN_CREATE)}
            >
              전자등기 신규등록
            </Button>
          </GridItem>
        </Grid>
      </div>

      <TabGroup items={TAB_LIST} defaultTab={0} onTabChange={handleTabChange} />
    </section>
  );
}
