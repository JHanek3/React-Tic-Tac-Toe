import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//F12, with components from inspect, you can see the component tree


//rn renders a single button
//passing data trhough props
// class Square extends React.Component {
//   //to remember things that got clicked, components use state
//   //react componenets can have state by setting this.state in their constructors
//   //constructors initialize the state
//   // constructor(props) {
//   //   super(props);
//     //in JavaScript classes, you need to always call super when defining the
//     //constructor of a sub class, all react component classes with constructors
//     //should have a super(props)
//   //   this.state = {
//   //     value: null,
//   //   };
//   // }
//
// //change the square to a function component, these are components that only
// //have a render method
// //instead of react.component, we can write a function that takes props as input
// //returns what should be rendered
//
//   //We deleted the constructor from square because Square no longer keeps
//   //track of the game's state, board does
//   render() {
//     return (
//       // <button className="square" onClick={function() {alert('click');}}>
//       //this is where we will implement the arrow function, so instead of above
//       //we do below
//
//       <button
//         className="square"
//         //passing a function as the onClick prop. React will only call this function
//         //after a click. Don't forget {() =>}
//         //this.setState frm an onClick handler in the Sqaure's render, we tell
//         //react to re-render the square whenever its button is clicker
//         //after the update, the square's this.state.value will be X
//         //When you call setState in a component, childs will automatically
//         //be updated
//         onClick={() => this.props.onClick()}
//       >
//         {this.props.value}
//       </button>
//     );
//   }
// }
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

//this.props was changed to props
//just chagned onClick to propss

//onClick funciton provided by the board tells React to listen for a click event
//when clicked. React will call the onClick event handler defined in Square's render
//This event handler calls this.props.omClick(). The square's onClick prop was specified by the board
//Since the Board passsed onClick this.handle to square, the square calls
//this.handleClick(i)

//the board renders 9 squares
//this is the parent, using {this.props value} we passed a prop from a parent
//to the child square

//best approach is to store the game's state in the parent Board, the Board component
//can tell each Square what to display by passing a prop

//To collect data from multiple children, or to have two child components communicate
//with each other, you need to declare the shared state in their parent component instead
//The parent component can pass the state back down to the children by using props;
//this keeps the child components in sync with everything

//Lifting state into a parent component is common when React components are refactored
class Board extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     squares: Array(9).fill(null),
  //     xIsNext: true,
  //     //set X as the default first turn
  //   };
  // }
  //board component receives squares annd onClick props from the Hame component
  //single click handler, pass the location of each square into the onClick handler
  //to indicate which Square was clicked

  // handleClick(i) {
  //   //we call slice() to create a copy of the squares array to modify instead of
  //   //modifying the exisiting Array
  //   //to ways to change data, mutate by changing the values directly or
  //   //replace the data with a new copy
  //   //With immunability
  //     //Complex Features easier to implement, avoiding direct data manipulation
  //     //allows us to keep previous versions of data intact to be used for later
  //     //Detecting changes, easier to see when an immutable object is differnt
  //     //than its previous state
  //     //Re-Render, immunability builds pure components in React. If changes need
  //     //to be made Re-rendering is requried
  //     //Read Optimizing Performance
  //
  //   const squares = this.state.squares.slice();
  //   if (calculateWinner(squares) || squares[i]) {
  //     return;
  //     //Change the board's handleClickto return early by ignoring a click if
  //     //someone has won or a square is already filled
  //   }
  //   //flips the value of xIsNext
  //   squares[i] = this.state.xIsNext ? 'X': 'O';
  //   this.setState({
  //     squares: squares,
  //     xIsNext: !this.state.xIsNext,
  //   });
  // }
  //moved to game component

  //Allows us to fill the squares again, this time the state is saved on the Board
  //and not the square, when board changes square reRenders
  //The square Components recieves values from the Board component and inform the Board
  //when they are clicked, making them controlled components. The board has full control over them


  renderSquare(i) {
    //prop passing mechanism

    return (
      <Square
      //each square will now receive a value prop that will either be, x, o, or null
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
      //Pass a function from the Board to the square, have Square call
      //that function when a square is clicked
      />
    );
  }

  //Now we are passing down two props from Board to Square: value and onClick
  //onClick prop is a funciton that Square can call when clicked

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

//redners a board with placeholder values
//Placing history in the top-level game component lets us remove the squares
//state from its child board component. This gives the game component full control
//over the board's data, and lets it instruct the Board to render previous turns
//from the history
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true
    };
  }

  //we move the handleClick method from the board component to the game component

  handleClick(i) {
    //this ensures if we go back in time, and then make a new move, we throw
    //away all the "future" moves
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X': 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      //ensures we dont get stuck showing the same move after a new one is made
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  //updates the step number
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }
    //update Game's render funciton to use the most recent history entry to
    //determine and display the game's status

        //rendering the currently selected move according to stepNumber

        //using map we can map our history of moves to REact elements, representing
        //buttons on the screem
        //for each move in the game's history, we create a list item which constains
        //a button which calls the method jumpTo
        //get an error that says each child in an array or iterator should have
        //a unique key prop
        //react needs a key property for each list item to differentiate each list
        //item from its siblings

        //if the current lists has a new key, react creates a component
        //if the current list is missing a key that existed previously, react destroys
        //the previous component
        //if the keys match, the corresponding component is moved.
        //Keys tell React about the identity of each component, allowng React to
        //maintain state between re-renders

        //key is a reserved property. When an element is created, react extracts the
        //key property and stores the key directly on the returned element
        //React automatically uses key to decide which components to updated

        //dynamic lists, uses keys, key do not need to be globally uniqure, they
        //only need to be unique between componenets and siblings
        //each past move has a unique ID, so we can use move index as a key
        render() {
          const history = this.state.history;
          const current = history[this.state.stepNumber];
          const winner = calculateWinner(current.squares);

          const moves = history.map((step, move) => {
            const desc = move ?
              'Go to move #' + move :
              'Go to game start';
            return (
              <li key={move}>
                <button onClick={() => this.jumpTo(move)}>{desc}</button>
              </li>
            );
          });

          let status;
          if (winner) {
            status = "Winner: " + winner;
          } else {
            status = "Next player: " + (this.state.xIsNext ? "X" : "O");
          }

          return (
            <div className="game">
              <div className="game-board">
                <Board
                  squares={current.squares}
                  onClick={i => this.handleClick(i)}
                />
              </div>
              <div className="game-info">
                <div>{status}</div>
                <ol>{moves}</ol>
              </div>
            </div>
          );
        }
      }


// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
//Given an array of 9 squares, this function will check for a winner and return 'X',
//'O' or null as appropriate. Call calculate winner in the Board's render function
//to check if a player has won, then display text of the winner by replacing
//status with new code

//Give any name to the Square's onclick prop. on[Event] names for events
//handle[Event] for handle events
