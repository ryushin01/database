"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PlusWhiteIcon } from "@icons20";
import { FI_REQUEST_LIST } from "@constants/path";
import {
  FILE_MAXIMUM_NUMBER,
  FILE_MAXIMUM_SIZE,
  FILE_MAXIMUM_SIZE_STRING,
} from "@constants/file";
import { DatePicker, Loading, Typography } from "@components/common";
import { Form, Label } from "@components/form";
import { Button } from "@components/button";
import { useDatePicker } from "@hooks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { checkUploadFileSize } from "@utils/fileUtil";
import { getDateString, getTodayAddDays, stringToDate } from "@utils/dateUtil";
import { toastState } from "@stores";
import { postRequestData, patchRequestData } from "@services/request";
import { getRegistrationImages } from "@/services/file";
import { useSetAtom } from "jotai";
import type { UploadProps } from "antd";
import { Upload } from "antd";
import FileIndicator from "./FileIndicator";
import DesktopFileList from "./DesktopFileList";
import "@styles/file-uploader.css";
import { UploadChangeParam } from "antd/es/upload";
import { ATTC_FIL_CD } from "@constants/code";

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

type requestProps = {
  requestNo: string | null;
};

export default function DesktopFileUploader({ requestNo }: requestProps) {
  const openToast = useSetAtom(toastState);
  const router = useRouter();
  const [fileList, setFileList] = useState<FileData[]>([]);
  const [requestData, setRequestData] = useState<FormData>(new FormData());
  const { Dragger } = Upload;
  const { ...datePickerProps } = useDatePicker();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  /* 등기자료 코드 */
  const attachFileCode = ATTC_FIL_CD.REGISTRATION_DATA;

  /* 등기자료 정보 조회 */
  const { data: fileData, isLoading: imageLoading } = useQuery({
    queryKey: ["registration-images", requestNo],
    queryFn: async () => await getRegistrationImages(requestNo, attachFileCode),
    select: (response) => response.data?.data,
    enabled: !!requestNo,
  });

  /* 등기자료 신규 등록 */
  const { mutate: mutatePostRequestData, isPending: postRequestDataLoading } =
    useMutation({
      mutationKey: ["request-upload"],
      mutationFn: async () => await postRequestData(requestData),
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

  /* 등기자료 수정 */
  const { mutate: mutatePatchRequestData, isPending: patchRequestDataLoading } =
    useMutation({
      mutationKey: ["request-update"],
      mutationFn: async () => await patchRequestData(requestData),
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

  /* 등기의뢰 등록 또는 수정 후 성공 처리 */
  const handleSuccess = () => {
    openToast({
      message:
        "제출이 완료되었습니다.\n관리자가 검토 후 법무대리인이 배정됩니다.",
      position: "top",
    });

    setTimeout(() => {
      router.push(FI_REQUEST_LIST);
    }, 3000);
  };

  /* 파일 선택 이벤트 */
  const handleChange = (info: UploadChangeParam) => {
    if (checkUploadFileSize(info.file)) {
      info.fileList?.map((item) => {
        if (item.uid === info.file.uid) {
          const fileData: FileData = {
            uid: item.uid,
            attcFilNm: item.name,
            filSize: item.size,
            src: "",
            file: item.originFileObj,
          };

          setFileList((prev) => [...prev, fileData]);
        }
      });
    } else {
      openToast({
        message: `업로드 가능한 전체 용량은 최대 ${FILE_MAXIMUM_SIZE_STRING}입니다.`,
        position: "top",
      });
    }
  };

  /* 파일 삭제 */
  const handleRemove = (file: FileData) => {
    setFileList((prevFileList) =>
      prevFileList.filter((item) => item.uid !== file.uid),
    );
  };

  //제출하기
  const handleSubmit = () => {
    if (fileList.length === 0) {
      openToast({
        message: "파일을 업로드해 주세요.",
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
        formData.append("multipartFiles", file.file as Blob, file.attcFilNm);
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

    //대출 실행일 미입력 시
    if (!datePickerProps.startDate) {
      openToast({
        message: "대출실행일을 입력해 주세요.",
        position: "top",
      });

      return;
    }

    if (requestNo) {
      //전자등기 의뢰 수정 처리
      const requestData = {
        rqstNo: requestNo,
        execDt: getDateString(datePickerProps.startDate),
        imageInfo: updateFileList,
      };
      formData.append("rqstCrtReq", JSON.stringify(requestData));

      setRequestData(formData);
      mutatePatchRequestData();
    } else {
      //전자등기 의뢰 신규 등록 처리
      formData.append("execDt", getDateString(datePickerProps.startDate));
      setRequestData(formData);
      mutatePostRequestData();
    }
    setIsButtonDisabled(true);
  };

  const props: UploadProps = {
    name: "file",
    multiple: true,
    accept: ".jpg, .jpeg, .png",
    showUploadList: false,
    listType: "text", // 업로드된 파일 목록의 표시 형식을 설정합니다.  'text' | 'picture' | 'picture-card'
    //maxCount: 10, // 최대 업로드 파일 갯수

    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
    onChange: handleChange,
    onRemove: handleRemove,
    beforeUpload: () => false, // 자동 업로드 방지
  };

  //기 등록한 파일 정보 조회시 fileList에 추가
  useEffect(() => {
    setFileList([]);
    fileData?.imgData?.map((image: FileData) => {
      const fileData: FileData = {
        uid: `${image.seq}_${image.filIdx}`,
        seq: image.seq,
        filIdx: image.filIdx,
        attcFilNm: image.attcFilNm,
        filSize: image.filSize,
        src: image.src,
        file: undefined,
      };
      setFileList((prev) => [...prev, fileData]);
    });

    if (!!fileData?.execDt) {
      datePickerProps.handleDatePicker(stringToDate(fileData.execDt));
    }
  }, [fileData]);

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
      {imageLoading && postRequestDataLoading && patchRequestDataLoading && (
        <Loading />
      )}
      <div className="_desktop-file-uploader-wrapper">
        <FileIndicator total={20} count={fileList.length} />

        <Form
          onSubmit={() => console.log("submit")}
          legendText="파일 업로드 양식"
          isHiddenLegend={true}
          className="_desktop-file-upload-form"
        >
          <div className="_desktop-file-uploader">
            <Dragger {...props}>
              <Typography
                kind="title-large"
                className="text-koser-grayscale-90"
              >
                이곳에 파일을 끌어다 놓거나, 파일 선택 버튼으로 업로드하세요.{" "}
                <br />* 업로드 가능한 파일 형식: jpg, jpeg, png
              </Typography>
              <Button
                shape="solid"
                size="md"
                color="main60"
                icon={
                  <Image
                    src={PlusWhiteIcon}
                    alt="파일 추가 아이콘"
                    width={20}
                    height={20}
                  />
                }
                iconPosition="right"
              >
                파일 선택
              </Button>
            </Dragger>

            <DesktopFileList fileList={fileList} handleRemove={handleRemove} />
          </div>

          <div className="_datepicker-wrapper">
            <Label
              htmlFor="desktop-execution-date"
              required={true}
              labelText="대출실행일"
            />
            <DatePicker
              id="desktop-execution-date"
              minDate={getTodayAddDays(1)}
              {...datePickerProps}
            />
          </div>

          <div className="_button-wrap">
            <Button
              shape="solid"
              size="lg"
              color="grayscale"
              onClick={() => router.push(FI_REQUEST_LIST)}
            >
              목록
            </Button>

            <Button
              shape="solid"
              size="lg"
              color="main100"
              onClick={handleSubmit}
              disabled={isButtonDisabled}
            >
              제출하기
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
}
