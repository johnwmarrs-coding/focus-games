import "./tile.css";

const Tile = (props) => {
  return (
    <span
      className={`tile ${props.number === 0 ? "selectable" : ""}`}
      onClick={() => props.makeMove(1, 1)}
    >
      {props.number}
    </span>
  );
};

export default Tile;
