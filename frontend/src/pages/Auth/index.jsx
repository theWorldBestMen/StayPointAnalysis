import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { LoginForm } from "./LoginForm";
import { motion } from "framer-motion";
import { AccountContext } from "./accountContext";
import { SignupForm } from "./SignupForm";
import { getCookie, setCookie } from "../../utils/cookie";
import refresh from "../../utils/refresh";
import { getUserInfo } from "../../utils/getUserInfo";
import userSlice from "../../slices/user";
import { useAppDispatch } from "../../store";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const BoxContainer = styled.div`
  width: 350px;
  min-height: 700px;
  display: flex;
  flex-direction: column;
  border-radius: 19px;
  background-color: #fff;
  box-shadow: 0 0 2px rgba(15, 15, 15, 0.28);
  position: relative;
  overflow: hidden;
`;

const TopContainer = styled.div`
  width: 100%;
  height: 210px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0 1.8em;
  padding-bottom: 5em;
`;

const BackDrop = styled(motion.div)`
  width: 200%;
  height: 570px;
  position: absolute;
  display: flex;
  flex-direction: column;
  border-radius: 50%;
  transform: rotate(10deg);
  top: -390px;
  left: -230px;
  background: #114d86;
  z-index: 1;
`;

const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const HeaderText = styled.h2`
  font-size: 30px;
  font-weight: 600;
  line-height: 1.24;
  color: #fff;
  z-index: 10;
  margin: 0;
`;

const SubText = styled.h4`
  color: #fff;
  font-weight: 500;
  font-size: 20px;
  z-index: 10;
  margin: 0;
  margin-top: 25px;
`;

const SmallText = styled.h5`
  color: #fff;
  font-weight: 500;
  font-size: 11px;
  z-index: 10;
  margin: 0;
  margin-top: 7px;
`;

const InnerContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 1.8em;
`;

const backdropVariants = {
  expanded: {
    width: "250%",
    height: "1250px",
    borderRadius: "50%",
    transform: "rotate(30deg)",
  },
  collapsed: {
    width: "200%",
    height: "570px",
    borderRadius: "50%",
    transform: "rotate(10deg)",
  },
};

const expandingTransition = {
  type: "spring",
  duration: 2.5,
  stiffness: 30,
};

export default function Auth(props) {
  const [isExpanded, setExpanded] = useState(false);
  const [active, setActive] = useState("signin");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state: RootState) => state.user);
  const authenticated = useSelector((state: RootState) => !!state.user.email);

  useEffect(() => {
    console.log(userInfo);
    const autoLogin = async () => {
      if (!authenticated) {
        try {
          const refreshToken = getCookie("refreshToken");
          const response = await refresh(refreshToken);
          if (!response) return;

          const { access_token } = response.data;
          const userResponse = await getUserInfo(access_token);
          if (!userResponse) return;

          const { email, name, role } = userResponse.data.data;
          dispatch(
            userSlice.actions.setUser({
              name,
              email,
              role,
              accessToken: access_token,
            })
          );
          // navigate("/mypage");
        } catch (error) {
          console.error(error);
        }
      }
    };

    autoLogin();
  }, [dispatch, navigate]);

  const playExpandingAnimation = () => {
    setExpanded(true);
    setTimeout(() => {
      setExpanded(false);
    }, expandingTransition.duration * 1000 - 1500);
  };

  const switchToSignup = () => {
    playExpandingAnimation();
    setTimeout(() => {
      setActive("signup");
    }, 500);
  };

  const switchToSignin = () => {
    playExpandingAnimation();
    setTimeout(() => {
      setActive("signin");
    }, 500);
  };

  const contextValue = { switchToSignup, switchToSignin };

  return (
    <AppContainer>
      <AccountContext.Provider value={contextValue}>
        <BoxContainer>
          <TopContainer>
            <BackDrop
              initial={false}
              animate={isExpanded ? "expanded" : "collapsed"}
              variants={backdropVariants}
              transition={expandingTransition}
            />
            <HeaderContainer>
              <HeaderText>한양대학교</HeaderText>
              <HeaderText>위치 수집 시스템</HeaderText>
            </HeaderContainer>
          </TopContainer>
          <InnerContainer>
            {active === "signin" && <LoginForm />}
            {active === "signup" && <SignupForm />}
          </InnerContainer>
        </BoxContainer>
      </AccountContext.Provider>
    </AppContainer>
  );
}
