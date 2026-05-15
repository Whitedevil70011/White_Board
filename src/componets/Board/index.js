import { useEffect, useRef } from "react";
import rough from "roughjs";

import BoardContext from "../../store/board-context";
import { useContext } from "react";
import { TOOL_ACTION_TYPES, TOOL_ITEMS } from "../../constants";

function Board() {
  const {
    element,
    boardMouseDownHandler,
    boardMouseMoveHandler,
    toolActionType,
    boardMouseUPHandler,
  } = useContext(BoardContext);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, [element]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const roughCanvas = rough.canvas(canvas);

    const generator = rough.generator();

    /// this is for draw the element on canvas when element change
    element.forEach((ele) => {
      switch (ele.type) {
        case TOOL_ITEMS.LINE:
        case TOOL_ITEMS.ARROW:
        case TOOL_ITEMS.RECTANGLE:
        case TOOL_ITEMS.CIRCLE:
          if (ele.roughEle) {
            roughCanvas.draw(ele.roughEle);
          }
          break;
        case TOOL_ITEMS.BRUSH: {
          ctx.save();
          ctx.fillStyle = ele.stroke;
          ctx.fill(ele.path);
          ctx.restore();
          break;
        }
        default:
          break;
      }
    });

    /// this is for clear the canvas when element change and redraw the element on canvas
    return () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [element]);

  const handleMouseDown = (event) => {
    const clientX = event.clientX;
    const clientY = event.clientY;
    console.log("Mouse down at:", clientX, clientY);
    boardMouseDownHandler(event);
  };
  const handleMouseMove = (event) => {
    if (toolActionType === TOOL_ACTION_TYPES.NONE) {
      return;
    }
    boardMouseMoveHandler(event);
  };
  const handleMouseUp = (event) => {
    boardMouseUPHandler(event);
  };

  return (
    <div>
      <canvas
        width={window.innerWidth}
        height={600}
        id="canvas"
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
}

export default Board;
