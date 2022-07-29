import React, { useState, useContext, useCallback } from "react";
import {
  BoldLink,
  BoxContainer,
  FormContainer,
  Input,
  SubmitButton,
} from "./common";
import { Marginer } from "../../components/marginer";
import { AccountContext } from "./accountContext";

export function LoginForm(props) {
  const { switchToSignup } = useContext(AccountContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onChangeEmail = useCallback((event) => {
    const input: string = event.target.value;
    setEmail(input.trim());
  }, []);

  const onChangePassword = useCallback((event) => {
    const input: string = event.target.value;
    setPassword(input.trim());
  }, []);

  return (
    <BoxContainer>
      <FormContainer>
        <Input type="email" placeholder="이메일" onChange={onChangeEmail} value={email}/>
        <Marginer direction="vertical" margin="1em" />
        <Input type="password" placeholder="비밀번호" onChange={onChangePassword} value={password}/>
      </FormContainer>
      <Marginer direction="vertical" margin="1.6em" />
      <SubmitButton type="submit">로그인</SubmitButton>
      <Marginer direction="vertical" margin="1em" />
      <BoldLink href="#" onClick={switchToSignup}>
        회원가입
      </BoldLink>
    </BoxContainer>
  );
}
