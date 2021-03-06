import React from 'react';

function Square(props){
    return (
      <button className={props.win
              ? "square winning-square":"square"}
              onClick={ () => props.onClick() }>
          {props.value}
      </button>
    );
};

class Board extends React.Component {

    renderSquare(i) {
        return <Square value={this.props.squares[i].value}
            onClick={ () => this.props.onClick(i) }
            win={this.props.squares[i].win}
            key={i}
            />;
    };

    render() {
        return (
          <div>
              {
                  Array(this.props.size).fill(1).map( (o,i) => {
                      var iKey = 'i'+i;
                      return (
                          <div className="board-row" key={iKey}>
                            {
                              Array(this.props.size).fill(1).map( (o,j) => {
                                  var jKey = j+(this.props.size*i);
                                  return this.renderSquare(jKey);
                              })
                            }
                          </div>
                      );
                  })
              }
          </div>
        );
    };
};


export default class Game extends React.Component {

    constructor() {
        super();
        this.state = {
            history: [{
                squares: [],
                squareIndex: null
            }],
            xIsNext: true,
            stepNumber : 0,
            selectedLink: null,
            size: 3
        };
        let _squares = [];
        for(var i=0; i<(this.state.size*this.state.size); i+=1){
            _squares.push({value:null, win:false});
        }
        this.state.history[0].squares = _squares;
    };

    handleClick(i) {
        const history = this.state.history.slice(0,this.state.stepNumber+1);
        const current = history[history.length - 1];
        const squares = JSON.parse(JSON.stringify(current.squares.slice()));
        if(calculateWinner(squares) || squares[i].value){
            return;
        }
        squares[i].value = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                squareIndex: i
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
            selectedLink: null,
            movesSort : 1,
            size: 3
        });
    };

    jumpTo(step) {
      this.setState({
        history: this.state.history.slice(0,step+1),
        stepNumber: step,
        xIsNext: (step % 2) ? false : true,
        selectedLink: step
      });
    };

    boldClass(move) {
        var boldClass = '';
        if(this.state.selectedLink === move){
            boldClass = 'text-bold';
        }
        return boldClass;
    };

    sortMoves() {
        var s = this.state.history.slice(0);
        s.sort((a,b) => {
            if(this.state.movesSort === 1){
                return b.squareIndex - a.squareIndex;
            }else{
                return a.squareIndex - b.squareIndex;
            }
        });
        if(this.state.movesSort === 1){
            this.state.movesSort = -1;
        }else{
            this.state.movesSort = 1;
        }
        this.setState({
            history : s
        });
    };

  render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

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
              size={this.state.size}
              onClick={(i) => this.handleClick(i)}
              />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>
            <button className="sort-button"
                  onClick={ () => this.sortMoves() }>Sort moves - Toggle</button>
            <ol>
                {
                    this.state.history.map((step, move) => {
                        var [row,col] = getPosition(this.state.size, step.squareIndex);
                        const desc = move ?
                          'Move #(' +row+','+col+')' :
                          'Game start';
                          return (
                          <li className={ this.boldClass(move) } key={move}>
                              <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
                          </li>
                      );
                    })
                }
            </ol>
          </div>
        </div>
      </div>
    );
  }
};


function getPosition(size, index){
    let _col = (index%size)+1;
    let _row = ((index-(index%size))/size)+1;
    return [_row, _col];
}

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
    if (squares[a] && squares[a].value
        && squares[a].value === squares[b].value
        && squares[a].value === squares[c].value) {
        squares[a].win = true;
        squares[b].win = true;
        squares[c].win = true;
      return squares[a].value;
    }
  }
  return null;
}

window.addEventListener('mousedown', function(e) {
  document.body.classList.add('mouse-navigation');
  document.body.classList.remove('kbd-navigation');
});
window.addEventListener('keydown', function(e) {
  if (e.keyCode === 9) {
    document.body.classList.add('kbd-navigation');
    document.body.classList.remove('mouse-navigation');
  }
});
window.addEventListener('click', function(e) {
  if (e.target.tagName === 'A' && e.target.getAttribute('href') === '#') {
    e.preventDefault();
  }
});
window.onerror = function(message, source, line, col, error) {
  var text = error ? error.stack || error : message + ' (at ' + source + ':' + line + ':' + col + ')';
  errors.textContent += text + '\n';
  errors.style.display = '';
};
console.error = (function(old) {
  return function error() {
    errors.textContent += Array.prototype.slice.call(arguments).join(' ') + '\n';
    errors.style.display = '';
    old.apply(this, arguments);
  }
})(console.error);
