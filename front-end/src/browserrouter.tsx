import { createBrowserRouter } from "react-router-dom";

import Page404 from "./pages/page404";

const router = createBrowserRouter([

   {
    path: `/404`,
    element: <Page404 />
   } 

               


])

export default router;