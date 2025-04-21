"use client";

import { FormEvent, useEffect, useState, useRef } from "react";
import Image from "next/image";
import { PlusIcon } from "@icons14";
import { CancelIcon } from "@icons18";
import { PROC_STAT_CD, JUDT_COURT_CD, REGR_CD } from "@constants/code";
import {
  FILE_MAXIMUM_NUMBER,
  FILE_MAXIMUM_SIZE,
  FILE_MAXIMUM_SIZE_STRING,
} from "@constants/file";
import { Loading, Typography } from "@components/common";
import { Form, InputField, Label, Select, TextArea } from "@components/form";
import { Button } from "@components/button";
import { ResponsiveType } from "@types";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getRegistrationInformationData,
  postRegistrationAccept,
} from "@services/registrationManagement";
import { getCommonCodeList } from "@services/common";
import { toastState } from "@stores";
import { useSetAtom } from "jotai";
import { getCodeList } from "@utils/codeUtil";
import { checkFileSize } from "@utils/fileUtil";
import "@styles/responsive-table.css";

type RegistrationInformationlProps = {
  requestNo: string;
  onClose: () => void;
};

type CodeList = {
  value: string;
  label: string;
};

type FileData = {
  uid?: string;
  seq?: string;
  filIdx?: number;
  attcFilNm?: string;
  filSize?: number;
  src?: string;
  file?: File;
};

type updateFileData = {
  seq?: string;
  filIdx?: number;
  attcFilNm?: string;
  filSize?: number;
  src?: string;
};

export default function RegistrationInformation({
                                                  requestNo,
                                                  onClose,
                                                  isDesktop,
                                                }: RegistrationInformationlProps & ResponsiveType) {
  const openToast = useSetAtom(toastState);
  const [isError, setIsError] = useState(false);
  const [fileList, setFileList] = useState<FileData[]>([]);
  const [requestData, setRequestData] = useState<FormData>(new FormData());
  const [selectJudtCourt, setSelectJudtCourt] = useState("");
  const [selectRegistryOffice, setSelectRegistryOffice] = useState("");
  const [acceptNo, setAcceptNo] = useState("");
  const [judtCourtCodeList, setJudtCourtCodeList] = useState<CodeList[]>([]);
  const [registryOfficeCodeList, setRegistryOfficeCodeList] = useState<
    CodeList[]
  >([]);
  const [mngrDlvrCnts, setMngrDlvrCnts] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* 등기자료 정보 조회 */
  const { data: data } = useQuery({
    queryKey: ["admin-registration-data", requestNo],
    queryFn: async () => await getRegistrationInformationData(requestNo),
    select: (response) => response.data?.data,
    enabled: !!requestNo,
  });

  /* 관할법원 코드 조회 */
  const { data: judtCourtCodeData } = useQuery({
    queryKey: ["judtCourt-code-list"],
    queryFn: async () => await getCommonCodeList(JUDT_COURT_CD),
    select: (response) => response.data?.data?.commCodeList,
    enabled: true,
  });

  /* 등기소 코드 조회 */
  const { data: registryOfficeCodeData } = useQuery({
    queryKey: ["registryOffice-code-list"],
    queryFn: async () => await getCommonCodeList(REGR_CD),
    select: (response) => response.data?.data?.commCodeList,
    enabled: true,
  });

  /* 등기접수 정보 등록 */
  const {
    mutate: mutatePostRegistrationAccept,
    isPending: postRegistrationAcceptLoading,
  } = useMutation({
    mutationKey: ["request-upload"],
    mutationFn: async () => await postRegistrationAccept(requestData),
    onSuccess: (response) => {
      if (response.data.code === "00") {
        handleSuccess();
      }
    },
    onError: (error) => {
      console.log(`${error}`);
      setIsButtonDisabled(false);
    },
  });

  /* 관할법원 코드리스트 세팅 */
  useEffect(() => {
    if (!!judtCourtCodeData) {
      setJudtCourtCodeList(getCodeList(judtCourtCodeData));
    }
  }, [judtCourtCodeData]);

  /* 등기소 코드리스트 세팅 */
  useEffect(() => {
    if (!!registryOfficeCodeData) {
      setRegistryOfficeCodeList(getCodeList(registryOfficeCodeData));
    }

    if (!!selectJudtCourt) {
      const newCodeList = getCodeList(registryOfficeCodeData).filter((item) =>
        item.value.startsWith(selectJudtCourt),
      );

      setRegistryOfficeCodeList(newCodeList);
    }
  }, [registryOfficeCodeData]);

  /* 관할법원 변경시 등기소 코드리스트 변경 */
  const handleJudtCourtChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectJudtCourt(value);

    const newCodeList = getCodeList(registryOfficeCodeData).filter((item) =>
      item.value.startsWith(value),
    );

    setRegistryOfficeCodeList(newCodeList);
  };

  /* 파일선택 버튼 클릭 시 파일 선택 창 열기 */
  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  /* 파일 선택 */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFileList = Array.from(e.target.files);
      newFileList?.map((newFile: File) => {
        if (checkFileSize(newFile)) {
          const fileData: FileData = {
            uid: `${Date.now()}_${newFile.name}`,
            attcFilNm: newFile.name,
            filSize: newFile.size,
            src: "",
            file: newFile,
          };

          setFileList((prev) => [...prev, fileData]);
        } else {
          openToast({
            message: `${newFile.name} 파일이 최대 업로드 용량(20MB)를 초과 하였습니다.`,
            position: "top",
          });
        }
      });
    }
  };

  /* 파일 삭제 */
  const handleFileRemove = (uid: string) => {
    setFileList((prevFileList) =>
      prevFileList.filter((item) => item.uid !== uid),
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (fileList.length === 0) {
      openToast({
        message: "등기접수증을 업로드해 주세요.",
        position: "top",
      });
      return;
    }

    const formData = new FormData();
    const updateFileList: updateFileData[] = [];
    let totalSize = 0;
    fileList.forEach((file: FileData) => {
      totalSize += file.filSize || 0;

      if (file.file === undefined) {
        //기 등록한 업로드 파일
        updateFileList.push({
          seq: file.seq!,
          filIdx: file.filIdx!,
          attcFilNm: file.attcFilNm,
          filSize: file.filSize,
          src: file.src!,
        });
      } else {
        //신규 업로드 한 파일
        formData.append("multipartFiles", file.file);
      }
    });

    //최대 파일 갯수와 용량 모두 초과 시
    if (
      fileList.length > FILE_MAXIMUM_NUMBER &&
      totalSize > FILE_MAXIMUM_SIZE
    ) {
      openToast({
        message: `최대 ${FILE_MAXIMUM_NUMBER}개, 전체용량 ${FILE_MAXIMUM_SIZE_STRING}까지 업로드할 수 있습니다.\n개수 또는 용량을 조정해 주세요.`,
        position: "top",
      });
      return;
    }

    //최대 파일 갯수 초과 시
    if (fileList.length > FILE_MAXIMUM_NUMBER) {
      openToast({
        message: `최대 ${FILE_MAXIMUM_NUMBER}개까지 업로드할 수 있습니다.\n개수를 조정해 주세요.`,
        position: "top",
      });
      return;
    }

    //최대 업로드 용량 초과 시
    if (totalSize > FILE_MAXIMUM_SIZE) {
      openToast({
        message: `업로드 가능한 전체 용량은 최대 ${FILE_MAXIMUM_SIZE_STRING}입니다.\n용량을 조정해 주세요.`,
        position: "top",
      });
      return;
    }

    //관할법원 미입력 시
    if (!selectJudtCourt || !selectRegistryOffice || !acceptNo) {
      setIsError(true);
      openToast({
        message: "접수 정보를 전부 입력해 주세요.",
        position: "top",
      });

      return;
    } else {
      setIsError(false);
    }

    const requestData = {
      rqstNo: requestNo,
      judtCourtCd: selectJudtCourt,
      regrCd: selectRegistryOffice,
      acptNo: acceptNo,
      rgstrAcptYn: "N",
      imageInfo: updateFileList,
      mngrDlvrCnts: mngrDlvrCnts || "",
    };

    formData.append("reqVo", JSON.stringify(requestData));
    setRequestData(formData);

    setIsButtonDisabled(true);
    mutatePostRegistrationAccept();
  };

  /* 등기의뢰 등록 또는 수정 후 성공 처리 */
  const handleSuccess = () => {
    openToast({
      message: "등기접수 정보가 등록되었습니다.",
      position: "top",
      afterFunc: onClose,
    });
  };

  //기 등록한 파일 정보 조회 시 fileList에 추가
  useEffect(() => {
    setSelectJudtCourt(data?.judtCourtCd);
    setSelectRegistryOffice(data?.regrCd);
    setAcceptNo(data?.acptNo);
    setMngrDlvrCnts(data?.mngrDlvrCnts);

    setFileList([]);
    data?.fileList?.map((file: FileData) => {
      const fileData: FileData = {
        uid: `${file.seq}_${file.filIdx}`,
        seq: file.seq,
        filIdx: file.filIdx,
        attcFilNm: file.attcFilNm,
        filSize: file.filSize,
        src: file.src,
        file: undefined,
      };
      setFileList((prev) => [...prev, fileData]);
    });
  }, [data]);

  //첨부파일 추가 시 개수 및 용량 체크
  useEffect(() => {
    //최대 파일 갯수 초과 시
    if (fileList.length > FILE_MAXIMUM_NUMBER) {
      openToast({
        message: `최대 ${FILE_MAXIMUM_NUMBER}개까지 업로드할 수 있습니다.`,
        position: "top",
      });
    }

    const totalSize = fileList.reduce(
      (acc, file) => acc + (file?.filSize || 0),
      0,
    );

    if (totalSize > FILE_MAXIMUM_SIZE) {
      openToast({
        message: `업로드 가능한 전체 용량은 최대 ${FILE_MAXIMUM_SIZE_STRING}입니다.`,
        position: "top",
      });
    }
  }, [fileList]);

  return (
    <>
      {postRegistrationAcceptLoading && <Loading />}
      <Form
        onSubmit={handleSubmit}
        legendText="등기접수 정보 등록 양식"
        isHiddenLegend={true}
        className="_registration-information-form"
      >
        {/* 반려사유 */}
        {/* NOTE: 진행상태가 '접수반려'인 경우에만 해당 영역 노출 */}
        {data?.statCd === PROC_STAT_CD.RETURN && (
          <div>
            <Typography
              kind="title-medium"
              isBold={true}
              className="text-koser-secondary-red-50"
            >
              반려사유
            </Typography>
            <Typography kind="body-large" as="p">
              {data?.procRsnCnts}
            </Typography>
          </div>
        )}

        {/* 기본정보 */}
        <div className="w-[60%]">
          <section className="_section">
            <Typography
              as="h2"
              kind={isDesktop ? "title-medium" : "body-large"}
              isBold={true}
              className="_title"
            >
              기본정보
            </Typography>
            <div className="_responsive-table-inner-wrapper _no-thead">
              <table className="_responsive-table">
                <caption className="_hidden-table-caption">기본정보 표</caption>
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
                  <td>
                    <Typography
                      kind={isDesktop ? "body-large" : "body-small"}
                    >
                      {requestNo}
                    </Typography>
                  </td>
                  <th>
                    <Typography
                      kind={isDesktop ? "body-large" : "body-small"}
                      isBold={true}
                    >
                      채무자
                    </Typography>
                  </th>
                  <td>
                    <Typography
                      kind={isDesktop ? "body-large" : "body-small"}
                    >
                      {data?.dbtrNm}
                    </Typography>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* 등기접수증 */}
        <div>
          <Label
            htmlFor="registration-receipt"
            required={true}
            labelText="등기접수증"
            labelSize="md"
          />
          <div className="w-[102px]">
            <Button
              id="registration-receipt"
              shape="solid"
              size="sm"
              color="main60"
              icon={
                <Image
                  src={PlusIcon}
                  alt="더하기 아이콘"
                  width={14}
                  height={14}
                />
              }
              iconPosition="right"
              onClick={handleFileButtonClick}
            >
              파일 선택
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              id="fileInput"
              multiple={true}
              accept=".jpg, .jpeg, .png"
              className="_hidden"
              onChange={handleFileChange}
            />
          </div>

          {fileList.length > 0 && (
            <ul className="flex flex-wrap gap-x-3 mt-3">
              {fileList?.map((file) => {
                return (
                  <li key={file.uid} className="_flex-center gap-x-[6px]">
                    <button
                      type="button"
                      onClick={() => handleFileRemove(`${file.uid}`)}
                    >
                      <Image
                        src={CancelIcon}
                        alt="개별 삭제 아이콘"
                        width={18}
                        height={18}
                      />
                    </button>
                    <Typography kind="title-small">
                      {file.attcFilNm}{" "}
                    </Typography>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* 접수정보 */}
        <div>
          <section className="_section">
            <Label
              htmlFor="court"
              required={true}
              labelText="접수정보"
              labelSize="md"
            />

            <div className="_responsive-table-inner-wrapper _no-thead">
              <table className="_responsive-table">
                <caption className="_hidden-table-caption">접수정보 표</caption>
                <tbody>
                <tr>
                  <th>
                    <Typography
                      kind={isDesktop ? "body-large" : "body-small"}
                      isBold={true}
                    >
                      관할법원
                    </Typography>
                  </th>
                  <td colSpan={2}>
                    <Select
                      id="court"
                      name="court"
                      selectSize="sm"
                      placeholder="법원을 선택해 주세요"
                      options={judtCourtCodeList}
                      value={selectJudtCourt}
                      onChange={handleJudtCourtChange}
                      isError={isError && !selectJudtCourt}
                      required={true}
                    />
                  </td>
                  <td colSpan={3}></td>
                </tr>
                <tr>
                  <th>
                    <Typography
                      kind={isDesktop ? "body-large" : "body-small"}
                      isBold={true}
                    >
                      등기소
                    </Typography>
                  </th>
                  <td colSpan={2}>
                    <Select
                      id="registry-office"
                      name="registry-office"
                      selectSize="sm"
                      placeholder="법원을 선택한 후 등기소를 선택해 주세요"
                      options={registryOfficeCodeList}
                      value={selectRegistryOffice}
                      onChange={(e) =>
                        setSelectRegistryOffice(e.target.value)
                      }
                      isError={isError && !selectRegistryOffice}
                      required={true}
                    />
                  </td>
                  <td colSpan={3}></td>
                </tr>
                <tr>
                  <th>
                    <Typography
                      kind={isDesktop ? "body-large" : "body-small"}
                      isBold={true}
                    >
                      접수번호
                    </Typography>
                  </th>
                  <td colSpan={2}>
                    <InputField
                      type="text"
                      name="acptNo"
                      defaultValue={acceptNo || ""}
                      //required={true}
                      placeholder={"접수번호를 입력해 주세요"}
                      isError={isError && !acceptNo}
                      inputSize="sm"
                      onChange={(e) => setAcceptNo(e.target.value)}
                    />
                  </td>
                  <td colSpan={3}></td>
                </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* 전달사항 */}
        <div>
          <Label htmlFor="messages" labelText="전달사항" labelSize="md" />
          <TextArea
            id="messages"
            name="mngrDlvrCnts"
            isError={false}
            placeholder="시스템 관리자에게 전달사항이 있는 경우 작성해 주세요"
            maxLength={100}
            defaultValue={mngrDlvrCnts}
            onChange={(e) => {
              setMngrDlvrCnts(e.target.value);
            }}
            onBlur={(e) => {
              setMngrDlvrCnts(e.target.value);
            }}
          />
        </div>

        {/* CTA */}
        <div className="_flex-center mt-[62px] [&>button]:w-[27%]">
          <Button
            type="submit"
            shape="solid"
            size="lg"
            color="main100"
            disabled={isButtonDisabled}
          >
            등록하기
          </Button>
        </div>
      </Form>
    </>
  );
}
