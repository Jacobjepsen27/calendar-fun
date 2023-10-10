import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import BookingPageV2 from "./components/BookingPageV2";

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-full w-full items-center justify-center bg-slate-500">
        {/* change to h-4/5  */}
        {/* <div className="h-full w-full max-w-[1100px]"> */}
        {/* <BookingPage /> */}
        <BookingPageV2 />
        {/* </div> */}
      </div>
    </DndProvider>
  );
}

export default App;
