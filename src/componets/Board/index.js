import { useEffect, useRef } from "react";
import rough from "roughjs";

import BoardContext from "../../store/board-context";
import { useContext } from "react";
import { TOOL_ACTION_TYPES, TOOL_ITEMS } from "../../constants";

import classes from "./index.module.css";
function Board() {
  const {
    element,
    boardMouseDownHandler,
    boardMouseMoveHandler,
    toolActionType,
    boardMouseUPHandler,
    textAreaBlurHandler,
    undo,
    redo,

  } = useContext(BoardContext);
  const canvasRef = useRef(null);
  const textAreaRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, [element]);




  useEffect(() => {
    if (toolActionType === TOOL_ACTION_TYPES.WRITING) {
      setTimeout(() => {
        textAreaRef.current?.focus();
      }, 0);
    }
  }, [toolActionType]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "z" && event.ctrlKey) {
        undo();
        return;
      }

      if (event.key === "y" && event.ctrlKey) {
        redo();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [undo, redo]);


  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const roughCanvas = rough.canvas(canvas);

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
          /// this code is to draw the brush stroke on canvas when element change
          ctx.save();
          ctx.fillStyle = ele.stroke;
          ctx.fill(ele.path);
          ctx.restore();
          break;
        }
        case TOOL_ITEMS.TEXT: {
          ctx.save();
          ctx.textBaseline = "top";
          ctx.font = `${ele.size}px Caveat`;
          ctx.fillStyle = ele.stroke;
          ctx.fillText(ele.text || "", ele.x1, ele.y1);
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
    <>
    {toolActionType === TOOL_ACTION_TYPES.WRITING &&
      <textarea
        type="text"
        className={classes.textElementBox}
        ref={textAreaRef}
        style={{
          top: element[element.length - 1]?.y1,
          left: element[element.length - 1]?.x1,
          fontSize: `${element[element.length - 1]?.size}px`,
          color: element[element.length - 1]?.stroke,
        }}
        onBlur={(event) => textAreaBlurHandler(event.target.value)}
      />
    }
   


  
  

       
      <canvas
        width={window.innerWidth}
        height={600}
        id="canvas"
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />



    </>

  );
}

export default Board;
