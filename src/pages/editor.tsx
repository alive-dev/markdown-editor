import * as React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import ConvertMarkdownWorker from "worker-loader!../worker/convert_markdown_worker";

import { putMemo } from "../indexeddb/memos";
import { Button } from "../components/button";
import { SaveModal } from "../components/save_modal";
import { Header } from "../components/header";

const Wrapper = styled.div`
    bottom: 0;
    left: 0;
    position: fixed;
    right: 0;
    top: 3rem;
`;

const HeaderArea = styled.div`
    position: fixed;
    right: 0;
    top: 0;
    left: 0;
`;

const TextArea = styled.textarea`
    border-right: 1px solid silver;
    border-top: 1px solid silver;
    bottom: 0;
    font-size: 1rem;
    left: 0;
    padding: 0.5rem;
    position: absolute;
    top: 0;
    width: 50vw;
`;

const Preview = styled.div`
    border-top: 1px solid silver;
    bottom: 0;
    overflow-y: scroll;
    padding: 1rem;
    position: absolute;
    right: 0;
    top: 0;
    width: 50vw;
`;

interface Props {
    text: string;
    setText: (text: string) => void;
}

const convertMarkdownWorker = new ConvertMarkdownWorker();

export const Editor: React.FC<Props> = (props) => {
    const { text, setText } = props;
    const [html, setHtml] = useState("");
    const [showModal, setShowModal] = useState(false);

    const onChangeText = (event) => {
        setText(event.target.value);
    };

    useEffect(() => {
        convertMarkdownWorker.onmessage = (event) => {
            setHtml(event.data.html);
        };
    }, []);

    useEffect(() => {
        convertMarkdownWorker.postMessage(text);
    }, [text]);

    return (
        <>
            <HeaderArea>
                <Header title="Markdown Editor">
                    <Button onClick={() => setShowModal(true)}>保存する</Button>
                    <Link to="/history">履歴を見る</Link>
                </Header>
            </HeaderArea>
            <Wrapper>
                <TextArea onChange={onChangeText} value={text} />
                <Preview>
                    <div dangerouslySetInnerHTML={{ __html: html }}></div>
                </Preview>
            </Wrapper>
            {showModal && (
                <SaveModal
                    onSave={(title: string): void => {
                        putMemo("title", text);
                        setShowModal(false);
                    }}
                    onCancel={() => setShowModal(false)}
                >
                    保存
                </SaveModal>
            )}
        </>
    );
};
