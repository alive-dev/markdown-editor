import * as React from "react";
import { render } from "react-dom";
import {
    HashRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";

import { createGlobalStyle } from "styled-components";
import { useStateWithStorage } from "./hooks/use_state_with_storage";
import { Editor } from "./pages/editor";
import { History } from "./pages/hitstory";

const GlobalStyle = createGlobalStyle`
  body * {
    box-sizing: border-box;
  }`;

const StorageKey = "pages/editor:text";

const Main: React.FC = () => {
    const [text, setText] = useStateWithStorage("", StorageKey);
    return (
        <>
            <GlobalStyle />
            <Router>
                <Route exact path="/editor">
                    <Editor text={text} setText={setText} />
                </Route>
                <Route exact path="/history">
                    <History setText={setText} />
                </Route>
                <Redirect to="/editor" path="*" />
            </Router>
        </>
    );
};
render(<Main />, document.getElementById("app"));
