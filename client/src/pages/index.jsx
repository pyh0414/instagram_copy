import React from "react";
import { Router } from "@reach/router";

import Main from "./main";
import User from "./user";
import "./index.css";

const Pages = () => {
  return (
    <>
      <Router>
        <Main path="/main" />
        <User path="/user" />
      </Router>
    </>
  );
};

export default Pages;
