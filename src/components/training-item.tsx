import * as React from 'react';
import {TrainingStore, TrainingModel} from './training-store';

interface IProps {
  data: TrainingModel;
  onRemove: any;
  onEdit: any;

  layoutStatus: number;
  phaseStatus: number;
}

interface IState {
  isEditMode?: boolean;
}

export class TrainingItem extends React.Component<IProps, {}> {
  state: IState = {
    isEditMode: false
  };

  descriptionRef: HTMLTextAreaElement;
  initDescriptionRef = (ref) => this.descriptionRef = ref;
  titleRef: HTMLInputElement;
  initTitleRef = (ref) => this.titleRef = ref;

  handleRemove = (): void => {
    this.props.onRemove(this.props.data.uid);
  }

  handleEdit = (): void => {
    this.setState({ isEditMode: !this.state.isEditMode });
  }

  handleSave = (): void => {
    this.props.onEdit(this.props.data.uid, this.titleRef.value, this.descriptionRef.value);
    this.setState({ isEditMode: false });
  }

  handleCancel = (): void => {
    this.titleRef.value = this.props.data.title;
    this.descriptionRef.value = this.props.data.description;
    this.setState({ isEditMode: false });
  }

  handleChangeToToDo = (): void => {
  
  }

  handleChangeToInProgress = (): void => {
  
  }

  handleChangeToDone = (): void => {
  
  }

  render() {

    let itemStatus = this.props.data.itemStatus;

    return (
      <div className="">
        {(()=> {
          if (this.props.phaseStatus == itemStatus) {
            return (
              <div className="column">
                <div className="card is-fullwidth">
                  <header className="card-header">
                    <p className="card-header-title">
                      <input ref={this.initTitleRef} type="text"
                        className={'input is-large editable ' + (this.state.isEditMode ? '' : 'readonly') }
                        defaultValue={this.props.data.title} readOnly={!this.state.isEditMode}
                      />
                    </p>
                  </header>

                  <section className="card-content">
                    <p className="card-header-title">
                      <textarea ref={this.initDescriptionRef}
                        className={'textarea editable ' + (this.state.isEditMode ? '' : 'readonly') }
                        defaultValue={this.props.data.description} readOnly={!this.state.isEditMode}
                      />
                    </p>
		
                
                     
                     {(()=> { 
                         if(this.props.layoutStatus == 0) {
                            return (
                                <footer className="card-footer">
                                    <div className="card-footer-item">
                                        <a className="button is-primary is-fullwidth" onClick={this.state.isEditMode ? this.handleSave : this.handleEdit} >{this.state.isEditMode ? 'Save' : 'Edit'}</a>
                                    </div>
                            
                                    <div className="card-footer-item">
                                         <a className="button is-danger is-fullwidth" onClick={this.state.isEditMode ? this.handleCancel : this.handleRemove}>{this.state.isEditMode ? 'Cancel' : 'Remove'}</a>
                                    </div>
                                </footer>
                            );
                        } else if(this.props.layoutStatus == 1) {
                            return (
                                <footer className="card-footer">
                                    <div className="card-footer-item">
                                        <a className="button is-warning is-fullwidth" onClick={this.handleChangeToInProgress}>In Progress?</a>
                                    </div>
                                </footer>
                            );
                        } else if(this.props.layoutStatus == 2) {
                            return (
                                <footer className="card-footer">
                                    <div className="card-footer-item">
                                        <a className="button is-danger is-fullwidth" onClick={this.handleChangeToToDo}>To Do?</a>
                                    </div>
                            
                                    <div className="card-footer-item">
                                        <a className="button is-success is-fullwidth" onClick={this.handleChangeToDone}>Done?</a>
                                    </div>
                                </footer>
                            );

                        } else if(this.props.layoutStatus == 3) {
                            return (
                                <footer className="card-footer">
                                    <div className="card-footer-item">
                                        <a className="button is-warning is-fullwidth"onClick={this.handleChangeToInProgress}>In Progress?</a>
                                    </div>                          
                                </footer>
                            );
                        }
                      })()}
                        
                      
                   
                  </section>
                </div>
              </div>
            )
          } else {
            return null;
          }
        })()}
       </div>
    )
  }
};