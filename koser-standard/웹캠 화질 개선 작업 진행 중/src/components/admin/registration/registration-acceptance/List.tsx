import { Grid, GridItem } from "@components/layout";
import { ResponsiveSwiper } from "@components/common";
import { ATTC_FIL_CD } from "@constants/code";
import { ResponsiveType } from "@types";
import Table from "./Table";
import "@styles/responsive-table.css";

export type RegistrationAcceptanceProps = {
  requestNo: string;
};

export default function List({
  requestNo,
  isMobile,
}: RegistrationAcceptanceProps & ResponsiveType) {
  return (
    <>
      <Grid className="_without-padding">
        <GridItem desktop={4} tablet={6} mobile={12}>
          <ResponsiveSwiper
            requestNo={requestNo}
            attachFileCode={ATTC_FIL_CD.REGISTRATION_RECEIPT}
            isMobile={isMobile}
          />
        </GridItem>
        <GridItem desktop={8} tablet={6} mobile={12}>
          <Table requestNo={requestNo} isMobile={isMobile} />
        </GridItem>
      </Grid>
    </>
  );
}
