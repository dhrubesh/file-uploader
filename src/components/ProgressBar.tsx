import React from 'react';
interface file {
  name: string;
  uploaded: boolean;
  percentCompleted: number;
}
interface Props {
  progressFile: file[];
  handleRemove: (file: file) => void;
  active: Array<Number>;
}

const App: React.FC<Props> = props => {
  return (
    <div className="progress-wrapper">
      {props.progressFile.map((el, index) => {
        return (
          props.active.indexOf(index) !== -1 && (
            <div className="progress-child" key={el.name}>
              <div className="perc-text">{el.name}</div>
              <div className="progress-bar">
                <div
                  className="perc"
                  style={{ width: `${el.percentCompleted}%` }}
                />
              </div>
              <div className="perc-text">{el.percentCompleted}%</div>
              <button onClick={() => props.handleRemove(el)}>Cancel</button>
            </div>
          )
        );
      })}
    </div>
  );
};

export default App;
