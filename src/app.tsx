export function __reload(m) { if (m.app.state) app.setState(m.app.state); }

// style imports
import './app.css!';
// lib imports
import * as React from 'react';
import * as ReactDOM from 'react-dom';

// components imports
import {TrainingStore, TrainingModel} from './components/training-store';
import {TrainingHeader} from './components/training-header';
import {TrainingList} from './components/training-list';

const initialState: TrainingModel[] = [
  new TrainingModel(0, 'Task 1', 'Design a new function.', 'Person 1', '100', '12', ''),
  new TrainingModel(1, 'Task 2', 'Develop a new function.', 'Person 2', '200', '30', 'Task 1'),
  new TrainingModel(2, 'Task 3', 'Test a new function.', 'Person 3', '100', '10', 'Task 2')
];

interface IState {
  trainingStore: TrainingStore;
}

export class App extends React.Component<{}, {}> {
  state: IState = {
    trainingStore: new TrainingStore(initialState)
  };

  handleAdd = (title: string, description: string, people: string, budget: number, duration: number, predecessor: string) => {
    this.state.trainingStore.addItem(title, description, people, budget, duration, predecessor);
    this.forceUpdate();
  }

  handleRemove = (uid: number) => {
    this.state.trainingStore.removeItem(uid);
    this.forceUpdate();
  }

  handleUpload = (modelStr: any) => {
    this.state.trainingStore.uploadItem(modelStr);
    this.forceUpdate();
  }

  render() {
    return (
      <div className="container">
        <TrainingHeader onAdd={this.handleAdd} onUpload={this.handleUpload} />
        <TrainingList store={this.state.trainingStore} onRemove={this.handleRemove} />
      </div>
    );
  }
}

export let app: any = ReactDOM.render(<App />, document.getElementById('app-container'));