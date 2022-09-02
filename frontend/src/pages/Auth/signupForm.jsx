import React, { useState, useCallback, useContext } from "react";
import {
  BoldLink,
  BoxContainer,
  FormContainer,
  Input,
  MutedLink,
  SubmitButton,
} from "./common";
import { Marginer } from "../../components/marginer";
import { AccountContext } from "./accountContext";
import axios, { AxiosError, AxiosResponse } from "axios";

export function SignupForm(props) {
  const { switchToSignin } = useContext(AccountContext);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setpasswordCheck] = useState("");
  const [role, setRole] = useState("");

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setpasswordError] = useState(false);
  const [passwordCheckError, setpasswordCheckError] = useState(false);

  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordErrorMessage, setpasswordErrorMessage] = useState("");
  const [passwordCheckErrorMessage, setpasswordCheckErrorMessage] =
    useState("");

  const onChangeName = useCallback((event) => {
    const input: string = event.target.value;
    setName(input.trim());
  }, []);

  const checkEmailValid: boolean = (input) => {
    const reg =
      /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    const result = reg.test(input);
    setEmailError(!result);
    return result;
  };

  const onChangeEmail = useCallback((event) => {
    const input: string = event.target.value;
    setEmail(input.trim());
    if (!checkEmailValid(input.trim())) {
      setEmailErrorMessage("이메일 형식이 올바르지 않습니다.");
    } else {
      setEmailErrorMessage("");
    }
  }, []);

  const checkPasswordValid: boolean = (pw) => {
    const reg = /^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@^!%*#?&]).{8,50}$/;
    const result = reg.test(pw);
    setpasswordError(!result);
    return result;
  };

  const onChangePassword = useCallback((event) => {
    const input: string = event.target.value;
    setPassword(input.trim());
    if (!checkPasswordValid(input.trim())) {
      setpasswordErrorMessage(
        "비밀번호는 영문,숫자,특수문자($@^!%*#?&)를 모두 포함하여 8자 이상 입력해야합니다."
      );
    } else {
      setpasswordErrorMessage("");
    }
  }, []);

  const passwordEqualCheck: boolean = (pw, pwCheck) => {
    const result = pw === pwCheck;
    setpasswordCheckError(result);
    return result;
  };

  const onChangePasswordCheck = useCallback(
    (event) => {
      const input: string = event.target.value;
      setpasswordCheck(input.trim());
      if (!passwordEqualCheck(password, input.trim())) {
        setpasswordCheckErrorMessage("비밀번호가 일치하지 않습니다.");
      } else {
        setpasswordCheckErrorMessage("");
      }
    },
    [password]
  );

  const onChangeRole = useCallback((event) => {
    setRole(event.target.value);
  }, []);

  const onSubmit = useCallback(async () => {
    if (loading) {
      return;
    }
    if (!email || !email.trim()) {
      return alert("이메일을 입력해주세요.");
    }
    if (!name || !name.trim()) {
      return alert("이름을 입력해주세요.");
    }
    if (!password || !password.trim()) {
      return alert("비밀번호를 입력해주세요.");
    }
    // 이메일 검증
    if (emailError) {
      return alert("올바른 이메일 주소가 아닙니다.");
    }
    // 비밀번호
    if (passwordError) {
      return alert(
        "비밀번호는 영문,숫자,특수문자($@^!%*#?&)를 모두 포함하여 8자 이상 입력해야합니다."
      );
    }

    // TODO: 비밀번호 암호화

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/signup`,
        {
          name,
          email,
          password,
          role,
        }
      );
      console.log(response);
      alert("회원가입 되었습니다.");
      switchToSignin();
    } catch (error) {
      const errorResponse = error.response;
      if (errorResponse) {
        alert(errorResponse.data.message);
      }
    } finally {
      setLoading(false);
    }
  }, [
    email,
    emailError,
    loading,
    name,
    password,
    passwordError,
    role,
    switchToSignin,
  ]);

  return (
    <BoxContainer>
      <FormContainer>
        <Input
          type="text"
          placeholder="이름"
          onChange={onChangeName}
          value={name}
        />
        <Marginer direction="vertical" margin="1em" />
        <Input
          type="email"
          placeholder="이메일"
          onChange={onChangeEmail}
          value={email}
        />
        {emailErrorMessage === "" ? (
          <Marginer direction="vertical" margin="1em" />
        ) : (
          <div style={{ color: "red", fontSize: "12px" }}>
            {emailErrorMessage}
          </div>
        )}
        <Input
          type="password"
          placeholder="비밀번호"
          onChange={onChangePassword}
          value={password}
        />
        {passwordErrorMessage === "" ? (
          <Marginer direction="vertical" margin="1em" />
        ) : (
          <div style={{ color: "red", fontSize: "12px" }}>
            {passwordErrorMessage}
          </div>
        )}
        <Input
          type="password"
          placeholder="비밀번호 확인"
          onChange={onChangePasswordCheck}
          value={passwordCheck}
        />
        {passwordCheckErrorMessage === "" ? (
          <Marginer direction="vertical" margin="1em" />
        ) : (
          <div style={{ color: "red", fontSize: "12px" }}>
            {passwordCheckErrorMessage}
          </div>
        )}
        {/* TODO: Change Role Input */}
        <Input
          type="text"
          placeholder="역할"
          onChange={onChangeRole}
          value={role}
        />
        <Marginer direction="vertical" margin="1em" />
      </FormContainer>
      <Marginer direction="vertical" margin="1em" />
      <SubmitButton type="submit" onClick={onSubmit}>
        회원가입
      </SubmitButton>
      <Marginer direction="vertical" margin="1em" />
      <BoldLink href="#" onClick={switchToSignin}>
        로그인
      </BoldLink>
    </BoxContainer>
  );
}
