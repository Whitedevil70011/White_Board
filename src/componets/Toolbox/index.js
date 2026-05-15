import React from "react";
import classes from "./index.module.css";
import cx from "classnames";
import {
  COLORS,
  FILL_TOOL_TYPES,
  STROKE_TOOL_TYPES,
  SIZE_TOOL_TYPES,
  TOOL_ITEMS,
} from "../../constants";
import { useContext } from "react";
import ToolboxContext from "../../store/toolboxcontext";
import BoardContext from "../../store/board-context";

function ToolBox() {
  const { activeTool } = useContext(BoardContext);

  const { toolBoxState, changeStrokeHandler, changeFillHandler, changesizeHandler } =
    useContext(ToolboxContext);
  const strokeColor = toolBoxState[activeTool]?.stroke || "#000000";
  const fillColor = toolBoxState[activeTool]?.fill || null;
const size = toolBoxState[activeTool]?.size || 1;


  return (
    <div className={classes.container}>
    
      {
        STROKE_TOOL_TYPES.includes(activeTool) && (
        <div className={classes.selectOptionContainer}>
          <div className={classes.toolBoxLabel}>Stroke</div>

          <div className={classes.colorOptions}>
            {Object.values(COLORS).map((c) => {
              return (
                <div
                  key={c}
                  className={cx(classes.colorBox, {
                    [classes.activeColorBox]: strokeColor === c,
                  })}
                  style={{ backgroundColor: c }}
                  onClick={() => changeStrokeHandler(activeTool, c)}
                ></div>
              );
            })}
          </div>
        </div>
      )}

      {FILL_TOOL_TYPES.includes(activeTool) && (
        <div className={classes.selectOptionContainer}>
          <div className={classes.toolBoxLabel}>Fill</div>

          <div className={classes.colorOptions}>
            {Object.values(COLORS).map((c) => {
              return (
                <div
                  key={c}
                  className={cx(classes.colorBox, {
                    [classes.activeColorBox]: fillColor === c,
                  })}
                  style={{ backgroundColor: c }}
                  onClick={() => changeFillHandler(activeTool, c)}
                ></div>
              );
            })}
          </div>
        </div>
      )}




      {SIZE_TOOL_TYPES.includes(activeTool) && (
        <div className={classes.selectOptionContainer}>
          <div className={classes.toolBoxLabel}>
            {activeTool === TOOL_ITEMS.TEXT ? "Font Size" : "Brush Size"}
          </div>

          <input
            type="range"
            min={activeTool === TOOL_ITEMS.TEXT ? 12 : 1}
            max={activeTool === TOOL_ITEMS.TEXT ? 64 : 10}
            step={1}
            value={size}
            onChange={(e) => changesizeHandler(activeTool, e.target.value)}
          />
        </div>
      )}

    </div>
  );
}

export default ToolBox;
