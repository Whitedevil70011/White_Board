import { TOOL_ITEMS } from "../constants";

import rough from "roughjs";
const gen = rough.generator();

export const CreateRoughElement = (id, x1, y1, x2, y2, { type }) => {
  const element = {
    id,
    x1,
    y1,
    x2,
    y2,

  };
  let optiona={
    seed:id+1,
  }
  switch (type) {
    case TOOL_ITEMS.LINE:
      element.roughEle = gen.line(x1, y1, x2, y2,{...optiona});
      return element;
    case TOOL_ITEMS.RECTANGLE:
      element.roughEle = gen.rectangle(x1, y1, x2 - x1, y2 - y1, {...optiona});
      return element;
    case TOOL_ITEMS.CIRCLE:
      { 

      }
    default:
      return element;
  }
};
