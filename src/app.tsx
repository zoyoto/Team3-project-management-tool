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
  new TrainingModel(0, 'Task 1', 'Create a new function.', 'Person 1'),
  new TrainingModel(1, 'Task 2', 'Improve the performance.', 'Person 2'),
  new TrainingModel(2, 'Task 3', 'Finish writing software documentation.', 'Person 3')
];

interface IState {
  trainingStore: TrainingStore;
}

export class App extends React.Component<{}, {}> {
  state: IState = {
    trainingStore: new TrainingStore(initialState)
  };

  handleAdd = (title: string, description: string, people: string) => {
    this.state.trainingStore.addItem(title, description, people);
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
