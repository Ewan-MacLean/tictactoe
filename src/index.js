import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// creating the square element (functional)
// is now called under the react element 'Square'
function Square(props) {
    return (
        <button className='square' onClick={props.onClick}>
            {props.value}
        </button>
    )
}
  
class Board extends React.Component {
    // slice() creates a copy of the squares array
    // we can either mutate the original array, or create a new one
    // *** you will almost always want to use immutable arrays over mutatble!! ***
    
    // the state of the squares is not stored in the Board component 
    // instead of the individual squares
    // When the boards state changes, the square components re-render automatically
    // This allows the board component to determine a winner
    
    // The square components are now controlled components
    
    // create the rendersquare method that will 
    // contain a click event
    renderSquare(i) {
        return <Square value={this.props.squares[i]}
        onClick={()=> this.props.onClick(i)} />;
    }
    
    // now render the board by calling the renderSquare
    // method for each row in the board
    render() {
        
        return (
            <div>
            {/* <div className="status">{status}</div> */}
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

// the 'Game' element we are creating here is 
// the results of the game that are saved and 
// then used in the time-travel feature as well as 
// displaying the winner

class Game extends React.Component {

    constructor(props) {
      //  You can’t use 'this' in a constructor until after you’ve called the parent constructor.
      // In this case, it is used to call the 'props' from React.Component
        super(props)
        // the state of the game is an object containing
        // properties from the current game
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            stepNumber: 0,
            xIsNext: true
        }
        // now the props of the game component contains the current game state information
    }

    handleClick(i) {
        // (first line) This replaces the current history array with the new array 
        // passed in by the 'Time Travel' feature
        const history = this.state.history.slice(0, this.state.stepNumber + 1)
        const current = history[history.length - 1]
        const squares = current.squares.slice()
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        // if xIsNext == true, use X. Else.... use O
        squares[i] = this.state.xIsNext ? 'X' : 'O'
        this.setState({
            // concat() works like push(), but it does not mutate the array
            history: history.concat([{

                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        })
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        })
    }

    // present the results of the game
    // as well as the time-travel feature
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber]
        const winner = calculateWinner(current.squares);

        // for each move in the history of moves,
        // create a JSX element that contains a button 
        // that will JUMP TO the selected STATE in the
        // GAME react element
        const moves = history.map((step,move) => {
              const desc = move ?
              'Go to move #' + move :
              'Go to game start'
            return (
                <li key={move}>
                    <button onClick={()=> this.jumpTo(move)}>{desc}</button>
                </li>
            )
          })
        let status;
        if (winner) {
          status = 'Winner: ' + winner;
        } else {
          status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
      return (
        <div className="game">
          <div className="game-board">
            <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
                />
          </div>
          <div className="game-info">
             {/* the STATUS and MOVES are strings that are called 
                as variables that are subject to change depending on
                the state of the game.
                This changes every re-render */}
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }

  // all possible winning lines
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
    // for each winning combination, check if it is present in the current game board. 
    // runs every time the board is re-rendered
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
}
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  