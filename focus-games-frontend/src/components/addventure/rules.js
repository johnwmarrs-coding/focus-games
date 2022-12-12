import "./rules.css";
const RulesComponent = () => {
  return (
    <div>
      <h3>Add-Venture Rules</h3>
      <h4>Yes, the name is cheesy.</h4>
      <p>
        In order to win, you must navigate around the board and reach the target
        sum. The current selected tile will hold the running sum. You must solve
        the puzzle within the maximum listed number of moves. You cannot
        navigate to the previous tile. You can reset the game at any time any
        number of times. You can also generate a new game if you wish. You
        cannot go over the target sum.
      </p>
      <a href="/">Go to the Game</a>
    </div>
  );
};

export default RulesComponent;
