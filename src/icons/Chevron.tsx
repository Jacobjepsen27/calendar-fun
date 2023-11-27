import { ComponentPropsWithoutRef } from "react";

const Chevron = ({
  direction,
  ...svgProps
}: ComponentPropsWithoutRef<"svg"> & { direction: "right" | "left" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...svgProps}
    >
      {direction === "right" ? (
        <>
          <polyline points="13 17 18 12 13 7"></polyline>
          <polyline points="6 17 11 12 6 7"></polyline>
        </>
      ) : (
        <>
          <polyline points="11 17 6 12 11 7"></polyline>
          <polyline points="18 17 13 12 18 7"></polyline>
        </>
      )}
    </svg>
  );
};

export default Chevron;
