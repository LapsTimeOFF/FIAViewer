import "../style/App.scss";
import {
  createHashRouter,
  RouterProvider
} from "react-router-dom";
import Login from "./Login";

const router = createHashRouter([
  {
    path: "/login",
    element: (<Login/>),
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
