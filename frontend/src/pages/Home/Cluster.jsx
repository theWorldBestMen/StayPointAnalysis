import { Circle } from "react-naver-maps";

function Cluster({ clusters, radius, handleClickPoint, selectedCircleId }) {
  return (
    <>
      {clusters.map((item) => {
        const { id, lat, lng, radius, clusteredList } = item;
        return (
          <Circle
            key={id}
            center={{ x: lng, y: lat }}
            radius={radius + 50}
            fillOpacity={0.07 * clusteredList.length}
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
