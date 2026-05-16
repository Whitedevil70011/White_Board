import React, { useReducer } from "react";
import ToolboxContext from "./toolboxcontext";
import { TOOL_ITEMS, COLORS, TOOLBOX_ACTIONS } from "../constants";



const toolBoxReducer = (state, action) => {
  if (!action || !action.type) {
    return state;
  }

  switch (action.type) {
    case TOOLBOX_ACTIONS.CHANGE_STROKE: {
      return {
        ...state,
        [action.payload.tool]: {
          ...state[action.payload.tool],
          stroke: action.payload.stroke,
        },
      };
    }
    case TOOLBOX_ACTIONS.CHANGE_FILL: {
      return {
        ...state,
        [action.payload.tool]: {
          ...state[action.payload.tool],
          fill: action.payload.fill,
        },
      };
    }

    case TOOLBOX_ACTIONS.CHANGE_SIZE: {
      return {
        ...state,
        [action.payload.tool]: {
          ...state[action.payload.tool],
          size: action.payload.size,
        },
      };
    }

    default:
      return state;
  }
};

const initalToolBoxState = {
  [TOOL_ITEMS.LINE]: {
    stroke: COLORS.BLACK,
    size: 1,
  },
  [TOOL_ITEMS.RECTANGLE]: {
    stroke: COLORS.BLACK,
    size: 1,
    fill: null,
  },
  [TOOL_ITEMS.CIRCLE]: {
    stroke: COLORS.BLACK,
    size: 1,
    fill: null,
  },
  [TOOL_ITEMS.ARROW]: {
    stroke: COLORS.BLACK,
    size: 1,
  },
  [TOOL_ITEMS.BRUSH]: {
    stroke: COLORS.BLACK,
    size: 1,
  },
  [TOOL_ITEMS.TEXT]: {
    stroke: COLORS.BLACK,
    size: 32,
  },
};

function ToolboxProvider({ children }) {
  const [toolBoxState, dispatchToolBoxAction] = useReducer(
    toolBoxReducer,
    initalToolBoxState,
  );

  const changeStrokeHandler = (tool, c) => {
    dispatchToolBoxAction({
      type: TOOLBOX_ACTIONS.CHANGE_STROKE ,
      payload: {
        tool,
        stroke: c,
      },
    });
  };

  const changeFillHandler = (tool, c) => {
    dispatchToolBoxAction({
      type: TOOLBOX_ACTIONS.CHANGE_FILL,
      payload: {
        tool,
        fill: c,
      },
    });
  };
  const changesizeHandler = (tool, size) => {
    dispatchToolBoxAction({
      type: TOOLBOX_ACTIONS.CHANGE_SIZE,
      payload: {
        tool,
        size: Number(size),
      },
    });
  };

  const toolBoxContextValue = {
    toolBoxState,
    dispatchToolBoxAction,
    changeStrokeHandler,
    changeFillHandler,
    changesizeHandler,

  };

  return (
    <ToolboxContext.Provider value={toolBoxContextValue}>
      {children}
    </ToolboxContext.Provider>
  );
}

export default ToolboxProvider;
