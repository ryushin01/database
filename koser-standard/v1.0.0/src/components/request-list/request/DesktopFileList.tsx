"use client";

import Image from "next/image";
import { CancelIcon } from "@icons18";
import { FILE_MAXIMUM_NUMBER } from "@constants/file";
import { Typography } from "@components/common";
import { formatBytes, formatMegaBytes } from "@utils/fileUtil";

type FileData = {
  uid?: string;
  attcFilNm?: string;
  filSize?: number;
  src?: string;
  file?: File;
};

type DesktopFileListItemProps = {
  fileList: FileData[];
  handleRemove: (file: FileData) => void;
};

export default function DesktopFileList({
  fileList,
  handleRemove,
}: DesktopFileListItemProps) {
  const getTotalFileSize = (fileList: FileData[]) => {
    const totalSize = fileList.reduce(
      (acc, file) => acc + (file?.filSize || 0),
      0,
    );
    return formatMegaBytes(totalSize, 2);
  };

  return (
    <>
      {fileList.length > 0 && (
        <div className="_desktop-file-list-wrapper">
          <div>
            <Typography kind="body-medium" className="text-koser-grayscale-80">
              전체 사용량: {getTotalFileSize(fileList)} / {FILE_MAXIMUM_NUMBER}
              .00 MB
            </Typography>
          </div>
          <ul className="_desktop-file-list">
            {fileList?.map((file) => {
              const { uid, attcFilNm, filSize } = file;
              return (
                <li key={uid}>
                  <button
                    type="button"
                    aria-label="해당 이미지 삭제"
                    onClick={() => {
                      handleRemove(file);
                    }}
                    className="_delete-single-file-button"
                  >
                    <span>
                      <Image
                        src={CancelIcon}
                        alt="단일 이미지 삭제 아이콘"
                        width={18}
                        height={18}
                      />
                    </span>
                  </button>

                  <Typography kind="title-small">
                    {attcFilNm} [{formatBytes(filSize || 0, 2)}]
                  </Typography>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}
