import * as React from 'react';
import {TrainingStore, TrainingModel} from './training-store';

const http = require("http");
const querystring = require('querystring');

const hostname = "localhost";
const port = 9000;

let component;

interface IProps {
  data: TrainingModel;
  onRemove: any;
  onEdit: any;

  onForceUpdate: any;

  layoutStatus: number;
  phaseStatus: number;
}

interface IState {
  isEditMode?: boolean;
}

export class TrainingItem extends React.Component<IProps, {}> {

  constructor(props) {
    super(props);
    component = this;
  }

  state: IState = {
    isEditMode: false
  };


  descriptionRef: HTMLTextAreaElement;
  initDescriptionRef = (ref) => this.descriptionRef = ref;

  titleRef: HTMLInputElement;
  initTitleRef = (ref) => this.titleRef = ref;

  peopleRef: HTMLInputElement;
  initPeopleRef = (ref) => this.peopleRef = ref;

  budgetRef: HTMLInputElement;
  initBudgetRef = (ref) => this.budgetRef = ref;

  durationRef: HTMLInputElement;
  initDurationRef = (ref) => this.durationRef = ref;

  predecessorRef: HTMLInputElement;
  initPredecessorRef = (ref) => this.predecessorRef = ref;


  handleForceUpdate = (uid: string, phaseStatus: number) => {

    this.forceUpdate();
    this.props.onForceUpdate();

  }

  handleRemove = (): void => {
    this.props.onRemove(this.props.data.uid);
  }

  handleEdit = (): void => {
    this.setState({ isEditMode: !this.state.isEditMode });
  }

  handleSave = (): void => {

    this.props.onEdit(this.props.data.uid, this.titleRef.value, this.descriptionRef.value, this.peopleRef.value, Number(this.budgetRef.value), Number(this.durationRef.value), this.predecessorRef.value);
    updateCard(this.props.data.uid, this.titleRef.value, this.descriptionRef.value, this.peopleRef.value, Number(this.budgetRef.value), Number(this.durationRef.value), this.predecessorRef.value);

    this.setState({ isEditMode: false });
  }

  handleCancel = (): void => {
    this.titleRef.value = this.props.data.title;
    this.descriptionRef.value = this.props.data.description;
    this.peopleRef.value = this.props.data.people;
    this.budgetRef.value = this.props.data.budget.toString();
    this.durationRef.value = this.props.data.duration.toString();
    this.predecessorRef.value = this.props.data.predecessor;
    this.setState({ isEditMode: false });
  }

  handleChangeToToDo = (): void => {
    this.props.data.itemStatus = 1;
    updateCardPhase(this.props.data.uid, 1);
  }

  handleChangeToInProgress = (): void => {
    this.props.data.itemStatus = 2;
    updateCardPhase(this.props.data.uid, 2);
  }

  handleChangeToDone = (): void => {
    this.props.data.itemStatus = 3;
    updateCardPhase(this.props.data.uid, 3);
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

                    <p className="card-header-title">
                        <input ref={this.initPeopleRef} type="text"
                            className={'input is-large editable ' + (this.state.isEditMode ? '' : 'readonly') }
                            defaultValue={this.props.data.people} readOnly={!this.state.isEditMode}
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
		
                    <p className="card-header-title">
                        Duration(days): <input ref={this.initDurationRef} type="number"
                            className={'input is-large editable ' + (this.state.isEditMode ? '' : 'readonly') }
                            defaultValue={this.props.data.duration} readOnly={!this.state.isEditMode}
                        />
                    </p>
                    <p className="card-header-title">
                        Budget($): <input ref={this.initBudgetRef} type="number"
                            className={'input is-large editable ' + (this.state.isEditMode ? '' : 'readonly') }
                            defaultValue={this.props.data.budget} readOnly={!this.state.isEditMode}
                        />
                    </p>
                    <p className="card-header-title">
                        Predecessor: <input ref={this.initPredecessorRef} type="text"
                            className={'input is-large editable ' + (this.state.isEditMode ? '' : 'readonly') }
                            defaultValue={this.props.data.predecessor} readOnly={!this.state.isEditMode}
                        />
                    </p>
                
                     
                     {(()=> { 
                         if(this.props.layoutStatus == 0) {
                            return (
                                <footer className="card-footer">
                                    <div className="card-footer-item">
                                        <a className="button is-info is-fullwidth" onClick={this.state.isEditMode ? this.handleSave : this.handleEdit} >{this.state.isEditMode ? 'Save' : 'Edit'}</a>
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


// Update Card
function updateCard(uid: string, title: string, description: string, people: string, budget: number, duration: number, predecessor: string) {

    console.log("### Update Card ###");

    const postData = querystring.stringify({
        'uid': uid,
        'title': title,
        'description': description,
        'people': people,
        'budget': budget,
        'duration': duration,
        'predecessor': predecessor
	});
     
    const options = {
        hostname: hostname,
        port: port,
        path: '/db/update/card',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
		}
	};
   
    const req = http.request(options, (res) => {
        res.setEncoding('utf8');

        let data = "";
        res.on('data', (chunk) => {
            data += chunk;
		});

        res.on('end', () => {

        let jsonData = JSON.parse(data);
            //component.handleForceUpdate();
		});
	});

    req.on('error', (err) => {
        console.log("error: ", err);
    });

    req.write(postData);
    req.end();
}

// Update Card Phase
function updateCardPhase(uid: string, phaseStatus:number) {

    console.log("### Update Card Phase ###");

    const postData = querystring.stringify({
        'uid': uid,
        'phaseStatus': phaseStatus
	});
     
    const options = {
        hostname: hostname,
        port: port,
        path: '/db/update/card_phase',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
		}
	};
   
    const req = http.request(options, (res) => {
        res.setEncoding('utf8');

        let data = "";
        res.on('data', (chunk) => {
            data += chunk;
		});

        res.on('end', () => {

        let jsonData = JSON.parse(data);
            component.handleForceUpdate(jsonData["_id"], jsonData["phaseStatus"]);
		});
	});

    req.on('error', (err) => {
        console.log("error: ", err);
    });

    req.write(postData);
    req.end();
}