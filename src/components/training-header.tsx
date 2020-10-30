import * as React from 'react';
import {observable, computed} from 'mobx';
import {observer} from 'mobx-react';

interface IProps {
  onAdd: (title: string, description: string, poeple: string) => any;
  onUpload: (modelStr: any) => any;
}

interface IState {
}

@observer
export class TrainingHeader extends React.Component<IProps, IState> {
  @observable title: string = '';
  @observable description: string = '';
  @observable people: string = '';
  @observable modalIsActive: boolean = false;
  @computed get addButtonIsDisabled() {
    return this.title === '' || this.description === '' || this.people === '';
  };

  handleAdd = () => {
    this.props.onAdd(this.title, this.description, this.people);
    this.toggleModal();
  }

  handleChangeTitle = (event) => {
    this.title = event.target.value;
  }

  handleChangePeople = (event) => {
    this.people = event.target.value;
  }

  handleChangeDescription = (event) => {
    this.description = event.target.value;
  }

  toggleModal = () => {
    this.modalIsActive = !this.modalIsActive;
    this.resetForm();
  }

  resetForm = () => {
    this.title = this.description = this.people = '';
  }

  importFile = (event) => {
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsText(event.target.files[0]);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
      }).then(
        data => {
          if(data!=null){
            this.props.onUpload(data);
          }
        }
    );
  }
  

  render() {
    let modalIsActiveClass = this.modalIsActive ? ' is-active' : '';

    return (
      <div className="">
        <p className="control">
          <button type="button" className="button is-primary is-large is-fullwidth"
            onClick={this.toggleModal}>Add New</button>
          <input type="file" name="file" className="button is-link" id="fileField" onChange={this.importFile}/>
        </p>

        <div className={'modal' + modalIsActiveClass}>
          <div className="modal-background" onClick={this.toggleModal}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Software Management Tool</p>
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
            </section>
            <footer className="modal-card-foot">
              <button className="button is-primary"
                onClick={this.handleAdd} disabled={this.addButtonIsDisabled}>Add New</button>
              <button className="button is-link" onClick={this.toggleModal}>Cancel</button>
            </footer>
          </div>
          <button className="modal-close"></button>
        </div>
      </div>
    );
  }
};
