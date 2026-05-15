import { createContext } from "react";
const ToolboxContext = createContext({
  toolBoxState: {},
  changeStrokeHandler: () => {},
changeFillHandler:()=>{},
changesizeHandler:()=>{},


  
});

export default ToolboxContext;