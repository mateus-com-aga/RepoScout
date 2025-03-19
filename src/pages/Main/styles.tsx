/** @format */

import styled, { keyframes, css } from "styled-components";

interface ButtonProps {
  Loading: number;
}

interface FormProps {
  error: boolean;
}

export const Container = styled.div`
  max-width: 700px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  padding: 30px;
  margin: 80px auto;

  h1 {
    font-size: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;

    svg {
      margin-right: 10px;
    }
  }
`;

export const Form = styled.form<FormProps>`
  margin-top: 30px;
  display: flex;
  flex-direction: row;

  input {
    flex: 1;
    border: 1px solid ${props => (props.error ? "#FF0000" : "#eee")};
    padding: 10px 15px;
    border-radius: 4px;
    font-size: 17px;
  }
`;

//Criando animação do botão

const animate = keyframes`
  from{
    transform: rotate(0deg);
  }
  to{
    transform: rotate(360deg);
  }

`;

export const SubmitButton = styled.button.attrs<ButtonProps>((props) => ({
  type: "submit",
  disabled: props.Loading === 1,
}))`
  background: #0d2636;
  border: 0;
  border-radius: 4px;
  margin-left: 10px;
  padding: 0 15px;
  display: flex;
  justify-content: center;
  align-items: center;

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }

  ${(props) =>
    props.Loading &&
    css`
      svg {
        animation: ${animate} 2s linear infinite;
      }
    `}
`;

export const List = styled.ul`
  list-style: none;
  margin-top: 20px;

  li {
    padding: 15px 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    & + li {
      border-top: 1px solid #eee;
    }

    a {
      color: #360d34;
      text-decoration: none;
    }
  }
`;

export const DeleteButton = styled.button.attrs({
  type: "button",
})`
  background: transparent;
  color: #0D2636;
  border: 0;
  padding: 8px 7px;
  outline: 0;
  border-radius: 4px;
`;

