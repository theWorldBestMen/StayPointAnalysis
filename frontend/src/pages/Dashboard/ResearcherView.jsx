import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import userSlice from "../../slices/user";
import { RootState } from "../../store/reducer";

import green_light from "../../assets/image/green_light.png";
import gray_light from "../../assets/image/gray_light.png";
import axios from "axios";
import { useAppDispatch } from "../../store";
import { useNavigate } from "react-router-dom";

const ButtonImage = styled.img`
  width: 25px;
  height: 25px;
  margin-right: 5px;
`;

const SubjectButton = styled.button`
  display: flex;
  flex-direction: row;
  background-color: white;
  justify-content: space-between;
  border: 1px solid black;
  margin-top: 5px;
  margin-bottom: 5px;
  padding: 5px 8px;
`;

interface DummyUser {
  userId: number;
  userName: string;
  online: boolean;
  lastOnline: Date;
}

const users: DummyUser[] = [
  {
    userId: 1,
    userName: "jiwoon",
    online: true,
    lastOnline: new Date("2022-10-18T17:30:00"),
  },
  {
    userId: 2,
    userName: "hyeji",
    online: false,
    lastOnline: new Date("2022-10-18T13:10:00"),
  },
  {
    userId: 3,
    userName: "taewan",
    online: false,
    lastOnline: new Date("2022-10-17T13:10:00"),
  },
  {
    userId: 4,
    userName: "younghan",
    online: true,
    lastOnline: new Date("2022-09-17T13:10:00"),
  },
  {
    userId: 5,
    userName: "hyunkyu",
    online: false,
    lastOnline: new Date("2022-10-19T00:40:00"),
  },
];

function timeConversion(millisec: number) {
  var seconds = Math.floor(millisec / 1000);

  var minutes = Math.floor(millisec / (1000 * 60));

  var hours = Math.floor(millisec / (1000 * 60 * 60));

  var days = Math.floor(millisec / (1000 * 60 * 60 * 24));

  if (Number(hours) >= 24) {
    return days + "일";
  } else if (Number(minutes) >= 60) {
    return hours + "시간";
  } else if (Number(seconds) >= 60) {
    return minutes + "분";
  } else {
    return seconds + "초";
  }
}

function ResearcherView() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.user);
  const accessToken = userInfo.accessToken;

  const [subjectInfoList, setSubjectInfoList] = useState([]);

  useEffect(() => {
    loadSubjectsData();
  }, []);

  const loadSubjectsData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/researcher/subjects`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 200) {
        setSubjectInfoList(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onSetSubject = (email) => {
    console.log(email);
  };

  function Sidebar() {
    return (
      <div
        style={{
          maxWidth: "250px",
          height: "600px",
          border: "1px solid black",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            padding: "10px",
            overflow: "hidden",
            overflowY: "auto",
          }}
        >
          {subjectInfoList.map((subjectInfo) => {
            const { name, email, device_info } = subjectInfo;
            console.log(device_info);
            return (
              <SubjectButton
                id={email.toString()}
                onClick={() => onSetSubject(email)}
              >
                <div>
                  {device_info.status === "online" ? (
                    <ButtonImage src={green_light} />
                  ) : (
                    <ButtonImage src={gray_light} />
                  )}
                  {name}
                </div>

                {device_info.status !== "online" &&
                  !!device_info.lastUpdate && (
                    <div style={{ color: "gray", fontSize: "15px" }}>
                      {timeConversion(
                        new Date().getTime() -
                          new Date(device_info.lastUpdate).getTime()
                      )}{" "}
                      전
                    </div>
                  )}
              </SubjectButton>
            );
          })}
          {/* {users.map((user: DummyUser) => {
            const { userId, userName, online, lastOnline } = user;
            return (
              <StyledDiv
                id={userId.toString()}
                // onClick={() => onSetSubject(userEmail)}
              >
                <div>
                  {online ? (
                    <ButtonImage src={green_light} />
                  ) : (
                    <ButtonImage src={gray_light} />
                  )}
                  {userName}
                </div>

                {!online && (
                  <div style={{ color: "gray", fontSize: "15px" }}>
                    {timeConversion(
                      new Date().getTime() - lastOnline.getTime()
                    )}{" "}
                    전
                  </div>
                )}
              </StyledDiv>
            );
          })} */}
        </div>
      </div>
    );
  }

  return (
    <div style={{ margin: 50 }}>
      <Sidebar />
    </div>
  );
}

export default ResearcherView;
