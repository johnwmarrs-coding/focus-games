import Tile from "./tile.js";

const Board = (props) => {
  return (
    <div>
      {props.data &&
        props.data.map((row) => {
          return (
            <div>
              {row.map((val) => {
                return <Tile number={val} />;
              })}
            </div>
          );
        })}
    </div>
  );
};

export default Board;
