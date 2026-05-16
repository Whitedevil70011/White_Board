import { useContext } from "react";
import classes from "./index.module.css";
import cx from "classnames";
import { LuArrowRight, LuCircle, LuRectangleHorizontal } from "react-icons/lu";
import { FaEraser, FaPaintBrush, FaFont, FaUndoAlt, FaRedoAlt, FaDownload } from "react-icons/fa";
import { FaSlash } from "react-icons/fa6";
import { TOOL_ITEMS } from "../../constants";
import BoardContext from "../../store/board-context";

function Toolbar() {
  // const [activeTool, setActiveTool] = useState(TOOL_ITEMS.RECTANGLE);
  const { activeTool, changeToolHandler, undo, redo } = useContext(BoardContext);
  

  const handleDownloadClick = () => {
    const canvas = document.getElementById("canvas");
    if (!canvas) {
      return;
    }
    const data = canvas.toDataURL("image/png");
    const anchar = document.createElement("a");
    anchar.href = data;
    anchar.download = "whiteboard.png";
    anchar.click();
  }

  return (
    <div className={classes.container}>

      <div
        className={cx(classes.toolItem, {
          [classes.active]: activeTool === TOOL_ITEMS.BRUSH,
        })}
        onClick={() => changeToolHandler(TOOL_ITEMS.BRUSH)}
      >
        <FaPaintBrush />
      </div>
      <div
        className={cx(classes.toolItem, {
          [classes.active]: activeTool === TOOL_ITEMS.RECTANGLE,
        })}
        onClick={() => changeToolHandler(TOOL_ITEMS.RECTANGLE)}
      >
        <LuRectangleHorizontal />
      </div>
      <div
        className={cx(classes.toolItem, {
          [classes.active]: activeTool === TOOL_ITEMS.LINE,
        })}
        onClick={() => changeToolHandler(TOOL_ITEMS.LINE)}
      >
        <FaSlash />
      </div>

      <div
        className={cx(classes.toolItem, {
          [classes.active]: activeTool === TOOL_ITEMS.CIRCLE,
        })}
        onClick={() => changeToolHandler(TOOL_ITEMS.CIRCLE)}
      >
        <LuCircle />


      </div>

       <div
        className={cx(classes.toolItem, {
          [classes.active]: activeTool === TOOL_ITEMS.ARROW,
        })}
        onClick={() => changeToolHandler(TOOL_ITEMS.ARROW)}
      >
        <LuArrowRight />
      </div>

         <div
        className={cx(classes.toolItem, {
          [classes.active]: activeTool === TOOL_ITEMS.ERASER,
        })}
        onClick={() => changeToolHandler(TOOL_ITEMS.ERASER)}
      >
        <FaEraser />
      </div>

     <div
        className={cx(classes.toolItem, {
          [classes.active]: activeTool === TOOL_ITEMS.TEXT,
        })}
        onClick={() => changeToolHandler(TOOL_ITEMS.TEXT)}
      >
        <FaFont />
      </div>

      
     <div
        className={cx(classes.toolItem)
      }
        onClick={() => undo()}
      >
        <FaUndoAlt />
      </div>

      
     <div
        className={cx(classes.toolItem) }
        onClick={() => redo()}
      >
        <FaRedoAlt />
      </div>

      <div
        className={cx(classes.toolItem) }
        onClick={() => handleDownloadClick()}
      >
        <FaDownload />
      </div>



    </div>
  );
}

export default Toolbar;
