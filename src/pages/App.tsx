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
    path: '/player',
    element: (<Player/>)
  },
  {
    path: '/home',
    element: (<Home/>)
  },
  {
    path: '/page/:id/:pagename',
    element: (<Page/>)
  }
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
