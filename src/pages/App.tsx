import "../style/App.scss";
import {
  createHashRouter,
  RouterProvider
} from "react-router-dom";
import Login from "./Login";
import Main from "./Main";

const router = createHashRouter([
  {
    path: "/login",
    element: (<Login/>),
  },
  {
    path: "/",
    element: (<Main/>),
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
