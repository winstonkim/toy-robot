import React from 'react';
import { range } from 'lodash';

import './App.css';

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
    if (!xRobot && !yRobot && command.split(' ')[0] !== 'PLACE') {
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
      const xNew = Number(placementPosition[0]);
      const yNew = Number(placementPosition[1]);
      const directionNew = placementPosition[2];

      if (xNew && yNew && directionNew && xNew > -1 && xNew < 5 && yNew > -1 && yNew < 5 && ['NORTH', 'EAST', 'SOUTH', 'WEST'].indexOf(directionNew) > -1) {
        this.setState({
          xRobot: xNew,
          yRobot: yNew,
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
            <div key={`column-${y}`}>
              {range(BOARD_LENGTH).map(x => (
                <span key={`position-${x}-${y}`}>{x === xRobot && y === yRobot ? direction[0] : 0}</span>
              ))}
            </div>
          ))}
        </div>
        <input type="text" onChange={this.handleChange} />
        <button onClick={this.handleSubmit}>Submit</button>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {report && (<div className="App__report">
          <h2>Report</h2>
          <div>{report}</div>
        </div>)}
      </div>
    );
  } 
}

export default App;
