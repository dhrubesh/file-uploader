import React from 'react';
interface Props {
  percentage: number;
}

const App: React.FC<Props> = props => {
  return <div className="perc">{props.percentage}</div>;
};

export default App;
