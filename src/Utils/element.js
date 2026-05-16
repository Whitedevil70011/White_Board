import { TOOL_ITEMS } from "../constants";

import rough from "roughjs";
import { getArrowHeadsCoordinates,isPointCloseToLine } from "./Math";
import { getStroke } from "perfect-freehand";

const gen = rough.generator();

export const CreateRoughElement = (
  id,
  x1,
  y1,
  x2,
  y2,
  { type, stroke, fill, size },
) => {
  const element = {
    id,
    x1,
    y1,
    x2,
    y2,
    type,
    stroke,
    fill,
    size,
  };
  let optiona = {
    seed: id + 1,
    fillStyle: "solid",
    roughness: 0,
    bowing: 0,
  };

  if (stroke) {
    optiona.stroke = stroke;
  }
  if (fill) {
    optiona.fill = fill;
  }
  if (size) {
    optiona.strokeWidth = size;
  }

  switch (type) {
    case TOOL_ITEMS.LINE:
      element.roughEle = gen.line(x1, y1, x2, y2, { ...optiona });
      return element;
    case TOOL_ITEMS.RECTANGLE:
      element.roughEle = gen.rectangle(x1, y1, x2 - x1, y2 - y1, {
        ...optiona,
      });
      return element;
    case TOOL_ITEMS.CIRCLE: {
      const cx = (x1 + x2) / 2;
      const cy = (y1 + y2) / 2;
      const width = Math.abs(x2 - x1);
      const height = Math.abs(y2 - y1);
      element.roughEle = gen.ellipse(cx, cy, width, height, { ...optiona });
      return element;
    }
    case TOOL_ITEMS.ARROW: {
      const { x3, y3, x4, y4 } = getArrowHeadsCoordinates(x1, y1, x2, y2, 20);
      const points = [
        [x1, y1],
        [x2, y2],
        [x3, y3],
        [x2, y2],
        [x4, y4],
      ];
      element.roughEle = gen.linearPath(points, { ...optiona });
      return element;
    }
    case TOOL_ITEMS.BRUSH: {
      const points = [
        [x1, y1],
        [x2, y2],
      ];
      const brushElement = {
        id,
        points,
        path: new Path2D(getSvgPathFromStroke(getStroke(points))),
        type,
        stroke,
      };

      return brushElement;
    }
    case TOOL_ITEMS.TEXT:
      {
        element.text = "";
        return element;
        



      }

    default:
      return element;
  }
};

export const getSvgPathFromStroke = (stroke) => {
  if (!stroke.length) return "";

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"],
  );

  d.push("Z");
  return d.join(" ");
};


export const isPointNearElement = (pointX, pointY, element) => {
  const { x1, y1, x2, y2, type } = element;
  const context = document.getElementById("canvas").getContext("2d");
  switch (type) {
    case TOOL_ITEMS.LINE:
    case TOOL_ITEMS.ARROW:
      return isPointCloseToLine(x1, y1, x2, y2, pointX, pointY);
    case TOOL_ITEMS.RECTANGLE:
    case TOOL_ITEMS.CIRCLE:
      return (
        isPointCloseToLine(x1, y1, x2, y1, pointX, pointY) ||
        isPointCloseToLine(x2, y1, x2, y2, pointX, pointY) ||
        isPointCloseToLine(x2, y2, x1, y2, pointX, pointY) ||
        isPointCloseToLine(x1, y2, x1, y1, pointX, pointY)
      );
    case TOOL_ITEMS.BRUSH:
      return context.isPointInPath(element.path, pointX, pointY);
    case TOOL_ITEMS.TEXT:
      context.font = `${element.size}px Caveat`;
      context.fillStyle = element.stroke;
      const textWidth = context.measureText(element.text).width;
      const textHeight = parseInt(element.size);
      context.restore();
      return (
        isPointCloseToLine(x1, y1, x1 + textWidth, y1, pointX, pointY) ||
        isPointCloseToLine(
          x1 + textWidth,
          y1,
          x1 + textWidth,
          y1 + textHeight,
          pointX,
          pointY
        ) ||
        isPointCloseToLine(
          x1 + textWidth,
          y1 + textHeight,
          x1,
          y1 + textHeight,
          pointX,
          pointY
        ) ||
        isPointCloseToLine(x1, y1 + textHeight, x1, y1, pointX, pointY)
      );
    default:
      throw new Error("Type not recognized");
  }
};