/**
 * @param event 
 * @param container 
 * Returns the coordinates relative to the container provided
 */
export const getRelativeClickCoordinates = <T extends Element>(event: React.MouseEvent<T, MouseEvent>, container: HTMLElement): [number, number] => {
    // Mouse position relative to the viewport
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // The container's position relative to the viewport (scrolling with have effect on this value)
    const rect = container.getBoundingClientRect();

    // Calculating mouse position relative to the container
    const relativeX =
      mouseX - rect.left + container.scrollLeft;
    const relativeY =
      mouseY - rect.top + container.scrollTop;

    return [relativeX, relativeY]
}