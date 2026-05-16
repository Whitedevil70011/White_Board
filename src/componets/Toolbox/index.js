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
  const activeToolItem = activeTool;

  const { toolBoxState, changeStrokeHandler, changeFillHandler, changesizeHandler } =
    useContext(ToolboxContext);
  const changeFill = changeFillHandler;
  const strokeColor = toolBoxState[activeTool]?.stroke || "#000000";
  const fillColor = toolBoxState[activeTool]?.fill || null;
const size = toolBoxState[activeTool]?.size || 1;


  return (
    <div className={classes.container}>
    
    {STROKE_TOOL_TYPES.includes(activeTool) && (
        <div className={classes.selectOptionContainer}>
          <div className={classes.toolBoxLabel}>Stroke Color</div>
          <div className={classes.colorsContainer}>
            <div>
              <input
                className={classes.colorPicker}
                type="color"
                value={strokeColor}
                onChange={(e) => changeStrokeHandler(activeTool, e.target.value)}
              ></input>
            </div>
            {Object.keys(COLORS).map((k) => {
              return (
                <div
                  key={k}
                  className={cx(classes.colorBox, {
                    [classes.activeColorBox]: strokeColor === COLORS[k],
                  })}
                  style={{ backgroundColor: COLORS[k] }}
                  onClick={() => changeStrokeHandler(activeTool, COLORS[k])}
                ></div>
              );
            })}
          </div>
        </div>
      )}
      {FILL_TOOL_TYPES.includes(activeToolItem) && (
        <div className={classes.selectOptionContainer}>
          <div className={classes.toolBoxLabel}>Fill Color</div>
          <div className={classes.colorsContainer}>
            {fillColor === null ? (
              <div
                className={cx(classes.colorPicker, classes.noFillColorBox)}
                onClick={() => changeFill(activeToolItem, COLORS.BLACK)}
              ></div>
            ) : (
              <div>
                <input
                  className={classes.colorPicker}
                  type="color"
                  value={fillColor}
                  onChange={(e) => changeFill(activeToolItem, e.target.value)}
                ></input>
              </div>
            )}
            <div
              className={cx(classes.colorBox, classes.noFillColorBox, {
                [classes.activeColorBox]: fillColor === null,
              })}
              onClick={() => changeFill(activeToolItem, null)}
            ></div>
            {Object.keys(COLORS).map((k) => {
              return (
                <div
                  key={k}
                  className={cx(classes.colorBox, {
                    [classes.activeColorBox]: fillColor === COLORS[k],
                  })}
                  style={{ backgroundColor: COLORS[k] }}
                  onClick={() => changeFill(activeToolItem, COLORS[k])}
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
