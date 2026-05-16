import React, { useContext } from "react";

import BoardContext from "./board-context";
import ToolboxContext from "./toolboxcontext";

import { BOARD_ACTIONS, TOOL_ACTION_TYPES, TOOL_ITEMS } from "../constants";
import {
  CreateRoughElement,
  getSvgPathFromStroke,
  isPointNearElement,
} from "../Utils/element";

import { getStroke } from "perfect-freehand";


const CHANGE_TOOL = "CHANGE_TOOL";

const initialBoardState = {
  activeToolItem: TOOL_ITEMS.RECTANGLE,
  toolActionType: TOOL_ACTION_TYPES.NONE,
  element: [],
  history: [[]],
  index: 0,
};

const boardReducer = (state = initialBoardState, action) => {
  switch (action.type) {
    case CHANGE_TOOL: {
      return {
        ...state,
        activeToolItem: action.payload.tool,
      };
    }
    case "ADD_ELEMENT": {
      const { clientX, clientY, stroke, fill, size } = action.payload;
      const newElement = CreateRoughElement(
        state.element.length,
        clientX,
        clientY,
        clientX,
        clientY,
        { type: state.activeToolItem, stroke, fill, size },
      );
      const prevElements = state.element;
      return {
        ...state,
        toolActionType:
          state.activeToolItem === TOOL_ITEMS.TEXT
            ? TOOL_ACTION_TYPES.WRITING
            : TOOL_ACTION_TYPES.DRAWING,
        element: [...prevElements, newElement],
      };
    }
    case "DRAW_MOVE": {
      const { clientX, clientY, stroke, fill, size } = action.payload;
      if (state.element.length === 0) {
        return state;
      }
      const prevelement = [...state.element];
      const index = prevelement.length - 1;

      const type = state.activeToolItem;
      switch (type) {
        case TOOL_ITEMS.LINE:
        case TOOL_ITEMS.ARROW:
        case TOOL_ITEMS.RECTANGLE:
        case TOOL_ITEMS.CIRCLE:
          const newElement = CreateRoughElement(
            index,
            prevelement[index].x1,
            prevelement[index].y1,
            clientX,
            clientY,
            { type: state.activeToolItem, stroke, fill, size },
          );

          prevelement[index] = newElement;

          return {
            ...state,
            toolActionType: TOOL_ACTION_TYPES.DRAWING,
            element: prevelement,
          };

        case TOOL_ITEMS.BRUSH: {
          prevelement[index].points = [
            ...prevelement[index].points,
            [clientX, clientY],
          ];
          prevelement[index].path = new Path2D(
            getSvgPathFromStroke(getStroke(prevelement[index].points)),
          );

          return {
            ...state,
            element: prevelement,
          };
        }
        default:
          break;
      }
      return state;
    }
    case BOARD_ACTIONS.CHANGE_ACTION_TYPE: {
      return {
        ...state,
        toolActionType: action.payload.toolActionType,
      };
    }
    case BOARD_ACTIONS.ERASE: {
      const { clientX, clientY } = action.payload;
      const newElement = state.element.filter((ele) => {
        return !isPointNearElement(clientX, clientY, ele);
      });

      const newHistory = [...state.history.slice(0, state.index + 1), newElement];

      return {
        ...state,
        element: newElement,
        history: newHistory,
        index: state.index + 1,
      };
    }
    case BOARD_ACTIONS.DRAW_UP: {
      const element = [...state.element];
      return {
        ...state,
        history: [...state.history.slice(0, state.index + 1), element],
        index: state.index + 1,
        toolActionType: TOOL_ACTION_TYPES.NONE,
      }


    }
    case BOARD_ACTIONS.UNDO: {
      if (state.index <= 0) return state;
      return {
        ...state,
        element: state.history[state.index - 1],
        index: state.index - 1,
      };
    }
    case BOARD_ACTIONS.REDO: {
      if (state.index >= state.history.length - 1) return state;
      return {
        ...state,
        element: state.history[state.index + 1],
        index: state.index + 1,
      };
    }


    case BOARD_ACTIONS.CHANGE_TEXT: {
 
      const index = state.element.length - 1;
      const newElements = [...state.element];
      newElements[index] = {
        ...newElements[index],
        text: action.payload.text,
      };
      return {
        ...state,
        history: [...state.history.slice(0, state.index + 1), newElements],
        index: state.index + 1,
        toolActionType: TOOL_ACTION_TYPES.NONE,
        element: newElements,
      };
    }

    default:
      return state;
  }
};

function Boardprovider({ children }) {
  const { toolBoxState } = useContext(ToolboxContext);
  const [boardState, dispatch] = React.useReducer(
    boardReducer,
    initialBoardState,
  );

  // const [activeTool, setActiveTool] = React.useState(TOOL_ITEMS.RECTANGLE);
  // const [element, setElement] = React.useState([]);

  const handleTooLItemClick = (tool) => {
    dispatch({ type: CHANGE_TOOL, payload: { tool } });
  };

  const boardMouseDownHandler = (event) => {
    const { clientX, clientY } = event;

    // if(boardState.activeToolItem === TOOL_ITEMS.TEXT) {
    //   dispatch({
    //     type: BOARD_ACTIONS.CHANGE_ACTION_TYPE,
    //     payload: {
    //       toolActionType: TOOL_ACTION_TYPES.WRITING_TEXT,
    //     },

    //   });
    //     return ;


    // }







    if (boardState.activeToolItem === TOOL_ITEMS.ERASER) {
      dispatch({
        type: BOARD_ACTIONS.CHANGE_ACTION_TYPE,
        payload: {
          toolActionType: TOOL_ACTION_TYPES.ERASING,
        },
      });
      dispatch({
        type: BOARD_ACTIONS.ERASE,
        payload: {
          clientX,
          clientY,
        },
      });
      return;
    }
    dispatch({
      type: "ADD_ELEMENT",
      payload: {
        clientX,
        clientY,
        stroke: toolBoxState[boardState.activeToolItem]?.stroke || "#000000",
        fill: toolBoxState[boardState.activeToolItem]?.fill || null,
        size: toolBoxState[boardState.activeToolItem]?.size || 1,
      },
    });
  };

  const boardMouseMoveHandler = (event) => {

    if(boardState.toolActionType === TOOL_ACTION_TYPES.WRITING) {


    }
    const { clientX, clientY } = event;
    if (boardState.toolActionType === TOOL_ACTION_TYPES.DRAWING) {
      dispatch({
        type: "DRAW_MOVE",
        payload: {
          clientX,
          clientY,
          stroke: toolBoxState[boardState.activeToolItem]?.stroke || "#000000",
          fill: toolBoxState[boardState.activeToolItem]?.fill || null,
          size: toolBoxState[boardState.activeToolItem]?.size || 1,
        },
      });
    } else if (boardState.toolActionType === TOOL_ACTION_TYPES.ERASING) {
      dispatch({
        type: BOARD_ACTIONS.ERASE,
        payload: {
          clientX,
          clientY,
        },
      });
    }
  };
  const boardMouseUPHandler = (event) => {
    if (boardState.toolActionType === TOOL_ACTION_TYPES.WRITING) {
      return;
    }

    if (boardState.toolActionType === TOOL_ACTION_TYPES.DRAWING) {
      dispatch({
        type: BOARD_ACTIONS.DRAW_UP,
      });
      return;
    }

    if (boardState.toolActionType === TOOL_ACTION_TYPES.ERASING) {
      dispatch({
        type: BOARD_ACTIONS.CHANGE_ACTION_TYPE,
        payload: {
          toolActionType: TOOL_ACTION_TYPES.NONE,
        },
      });
    }
  };

  //// 
  const textAreaBlurHandler = (text) => {
    dispatch({
      type: BOARD_ACTIONS.CHANGE_TEXT,
      payload: { text },

    });
  };
  const boardundoHandler = () => {
    dispatch({
      type:BOARD_ACTIONS.UNDO,

    })

  }
  const boardredoHandler = () => {
    dispatch({
      type: BOARD_ACTIONS.REDO,
    });
  };
  const boardContextValue = {
    activeTool: boardState.activeToolItem,
    toolActionType: boardState.toolActionType,
    element: boardState.element,

    changeToolHandler: handleTooLItemClick,
    boardMouseDownHandler,
    boardMouseMoveHandler,
    boardMouseUPHandler,
    textAreaBlurHandler,
    history: boardState.history,
    index: boardState.index,
    undo:boardundoHandler,
    redo:boardredoHandler,

  };

  return (
    <BoardContext.Provider value={boardContextValue}>
      {children}
    </BoardContext.Provider>
  );
}

export default Boardprovider;
