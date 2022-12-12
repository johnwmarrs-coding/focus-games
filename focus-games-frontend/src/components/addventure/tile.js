import "./tile.css";

const Tile = (props) => {
  return (
    <span
      className={`tile ${props.isPotentialMove ? "selectable" : ""} ${
        props.active ? "active" : ""
      }`}
      onClick={() => props.makeMove(props.i, props.j)}
    >
      {props.active ? props.runningSum : props.number}
    </span>
  );
};

export default Tile;
