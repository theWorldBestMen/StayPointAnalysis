import { Circle } from "react-naver-maps";

function Cluster({ clusters, radius, handleClickPoint, selectedCircleId }) {
  return (
    <>
      {clusters.map((item) => {
        const { id, lat, lng, radius } = item;
        return (
          <Circle
            key={id}
            center={{ x: lng, y: lat }}
            radius={radius + 10}
            fillOpacity={id === selectedCircleId ? 0.8 : 0.3}
            fillColor={id === selectedCircleId ? "navy" : "red"}
            strokeColor={id === selectedCircleId ? "navy" : "red"}
            clickable={true}
            onClick={() => handleClickPoint([item])}
          />
        );
      })}
    </>
  );
}

export default Cluster;
