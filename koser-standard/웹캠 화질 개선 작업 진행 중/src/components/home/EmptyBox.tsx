import { useResponsive } from "@hooks";
import { Typography } from "@components/common";

type EmptyBoxpros = {
  element: string;
};

export default function EmptyBox({ element }: EmptyBoxpros) {
  const { isDesktop } = useResponsive();

  return (
    <div className="flex _flex-center w-full h-full">
      <Typography kind={isDesktop ? "title-medium" : "body-medium"}>
        {element}
      </Typography>
    </div>
  );
}
