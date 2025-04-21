import { Grid, GridItem } from "@components/Layout";

const Detail = () => {
  return (
    <div className="flex w-full">
      <Grid>
        {/* TODO: map */}
        <GridItem mobile={12} tablet={6} desktop={3}>
          <div>
            {/* div 기준으로 화살표 라인 bg 깔기: 아이콘 끼리 연결 */}
            <div className="flex gap-x-2">
              {/* clock icon */}
              <span>11:00</span>
            </div>

            <div>
              {/* 1 */}
            </div>
          </div>
        </GridItem>
      </Grid>
    </div>
  );
};

export default Detail;
