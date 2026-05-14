import React, { useContext, useState } from "react";
import classes from "./index.module.css";
import cx from "classnames";
import { LuRectangleHorizontal, LuCircle } from "react-icons/lu";
import { FaSlash } from "react-icons/fa6";
import { TOOL_ITEMS } from "../../constants";
import BoardContext from "../../store/board-context";

function Toolbox() {
  // const [activeTool, setActiveTool] = useState(TOOL_ITEMS.RECTANGLE);
  const {activeTool, changeToolHandler} =useContext(BoardContext);
  


  return (
    <div className={classes.container}>
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
    </div>
  );
}

export default Toolbox;
