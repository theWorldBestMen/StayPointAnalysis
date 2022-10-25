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
      </div>
    </div>
  );
}

export default Sidebar;
