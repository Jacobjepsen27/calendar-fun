const arrayFromNumber = (count: number) => {
  let arr = [...Array(count)].map((_, i) => i);
  return arr;
};
type CalendarGridUIProps = {
  columns: number;
  rows: number;
};
const CalendarGridUI = ({ columns, rows }: CalendarGridUIProps) => {
  return (
    <div className="flex w-full">
      {/* columns */}
      {arrayFromNumber(columns).map((col) => (
        <div key={col} className="flex flex-grow flex-col border-solid">
          {/* Cells */}
          {arrayFromNumber(rows).map((row) => (
            <Cell key={`${col}-${row}`} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default CalendarGridUI;

const Cell = () => {
  return (
    <div className="w-full shrink-0 basis-[48px] border-r-[1px] border-t-[1px] border-solid"></div>
  );
};
