import type { Metadata } from "next";
import { AD_NOTICE_METADATA } from "@constants/metadata";
import { CommonLayout } from "@components/layout";

export const metadata: Metadata = {
  title: AD_NOTICE_METADATA.TITLE,
  description: AD_NOTICE_METADATA.DESCRIPTION,
};

export default async function Notice() {
  return (
    <CommonLayout>
      <div>
        공지관리
      </div>
    </CommonLayout>
  );
}
