import React, { useState, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { setCookie } from "../../utils/cookie";

import {
  BoldLink,
  BoxContainer,
  FormContainer,
  Input,
  SubmitButton,
} from "./common";
import { Marginer } from "../../components/marginer";
import { AccountContext } from "./accountContext";
import axios from "axios";
import { useAppDispatch } from "../../store/index";
import userSlice from "../../slices/user";

export function LoginForm(props) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { switchToSignup } = useContext(AccountContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = useCallback(async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        {
          email,
          password,
        }
      );
      if (response.status === 200) {
        const { access_token, refresh_token } = response.data;

        const userInfo = await axios.get(
          `${process.env.REACT_APP_API_URL}/user`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        console.log("userInfo", userInfo.data.data);
        const { data } = userInfo.data;
        alert("로그인 되었습니다.");
        setCookie("refreshToken", refresh_token, {
          secure: true,
          // httpOnly: true,
        });
        dispatch(
          userSlice.actions.setUser({
            ...data,
            accessToken: access_token,
          })
        );
      }
    } catch (error) {
      const errorResponse = error.response;
      if (errorResponse) {
        alert(errorResponse.data.message);
      }
    }
  }, [email, password]);

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
        <Input
          type="email"
          placeholder="이메일"
          onChange={onChangeEmail}
          value={email}
        />
        <Marginer direction="vertical" margin="1em" />
        <Input
          type="password"
          placeholder="비밀번호"
          onChange={onChangePassword}
          value={password}
        />
      </FormContainer>
      <Marginer direction="vertical" margin="1.6em" />
      <SubmitButton type="submit" onClick={onSubmit}>
        로그인
      </SubmitButton>
      <Marginer direction="vertical" margin="1em" />
      <BoldLink href="#" onClick={switchToSignup}>
        회원가입
      </BoldLink>
    </BoxContainer>
  );
}
