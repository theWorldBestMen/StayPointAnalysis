import {
  List,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";

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

function Sidebar({ data, onSetGeofence, handleClickPoint }) {
  return (
    <div
      style={{
        width: "280px",
        height: "100%",
        overflow: "hidden",
        backgroundColor: "#F5F5F6",
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
        <List
          component="nav"
          sx={{
            px: 0,
            py: 0,
          }}
        >
          {data.map((item, idx) => {
            console.log(item);

            const datetime = new Date(item.datetime)
              .toISOString()
              .split(".")[0]
              .replace("T", " ");
            const leavingDatetime = new Date(item.leaving_datetime)
              .toISOString()
              .split(".")[0]
              .replace("T", " ");

            const remainTime = timeConversion(
              new Date(item.leaving_datetime).getTime() -
                new Date(item.datetime).getTime()
            );

            let coord = `${item.lng}, ${item.lat}`;
            if (coord.length > 23) {
              coord = coord.substring(0, 20) + "...";
            }
            coord = "(" + coord + ")";

            let address = `${item.sido} ${item.gungu} ${item.doro} ${item.num1}`;
            if (item.num2) address += `-${item.num2}`;
            if (item.type.value) address += ` (${item.type.value})`;
            if (idx !== data.length - 1) {
              return (
                <ListItemButton
                  divider
                  key={idx}
                  onClick={() => handleClickPoint(item)}
                >
                  <Stack alignItems="flex-start">
                    {/* <Typography variant="subtitle1">id {item.id}</Typography> */}
                    <Typography variant="subtitle2" noWrap>
                      {coord}
                    </Typography>
                    <Typography variant="body2">{address}</Typography>
                    <Typography variant="subtitle2" color="#6B6B6B">
                      {datetime}
                    </Typography>
                    <Typography variant="subtitle2" color="#6B6B6B">
                      ~ {leavingDatetime}
                    </Typography>
                    <Typography variant="subtitle2" color="#6B6B6B">
                      {remainTime} 동안 머무름
                    </Typography>
                  </Stack>
                </ListItemButton>
              );
            } else {
              return (
                <ListItemButton
                  key={idx}
                  onClick={() => handleClickPoint(item)}
                >
                  <Stack alignItems="flex-start">
                    {/* <Typography variant="subtitle1">id {item.id}</Typography> */}
                    <Typography variant="subtitle2" noWrap>
                      {coord}
                    </Typography>
                    <Typography variant="body2">{address}</Typography>
                    <Typography variant="subtitle2" color="#6B6B6B">
                      {datetime}
                    </Typography>
                    <Typography variant="subtitle2" color="#6B6B6B">
                      ~ {leavingDatetime}
                    </Typography>
                    <Typography variant="subtitle2" color="#6B6B6B">
                      {remainTime} 동안 머무름
                    </Typography>
                  </Stack>
                </ListItemButton>
              );
            }
          })}
        </List>
      </div>
      {/* <div
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
        {data.map((item, idx) => {
          const address = `${item.sido}`;
          return (
            <>
              <button
                key={idx}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  fontSize: "12px",
                  marginBottom: "10px",
                }}
                onClick={() => handleClickPoint(item)}
              >
                {item.clusteredList ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      padding: "0 2px",
                    }}
                  >
                    <div>{`cluster_id: ${item.id}`}</div>
                    <div>{`클러스터 중심 좌표: ${item.lat}, ${item.lng}`}</div>
                    <div>{`클러스터링 된 좌표 개수: ${item.clusteredList.length}`}</div>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                      padding: "0 2px",
                    }}
                  >
                    <div>id: {item.id}</div>
                    <div>
                      일시:{" "}
                      {new Date(item.datetime)
                        .toISOString()
                        .split(".")[0]
                        .replace("T", " ")}
                    </div>
                    <div>
                      좌표: ({item.lng}, {item.lat})
                    </div>
                    <div>
                      주소: {item.sido} {item.gungu} {item.doro} {item.num1}
                    </div>
                  </div>
                )}
                <div style={{ height: "5px" }} />
                <button onClick={onSetGeofence}>geofence 설정</button>
              </button>

              {idx !== data.length - 1 && (
                <div
                  style={{
                    width: "100%",
                    height: "1px",
                    backgroundColor: "black",
                    marginTop: "10px",
                  }}
                />
              )}
            </>
          );
        })}
      </div> */}
    </div>
  );
}

export default Sidebar;
