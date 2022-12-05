import "./tile.css";

const Tile = (props) => {
  return (
    <span className={`tile ${props.number === 0 ? "selectable" : ""}`}>
      {props.number}
    </span>
  );
};

export default Tile;
