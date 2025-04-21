import { Accordion, AccordionHeader } from "@components/accordion";

// mock-up data
// import { ACCORDION_DATA_LIST } from "@data/sample-accordion-data";
type dataProps = {
  data: boardList[];
};
type boardList = {
  seq: string;
  num: number;
  boardTitle: string;
  boardContents: string;
  emcyYn: boolean;
  writerNm: string;
  chgDtm: string;
  fileInfoList: fileList[];
};
type fileList = {
  seq: string;
  filIdx: number;
  attcFilNm: string;
  fileSize: string;
};
export default function List({ data }: dataProps) {
  return (
    <div>
      <AccordionHeader />

      <ul>
        {data.map((accordion) => {
          const {
            seq,
            num,
            boardTitle,
            writerNm,
            chgDtm,
            boardContents,
            emcyYn,
            fileInfoList,
          } = accordion;

          return (
            <li key={`${seq}-${num}`}>
              <Accordion
                id={num}
                title={boardTitle}
                author={writerNm}
                date={chgDtm}
                description={boardContents}
                isUrgent={emcyYn}
                fileInfoList={fileInfoList}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
