import { useState } from "react";
import Image from "next/image";
import { AlertTriangleIcon14 } from "@icons14";
import { AlertTriangleIcon20 } from "@icons20";
import { UpArrowIcon, DownArrowIcon } from "@icons24";
import { Typography } from "@components/common";
import { useResponsive } from "@hooks";
import { useMutation } from "@tanstack/react-query";
import { getFileDownLoad } from "@services/file";
import "@styles/accordion.css";

type AccordionProps = {
  id: number;
  title: string;
  author: string;
  date: string;
  description: string;
  isUrgent?: boolean;
  fileInfoList: fileList[];
};
type fileList = {
  seq: string;
  filIdx: number;
  attcFilNm: string;
  fileSize: string;
};

/**
 * @name Accordion
 * @version 1.0.0
 * @author 류창선 <zero.ryushin@bankle.co.kr>
 * @description 부모 컴포넌트가 클라이언트 컴포넌트이어야 합니다.
 */
export default function Accordion({
                                    id,
                                    title,
                                    author,
                                    date,
                                    description,
                                    isUrgent,
                                    fileInfoList,
                                  }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { isDesktop } = useResponsive();

  /* 파일 다운로드 API 호출 */
  const { mutate: getBoardListData, isPending: boardListDataLoading } =
    useMutation({
      mutationKey: ["file-download"],
      mutationFn: async ({
                           seq,
                           filidx,
                         }: {
        seq: string;
        filidx: string;
        fileName: string;
      }) => await getFileDownLoad({ seq, filidx }),
      onSuccess: (res, { fileName }) => {
        const contentDisposition = res.headers["content-disposition"];
        const downloadFileName =
          fileName ||
          (contentDisposition
            ? contentDisposition.split("filename=")[1]?.replace(/"/g, "") // 파일명 추출
            : "downloaded-file.pdf");

        // 바이너리 데이터가 있는 경우 Blob 객체로 처리
        const fileBlob = new Blob([res.data], {
          type: res.headers["content-type"] || "application/octet-stream", // 파일 형식 지정
        });

        // Blob URL 생성
        const fileURL = URL.createObjectURL(fileBlob);

        // ✅ iOS 대응: FileReader로 처리
        if (
          navigator.userAgent.includes("iPhone") ||
          navigator.userAgent.includes("iPad")
        ) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const a = document.createElement("a");
            a.href = reader.result as string;
            a.download = decodeURIComponent(downloadFileName);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          };
          reader.readAsDataURL(fileBlob);
        } else {
          // 일반적인 다운로드 처리
          const link = document.createElement("a");
          link.href = fileURL;
          link.download = decodeURIComponent(downloadFileName);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(fileURL); // ✅ 메모리 정리
        }
      },
      onError: (error) => {
        console.error("파일 다운로드 실패: ", error);
      },
    });

  return (
    <div className={`_accordion ${isOpen ? "_open" : ""}`}>
      <button
        type="button"
        className="_accordion-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span
          className={isDesktop ? "_accordion-text" : "_mobile-accordion-texts"}
        >
          <span className="_top-titles">
            <Typography
              kind={isDesktop ? "title-medium" : "body-medium"}
              className={`_id ${
                isDesktop
                  ? "after-none"
                  : "relative pr-2 mr-2 after:absolute after:right-0 after:top-[5px] after:bg-koser-grayscale-40 after:w-[1px] after:h-[10px]"
              } `}
            >
              {id}
            </Typography>
            <Typography
              kind={isDesktop ? "title-medium" : "body-medium"}
              className={`_title ${
                isUrgent ? "flex gap-x-[6px] text-koser-secondary-red-50" : ""
              }`}
            >
              {!isDesktop && isUrgent && (
                <Image
                  src={AlertTriangleIcon14}
                  alt="긴급점검 아이콘"
                  width={14}
                  height={14}
                />
              )}
              {isDesktop && isUrgent && (
                <Image
                  src={AlertTriangleIcon20}
                  alt="긴급점검 아이콘"
                  width={20}
                  height={20}
                />
              )}
              {title}
            </Typography>
          </span>
          <span className="_bottom-titles">
            <Typography
              kind={isDesktop ? "title-medium" : "caption-large"}
              className={`_author ${
                isDesktop
                  ? "after-none"
                  : "relative pr-2 mr-2 after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:bg-koser-grayscale-40 after:w-[1px] after:h-[10px]"
              }`}
            >
              {author}
            </Typography>
            <Typography
              kind={isDesktop ? "title-medium" : "caption-large"}
              className="_date-text"
            >
              {date}
            </Typography>
          </span>

          <span className="_accordion-toggle-icon">
            <Image
              src={isOpen ? UpArrowIcon : DownArrowIcon}
              width={20}
              height={20}
              alt={isOpen ? "열림 아이콘" : "닫힘 아이콘"}
            />
          </span>
        </span>
      </button>

      <div className="_accordion-content flex flex-col">
        {fileInfoList.length === 0 ? null : (
          <p
            className={`flex flex-col items-start gap-1 mb-6 text-koser-main-100 underline ${
              isDesktop ? "text-lg leading-[26px]" : "text-sm"
            }`}
          >
            {fileInfoList.map((fileitem) => (
              <button
                onClick={() =>
                  getBoardListData({
                    seq: fileitem.seq,
                    filidx: fileitem.filIdx.toString(),
                    fileName: fileitem.attcFilNm,
                  })
                }
                key={`${fileitem.seq}-${fileitem.filIdx}`}
                disabled={boardListDataLoading} // 로딩 중일 경우 버튼 비활성화
                className="transition duration-300 ease-in-out transform hover:scale-105"
              >
                {fileitem.attcFilNm}
              </button>
            ))}
          </p>
        )}
        <Typography kind={isDesktop ? "title-medium" : "body-medium"}>
          {description}
        </Typography>
      </div>
    </div>
  );
}
