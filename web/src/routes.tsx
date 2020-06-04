import React from "react";
import { Route, BrowserRouter } from "react-router-dom";

import Home from "./pages/Home";
import CreatePoints from "./pages/CreatePoints";

const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <Route path="/" exact component={Home} />
      <Route path="/create" component={CreatePoints} />
    </BrowserRouter>
  );
};

export default Routes;
