import * as React from 'react';
import * as ReactDOM from 'react-dom';

import GanttChart from "./components/gantt-chart";


import logo from './logo.svg';
import './app.css';

// components imports
import {TrainingStore, TrainingModel} from './components/training-store';
import {TrainingHeader} from './components/training-header';
import {TrainingList} from './components/training-list';

const initialState: TrainingModel[] = [];

const http = require("http");
const querystring = require('querystring');

let app;


const hostname = "localhost";
const port = 9000;

let layoutStatus = 0;
let cards;

interface IState {
    trainingStore: TrainingStore;
}


class App extends React.Component<{}, {}> {

    constructor(props) {
        super(props);
        app = this;
	}

    state: IState = {
        trainingStore: new TrainingStore(initialState)
    };

    handleForceUpdate = () => {
        this.forceUpdate();
    }

    handleAdd = (title: string, description: string, people: string, budget: number, duration: number, predecessor: string) => {
        createCard(title, description, 1, people, budget, duration, predecessor);
        //this.forceUpdate();
    }

    handleRemove = (uid: string) => {
        //this.state.trainingStore.removeItem(uid);
        deleteCard(uid);
        //this.forceUpdate();
    }

  
    // Menu
    handleMenuHome = () => {
        layoutStatus = 0;
        this.forceUpdate();
    }

    handleMenuToDo = () => {
        layoutStatus = 1;
        this.forceUpdate();
    }

    handleMenuInProgress = () => {
        layoutStatus = 2;
        this.forceUpdate();
    }

    handleMenuDone = () => {
        layoutStatus = 3;
        this.forceUpdate();
    }

    handleMenuGanttChart = () => {
        layoutStatus = 4;
        this.forceUpdate();
    }

    // Render
    render() {
   
        return (
            <div className="App">

                <div className="menu">
                    <button className="button is-primary" onClick={this.handleMenuHome}>Home</button>
                    <button className="button is-danger" onClick={this.handleMenuToDo}>To Do</button>
                    <button className="button is-warning" onClick={this.handleMenuInProgress}>In Progress</button>
                    <button className="button is-success" onClick={this.handleMenuDone}>Done</button>
                    <br /><br />
                </div>

                <button className="menu-gantt-chart" onClick={this.handleMenuGanttChart}>Gantt Chart</button> 


                <TrainingHeader onAdd={this.handleAdd} />

                {(()=> {
                    if(layoutStatus == 0) {

                        return (
                            <div className="">

                                <div className="phase-row">
                                    <div className="phase-column-to-do">
                                        <p>TO DO</p>
                                        <div className="phase-row-card">
                                            <div className="phase-column-card-to-do">                        
                                                <TrainingList store={this.state.trainingStore} layoutStatus={layoutStatus} phaseStatus={1} onRemove={this.handleRemove} onForceUpdate={this.handleForceUpdate} />
                                            </div>
                                        </div>                       
                                    </div>

                                    <div className="phase-column-in-progress">
                                        <p>IN PROGRESS</p>
                                        <div className="phase-row-card">
                                            <div className="phase-column-card-in-progress">
                                                <TrainingList store={this.state.trainingStore} layoutStatus={layoutStatus} phaseStatus={2} onRemove={this.handleRemove} onForceUpdate={this.handleForceUpdate} />
                                            </div>
                                        </div>                   
                                    </div>
                            
                                    <div className="phase-column-done">
                                        <p>DONE</p>                         
                                        <div className="phase-row-card">                      
                                            <div className="phase-column-card-done">
                                                <TrainingList store={this.state.trainingStore} layoutStatus={layoutStatus} phaseStatus={3} onRemove={this.handleRemove} onForceUpdate={this.handleForceUpdate} />
                                            </div>
                                        </div>                      
                                    </div>
                                </div>          
                            </div>
                        );
                    }
                })()}

                {(()=> {
                    if(layoutStatus == 1) {
                        return (
                            <div className="ToDo">
                            <p className="phase-header">TO DO</p>
                            <TrainingList store={this.state.trainingStore} layoutStatus={layoutStatus} phaseStatus={1} onRemove={this.handleRemove} onForceUpdate={this.handleForceUpdate} />
                            <br /><br />
                            </div>
                        );
                    }
                })()}
		
                {(()=> {
                    if(layoutStatus == 2) {
                        return (
                            <div className="InProgress">
                            <p className="phase-header">IN PROGRESS</p>
                            <TrainingList store={this.state.trainingStore} layoutStatus={layoutStatus} phaseStatus={2} onRemove={this.handleRemove} onForceUpdate={this.handleForceUpdate} />
                            <br /><br />
                            </div>
                        );
                    }
                })()}
		
                {(()=> {		
                    if(layoutStatus == 3) {
                        return (
                            <div className="Done">
                            <p className="phase-header">DONE</p>
                            <TrainingList store={this.state.trainingStore} layoutStatus={layoutStatus} phaseStatus={3} onRemove={this.handleRemove} onForceUpdate={this.handleForceUpdate} />
                            <br /><br />
                            </div>
                        );
                    }
                })()}

                {(()=> {
                    if(layoutStatus == 4) {
                        return (
                            <div className="GanttChart">
                            <p className="phase-header">Gantt Chart</p>
                            <GanttChart />
                            </div>
                        );
                    }
                })()}

                
            </div>
		);
	}
}

// Get Cards
function readCards() {

    console.log("### Read Cards ###");

    const options = {
     hostname: hostname,
     port: port,
     path: '/db/read/cards',
     method: 'GET'
	}

    const req = http.request(options, res => {
        let data = '';

        res.on('data', function(chunk){
            data += chunk;
        });
        
        res.on('end', function(){
        
            cards = JSON.parse(data);

            // Add Card to Store
            addStore();

                console.log(cards)

            app.forceUpdate();
        });
	});
    
    req.on('error', function(err) {
       console.log("error: ", err);
    });  

    req.end();
}

// Add Card to Store
function addStore() {

    console.log("### Add to Store ###");

    for(const i in cards) {
        initialState.push(new TrainingModel(cards[i]["_id"], cards[i]["title"], cards[i]["description"], cards[i]["phaseStatus"], cards[i]["people"], cards[i]["budget"], cards[i]["duration"], cards[i]["predecessor"] ));
    }
}

// Create Card
function createCard(title: string, description: string, phaseStatus: number, people: string, budget: number, duration: number, predecessor: string) {

    console.log("### Create Card ###");

    const postData = querystring.stringify({
        'title': title,
        'description': description,
        'phaseStatus': phaseStatus,
        'people': people,
        'budget': budget,
        'duration': duration,
        'predecessor': predecessor
	});
     
    const options = {
        hostname: hostname,
        port: port,
        path: '/db/create/card',
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
            //console.log("data " + chunk);
            data += chunk;
		});

        res.on('end', () => {

        let jsonData = JSON.parse(data);
            app.state.trainingStore.addItem(jsonData["_id"], jsonData["title"], jsonData["description"], 1, jsonData["people"], jsonData["budget"], jsonData["duration"], jsonData["predecessor"]);
            app.forceUpdate();
		});
	});

    req.on('error', (err) => {
        console.log("error: ", err);
    });

    req.write(postData);
    req.end();
}

// Delete Card
function deleteCard(uid: string) {

    console.log("### Delete Card ###");

    const postData = querystring.stringify({
        'uid': uid
	});
     
    const options = {
        hostname: hostname,
        port: port,
        path: '/db/delete/card',
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
            app.state.trainingStore.removeItem(uid);
            app.forceUpdate(); 
		});
	});

    req.on('error', (err) => {
        console.log("error: ", err);
    });

    req.write(postData);
    req.end();
}

readCards();

export default App;


