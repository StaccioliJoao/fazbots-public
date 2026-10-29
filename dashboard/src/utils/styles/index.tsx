import styled, { css } from "styled-components";

export const GuildMenuItemStyle = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 20px;
  background-color: #252525;
  border-radius: 5px;
  border-color: 1px solid #ffffff2f;
  margin: 8px 0;
`;

export const Container = styled.div`
  width: 1200px;
  margin: 0 auto;
`;

export const AppBarStyle = styled.header`
  display: flex;
  align-items: center;
  padding: 15px 35px;
  box-sizing: border-box;
  border-bottom: 1px solid #c9c9c929;
`;

export const Title = styled.p`
  font-size: 22px;
`;
type FlexProps = Partial<{
  alignItems: string;
  justifyContent: string;
  flexDirection: string;
}>;
export const Flex = styled.div<FlexProps>`
  display: flex;
  align-items: ${({ alignItems }) => alignItems};
  justify-content: ${({ justifyContent }) => justifyContent};
  flex-direction: ${({ flexDirection }) => flexDirection};
`;

export const MainButton = styled.div`
  display: flex;
  width: 350px;
  align-items: center;
  justify-content: space-between;
  background-color: #2121217d;
  padding: 4px 50px;
  box-sizing: border-box;
  border-radius: 5px;
  border: 1px solid #58585863;
  margin: 10px 0;
  box-shadow: 0px 1px 5px 0px #00000018;
`;

export const TextButton = styled(MainButton)`
  padding: 18px 28px;
  width: 100%;
  background-color: #272727;
  margin: 4px 0;
  text-align: center;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 8px;
`;

export const InputField = styled.input`
  padding: 10px 16px;
  font-size: 16px;
  color: white;
  font-family: "DM Sans";
  background-color: #1112155d;
  border-radius: 5px;
  border: 1px solid #6f6f6f;
  outline: none;
  -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
  -moz-box-sizing: border-box; /* Firefox, other Gecko */
  box-sizing: border-box; /* Opera/IE 8+ */
  width: 100%;
  :focus {
    outline: 1px solid #ffffffb4;
    transition: 0.1s;
  }
`;
type ButtonProps = {
  variant: "primary" | "secondary" | "negative" | "positive";
};
export const Button = styled.button<ButtonProps>`
  padding: 10px 24px;
  border-radius: 5px;
  outline: none;
  border: none;
  font-size: 16px;
  color: #fff;
  font-family: "DM Sans";
  cursor: pointer;

  ${({ variant }) =>
    variant === "primary" &&
    css`
      background-color: #5865f2;
    `}
  ${({ variant }) =>
    variant === "secondary" &&
    css`
      background-color: #3d3d3d;
    `}
  ${({ variant }) =>
    variant === "negative" &&
    css`
      background-color: #d83c3e;
    `}
  ${({ variant }) =>
    variant === "positive" &&
    css`
      background-color: #2d7d46;
    `}
`;

export const TextArea = styled.textarea`
  padding: 14px 16px;
  box-sizing: border-box;
  font-size: 16px;
  color: #fff;
  font-family: "DM Sans";
  background-color: #18191d93;
  border-radius: 5px;
  border: 1px solid #6f6f6f;
  outline: none;
  width: 100%;
  resize: none;
  :focus {
    outline: 1px solid #ffffffb4;
    transition: 0.1s;
  }
`;

export const InputArea = styled.input`
  padding: 14px 16px;
  box-sizing: border-box;
  font-size: 16px;
  color: #fff;
  font-family: "DM Sans";
  background-color: #18191d93;
  border-radius: 5px;
  border: 1px solid #6f6f6f;
  outline: none;
  width: 100%;
  resize: none;
  :focus {
    outline: 1px solid #ffffffb4;
    transition: 0.1s;
  }
`;

export const Overlay = styled.div`
  height: 100%;
  width: 100%;
  background-color: #000000a;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
`;

type ContextMenuContainerProps = {
  top: number;
  left: number;
};

export const ContextMenuContainer = styled.div<ContextMenuContainerProps>`
  position: absolute;
  background-color: #353535;
  border-radius: 6px;
  box-shadow: 0px 1px 10px 0px rgba(0, 0, 0, 0.15);
  height: auto;
  width: 200px;
  box-sizing: border-box;
  ${({ top, left }) => css`
    top: ${top}px;
    left: ${left}px;
  `}
  ul {
    list-style-type: none;
    margin: 0;
    padding: 8px;
    box-sizing: border-box;
  }
  ul li {
    padding: 10px 14px;
    border-radius: 3px;
  }
  ul li:hover {
    background-color: #444444;
    cursor: pointer;
  }
`;
