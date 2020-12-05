import styled from "styled-components";
import { Form } from "antd";

export const Wrapper = styled.div`
  margin: 0;
  padding: 0;
  text-decoration: none;
  min-height: 100vh;
  background-image: linear-gradient(120deg, #3498db, #8e44ad);
`;

export const LoginForm = styled(Form)`
  width: 360px;
  background: #f1f1f1;
  height: 580px;
  padding: 80px 40px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 10px;

  h1 {
    text-align: center;
    margin-bottom: 50px;
  }
`;

export const BottomText = styled.div`
  margin-top: 50px;
  text-align: center;
  font-size: 13px;

  span {
    cursor: pointer;
    font-size: 14px;
    color: #2f34fb;
  }
`;

export const TextBox = styled.div`
  border-bottom: 2px solid #adadad;
  position: relative;
  margin: 30px 0;

  input {
    font-size: 15px;
    color: #333;
    border: none;
    width: 100%;
    background: none;
    outline: none;
    padding: 0 5px;
    height: 50px;
  }
`;

export const LoginButton = styled.button`
  display: block;
  width: 100%;
  height: 50px;
  border: none;
  background: linear-gradient(120deg, #3498db, #8e44ad, #3498db);
  background-size: 200%;
  color: #fff;
  outline: none;
  cursor: pointer;
  transition: 0.5s;

  :hover {
    background-position: right;
  }
`;
