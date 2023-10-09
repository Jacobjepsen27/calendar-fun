import { DndProvider } from "react-dnd";
import BookingPage from "./components/BookingPage";
import { HTML5Backend } from "react-dnd-html5-backend";
import CustomDragLayer from "./components/CustomDragLayer";

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-full bg-slate-500 p-10">
        <div className="mx-auto flex h-full max-w-[1100px]">
          <BookingPage />
        </div>
      </div>
      {/* <CustomDragLayer /> */}
    </DndProvider>
  );
}

export default App;
