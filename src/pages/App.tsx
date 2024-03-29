import "../style/App.scss";
import {
  createHashRouter,
  RouterProvider
} from "react-router-dom";
import Login from "./Login";
import Main from "./Main";
import Player from "./Player";
import Home from "./Home";
import Page from "./Page";
import Details from "./Details";

const router = createHashRouter([
  {
    path: "/login",
    element: (<Login/>),
  },
  {
    path: "/",
    element: (<Main/>),
  },
  {
    path: "/player/:contentId/:channelId",
    element: (<Player/>)
  },
  {
    path: "/home",
    element: (<Home/>)
  },
  {
    path: "/page/:id/:pagename",
    element: (<Page/>)
  },
  {
    path: "/detail/:contentId/:videoSlug",
    element: (<Details/>)
  }
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
