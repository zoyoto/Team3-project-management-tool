import * as React from 'react';
import {observable, computed} from 'mobx';
import {observer} from 'mobx-react';

import {TrainingStore, TrainingModel} from './training-store';

let phaseStatus = 0;


interface IProps {
  onAdd: (title: string, description: string, people: string, budget: number, duration: number, predecessor: string) => any;
}

interface IState {
}


@observer
export class TrainingHeader extends React.Component<IProps, IState> {

  @observable title: string = '';
  @observable description: string = '';
  @observable people: string = '';
  @observable budget: number = 0;
  @observable duration: number = 0;
  @observable predecessor: string = '';
  @observable modalIsActive: boolean = false;
  @computed get addButtonIsDisabled() {
    return this.title === '' || this.description === '' || this.people === '' || this.predecessor === '' || this.budget === 0 || this.duration === 0;
  };
  
  handleAdd = () => {
    this.props.onAdd(this.title, this.description, this.people, this.budget, this.duration, this.predecessor);
    this.toggleModal();
  }

  handleChangeTitle = (event) => {
	this.title = event.target.value;
	this.forceUpdate();
  }

  handleChangeDescription = (event) => {
    this.description = event.target.value;
	this.forceUpdate();
  }

  handleChangePeople = (event) => {
    this.people = event.target.value;
    this.forceUpdate();

  }

  handleChangeBudget = (event) => {
    this.budget = event.target.value;	
    this.forceUpdate();
  }

  handleChangeDuration = (event) => {
    this.duration = event.target.value;	
    this.forceUpdate();
  }

  handleChangePredecessor = (event) => {
    this.predecessor = event.target.value;
    this.forceUpdate();
  }
  
  toggleModal = () => {
    this.modalIsActive = !this.modalIsActive;
    this.resetForm();
	this.forceUpdate();
  }

  resetForm = () => {
    this.title = this.description = this.people = this.predecessor = '';
    this.budget = this.duration = 0;
  }

  render() {
    let modalIsActiveClass = this.modalIsActive ? ' is-active' : '';

    return (
      <div className="">
		
        <p className="control">
          <button type="button" className="button is-primary is-large is-fullwidth"
            onClick={this.toggleModal}>Add New</button>
        </p>

        <div className={'modal' + modalIsActiveClass}>
          <div className="modal-background" onClick={this.toggleModal}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Project Management Tool</p>
            </header>
            <section className="modal-card-body">
              <p className="control">
                <label htmlFor="title" className="label">Title</label>
                <input id="title" className="input" type="text"
                  value={this.title} onChange={this.handleChangeTitle} />			
              </p>

              <p className="control">
                <label htmlFor="people" className="label">People</label>
                <input id="people" className="input" type="text"
                  value={this.people} onChange={this.handleChangePeople} />
              </p>

              <p className="control">
                <label htmlFor="description" className="label">Description</label>
                <textarea id="description" className="textarea"
                  value={this.description} onChange={this.handleChangeDescription}></textarea>
              </p>

              <p className="control">
                <label htmlFor="duration" className="label">Duration</label>
                <input id="duration" className="input" type="number"
                  value={this.duration} onChange={this.handleChangeDuration} />
              </p>

              <p className="control">
                <label htmlFor="budget" className="label">Budget</label>
                <input id="budget" className="input" type="number"
                  value={this.budget} onChange={this.handleChangeBudget} />
              </p>

              <p className="control">
                <label htmlFor="predecessor" className="label">Predecessor</label>
                <input id="predecessor" className="input" type="text"
                  value={this.predecessor} onChange={this.handleChangePredecessor} />
              </p>

            </section>
            <footer className="modal-card-foot">
              <button className="button is-primary"
                onClick={this.handleAdd} disabled={this.addButtonIsDisabled}>Add New</button>
              <button className="button is-link" onClick={this.toggleModal}>Cancel</button>
            </footer>
          </div>
          <button className="modal-close" onClick={this.toggleModal}></button>
        </div>
      </div>
    );
  }
};

