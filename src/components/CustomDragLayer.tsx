import { useDragLayer } from "react-dnd";

const CustomDragLayer = () => {
  const { isDragging } = useDragLayer((monitor) => ({
    isDragging: monitor.isDragging(),
  }));

  console.log("isDragging: ", isDragging);

  if (!isDragging) {
    return null;
  }

  return null; // Retur
};

export default CustomDragLayer;
