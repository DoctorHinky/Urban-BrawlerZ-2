import { useState } from "react";
import "./Selection.scss";
import data from "./data.json";

function Selection() {
  const maps = data.maps;
  const characters = data.characters;

  const middleIndex = (array) => Math.floor(array.length / 2);
  const [selectedMap, setSelectedMap] = useState(null);

  const [selectedChar, setSelectedChar] = useState({ image: "", name: "" });

  return (
    <main className="home selection">
      <h2>Wählt eure Champions!</h2>
      <section className="showCase">
        <div className="charP1 charShow" />
        <div
          className="showMap"
          style={{
            background: selectedMap
              ? `url(${selectedMap.image}) center/cover`
              : "none",
          }}
        >
          {selectedMap.name}
        </div>
        <div className="charP2 charShow" />
      </section>
      <section className="mapSect">
        {maps.map((map, index) => {
          let shadow = "";

          if (index < middleIndex(maps)) {
            shadow = `-${index}px 0px 10px white`; // Links → Schatten nach rechts
          } else if (index > middleIndex(maps)) {
            shadow = `${index}px 0px 10px white`; // Rechts → Schatten nach links
          } else {
            shadow = "0px 5px 10px white"; // Mitte → Schatten nach unten
          }

          return (
            <div
              key={index}
              className="map"
              style={{
                boxShadow: "none",
                transition: "box-shadow 0.3s",
                background: `url(${map.image}) center/cover`,
              }}
              onClick={() => {
                setSelectedMap(map), console.log(selectedMap);
              }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = shadow)}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
            >
              {map.name}
            </div>
          );
        })}
      </section>
      <section className="charsSect">
        {characters.map((name, index) => {
          let rotateAngle = 0;
          let shadow = "";
          let relativePosition = index - middleIndex(characters);
          rotateAngle = relativePosition * 8;

          if (index < middleIndex(characters)) {
            shadow = `${relativePosition * 2}px 0px 10px white`; // Links → Schatten nach rechts
          } else if (index > middleIndex(characters)) {
            shadow = `${relativePosition + 3}px 0px 10px white`; // Rechts → Schatten nach links
          } else {
            shadow = "0px 5px 10px white"; // Mitte → Schatten nach unten
          }

          return (
            <div
              key={index}
              className="charHead"
              style={{
                background: `url(https://picsum.photos/200/300) center/cover`,
                boxShadow: shadow,
                transition: "box-shadow 0.5s, transform 0.5s",
              }}
              onClick={() => {
                setSelectedChar(name), console.log(selectedChar);
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0px 0px 10px white";
                e.currentTarget.style.transform = `rotateY(${0}deg)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = `rotateY(${rotateAngle}deg)`;
                e.currentTarget.style.boxShadow = shadow;
              }}
            >
              {name}
            </div>
          );
        })}
      </section>
    </main>
  );
}

export default Selection;
