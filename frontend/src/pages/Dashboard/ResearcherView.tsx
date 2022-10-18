import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import userSlice from "../../slices/user";
import { RootState } from "../../store/reducer";

import green_light from "../../assets/image/green_light.png";
import gray_light from "../../assets/image/gray_light.png";

const ButtonImage = styled.img`
  width: 25px;
  height: 25px;
  margin-right: 5px;
`;

const StyledDiv = styled.div`
  display: flex;
  flex-direction: row;
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
  // {
  //   userId: 5,
  //   userName: "jiwoon",
  //   online: true,
  // },
  // {
  //   userId: 6,
  //   userName: "hyeji",
  //   online: false,
  // },
  // {
  //   userId: 7,
  //   userName: "taewan",
  //   online: false,
  // },
  // {
  //   userId: 8,
  //   userName: "younghan",
  //   online: true,
  // },
  // {
  //   userId: 9,
  //   userName: "jiwoon",
  //   online: true,
  // },
  // {
  //   userId: 10,
  //   userName: "hyeji",
  //   online: false,
  // },
  // {
  //   userId: 11,
  //   userName: "taewan",
  //   online: false,
  // },
  // {
  //   userId: 12,
  //   userName: "younghan",
  //   online: true,
  // },
  // {
  //   userId: 13,
  //   userName: "jiwoon",
  //   online: true,
  // },
  // {
  //   userId: 14,
  //   userName: "hyeji",
  //   online: false,
  // },
  // {
  //   userId: 15,
  //   userName: "taewan",
  //   online: false,
  // },
  // {
  //   userId: 16,
  //   userName: "younghan",
  //   online: true,
  // },
  // {
  //   userId: 17,
  //   userName: "jiwoon",
  //   online: true,
  // },
  // {
  //   userId: 18,
  //   userName: "hyeji",
  //   online: false,
  // },
  // {
  //   userId: 19,
  //   userName: "taewan",
  //   online: false,
  // },
  // {
  //   userId: 20,
  //   userName: "younghan",
  //   online: true,
  // },
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
  // `${process.env.REACT_APP_TRACCAR_URL}`;
  function Sidebar() {
    return (
      <div
        style={{
          width: "250px",
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
          {users.map((user: DummyUser) => {
            const { userId, userName, online, lastOnline } = user;
            return (
              <StyledDiv id={userId.toString()}>
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
          })}
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
