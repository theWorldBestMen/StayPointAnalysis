import { Marker } from "react-naver-maps";

function StayPoints({ data, handleClickPoint }) {
  return (
    <>
      {data.map((item) => {
        const { lat, lng } = item;
        return (
          <Marker
            position={{ x: lng, y: lat }}
            clickable={true}
            onClick={() => handleClickPoint({ ...item, type: "point" })}
          />
        );
      })}
    </>
  );
}

export default StayPoints;

// for dummy data

// function StayPoints({ data, handleClickPoint }) {
//   return (
//     <>
//       {Object.entries(data).map((item) => {
//         const { lat, lng } = item[1];
//         return (
//           <Marker
//             position={{ x: lng, y: lat }}
//             clickable={true}
//             onClick={() => handleClickPoint([item[1]])}
//           />
//         );
//       })}
//     </>
//   );
// }

// export default StayPoints;
