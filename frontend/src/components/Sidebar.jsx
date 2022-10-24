function Sidebar({ data, onSetGeofence }) {
  return (
    <div
      style={{
        width: "280px",
        height: "95vh",
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
        {data.map((item, idx) => (
          <div key={idx} style={{ fontSize: "12px", marginBottom: "10px" }}>
            {item.clusteredList ? (
              <>
                <div>{`cluster_id: ${item.id}`}</div>
                <div>{`클러스터 중심 좌표: ${item.lat}, ${item.lng}`}</div>
                <div>{`클러스터링 된 좌표 개수: ${item.clusteredList.length}`}</div>
              </>
            ) : (
              <>
                <div>{`id: ${item.id}`}</div>
                <div>{`일시: ${item.datetime}`}</div>
                <div>{`좌표: ${item.lat}, ${item.lng}`}</div>
              </>
            )}
            <button onClick={onSetGeofence}>geofence 설정</button>

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
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
