import React from 'react';
import { range } from 'lodash';
import classNames from 'classnames';

const BOARD_LENGTH = 5;

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      xRobot: null,
      yRobot: null,
      direction: null,
      command: null,
      error: null,
      report: null,
    };
  }

  handleChange = e => {
    this.setState({ command: e.target.value })
  }

  handleSubmit = () => {
    const { xRobot, yRobot, direction, command } = this.state;
    this.setState({
      error: null,
      report: null,
    });
    if (!command) {
      this.setState({ error: "Command can't be blank" });
      return;
    }
    
    if ((!xRobot && xRobot !== 0) && (!yRobot && yRobot !== 0) && command.split(' ')[0] !== 'PLACE') {
      this.setState({ error: 'First command must be PLACE'});
      return;
    } 
  
    if (command === 'MOVE') {
      switch(direction) {
        case 'NORTH':
          if (yRobot < 4) {
            this.setState(prevState => ({
              yRobot: prevState.yRobot + 1,
            }));
            return;
          }
          this.setState({ error: 'Exceeded north limit'});
          return;
        case 'SOUTH':
          if (yRobot > 0) {
            this.setState(prevState => ({
              yRobot: prevState.yRobot - 1,
            }));
            return;
          }
          this.setState({ error: 'Exceeded south limit'});
          return;
        case 'EAST':
          if (xRobot < 4) {
            this.setState(prevState => ({
              xRobot: prevState.xRobot + 1,
            }));
            return;
          }
          this.setState({ error: 'Exceeded east limit'});
          return;
        case 'WEST':
          if (xRobot > 0) {
            this.setState(prevState => ({
              xRobot: prevState.xRobot - 1,
            }));
            return;
          }
          this.setState({ error: 'Exceeded west limit'});
          return;
        default:
          this.setState({ error: 'Not a valid command'});
          return;
      }

    } else if (command === 'LEFT') {
      switch(direction) {
        case 'NORTH':
          this.setState({ direction: 'WEST'});
          return;
        case 'SOUTH':
          this.setState({ direction: 'EAST'});
          return;
        case 'EAST':
          this.setState({ direction: 'NORTH'});
          return;
        case 'WEST':
          this.setState({ direction: 'SOUTH'});
          return;
        default:
          this.setState({ error: 'Not a valid command'});
          return;
      }

    } else if (command === 'RIGHT') {
      switch(direction) {
        case 'NORTH':
          this.setState({ direction: 'EAST'});
          return;
        case 'SOUTH':
          this.setState({ direction: 'WEST'});
          return;
        case 'EAST':
          this.setState({ direction: 'SOUTH'});
          return;
        case 'WEST':
          this.setState({ direction: 'NORTH'});
          return;
        default:
          this.setState({ error: 'Not a valid command'});
          return;
      }
    } else if (command === "REPORT") {
      this.setState({ report: `${xRobot},${yRobot},${direction}`})
    } else if (command.startsWith("PLACE ")) {
      const placementPosition = command.split(" ")[1].split(',');
      const xNew = placementPosition[0];
      const yNew = placementPosition[1];
      const directionNew = placementPosition[2];

      if (xNew && yNew && directionNew && xNew > -1 && xNew < 5 && yNew > -1 && yNew < 5 && ['NORTH', 'EAST', 'SOUTH', 'WEST'].indexOf(directionNew) > -1) {
        this.setState({
          xRobot: Number(xNew),
          yRobot: Number(yNew),
          direction: directionNew,
        });
        return;
      }
    }
    this.setState({ error: 'A valid command was not inputted'});
    return;
  }

  render() {
    const { xRobot, yRobot, direction, error, report } = this.state;
    return (
      <div className="App">
        <div className="App__board">
          {range(BOARD_LENGTH).map(y => (
            <div key={`column-${y}`} className="App__column">
              {range(BOARD_LENGTH).map(x => (
                <span key={`position-${x}-${y}`} className="App__cell">
                  {x === xRobot && y === yRobot && <span className={classNames({
                    'App__robot--north': direction === 'NORTH',
                    'App__robot--south': direction === 'SOUTH',
                    'App__robot--east': direction === 'EAST',
                    'App__robot--west': direction === 'WEST',
                  })}>→</span>}
                </span>
              ))}
            </div>
          ))}
        </div>
        <input type="text" onChange={this.handleChange} />
        <button onClick={this.handleSubmit}>Submit</button>
        {error && <div className="App__error">{error}</div>}
        {report && (<div className="App__report">
          <div>{report}</div>
        </div>)}
        <style jsx>
          {`
            .App {
              text-align: center;
              font-family: Arial;
            }

            .App__cell {
              display: flex;
              align-items: center;
              justify-content: center;
              height: 50px;
              width: 50px;
              background: salmon;
              border: solid 0.5px white;
              font-size: 20px;
              font-weight: bold;
            }

            .App__column {
              display: flex;
              justify-content: center;
            }

            .App__error {
              color: red;
              margin-top: 12px;
            }

            .App__board {
              display: flex;
              flex-direction: column-reverse;
              margin-bottom: 24px;
            }

            .App__robot--north {
              transform: rotate(-90deg);
            }

            .App__robot--south {
              transform: rotate(90deg);
            }
            
            .App__robot--west {
              transform: rotate(180deg);
            }
          `}
        </style>
      </div>
    );
  } 
}

export default App;
