  import { jsx,  useState } from "./framework.js";
  
 export function App() {
    const [state, setState] = useState("hello");
    return jsx(
      "h1",
      { className: "new" },
      "Simple Test",
      jsx(
        "button",
        {
          onclick: () => {
            setState("you are here");
          },
        },
        "Click Here"
      ),
      jsx("p", null, state)
    );
  }
 