import * as React from 'react';
import {TrainingStore, TrainingModel} from './training-store';
import {TrainingItem} from './training-item';

interface IProps {
  store: TrainingStore;
  onRemove: any;

  layoutStatus: number;
  phaseStatus: number;
}

export class TrainingList extends React.Component<IProps, {}> {
  render() {
    let trainings = this.props.store.state;
    return (
      <div className="">
        <div className="columns is-multiline">
          { trainings.map((trainingModel) =>
            <TrainingItem key={trainingModel.uid} data={trainingModel} layoutStatus={this.props.layoutStatus} phaseStatus={this.props.phaseStatus} onRemove={this.props.onRemove} onEdit={this.props.store.editItem}/>) }
        </div>
      </div>
    );
  }
};
