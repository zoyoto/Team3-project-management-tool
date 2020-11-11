
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import logo from './logo.svg';
import './app.css';

// components imports
import {TrainingStore, TrainingModel} from './components/training-store';
import {TrainingHeader} from './components/training-header';
import {TrainingList} from './components/training-list';

const initialState: TrainingModel[] = [
  /*new TrainingModel('fake training 1', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et.', 1),
  new TrainingModel('fake training 2', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et.', 2),
  new TrainingModel('fake training 3', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et.', 3),
  new TrainingModel('fake training 4', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et.', 1),
  new TrainingModel('fake training 5', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et.', 2),
  new TrainingModel('fake training 6', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et.', 3),
  new TrainingModel('fake training 7', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et.', 1),
  new TrainingModel('fake training 8', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et.', 2),
  new TrainingModel('fake training 9', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et.', 3),
  new TrainingModel('fake training 0', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et.', 1),
*/];

const serverURL = "http://localhost:9000/db/";
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

    handleAdd = (title: string, description: string) => {
        this.state.trainingStore.addItem(title, description, 1);
        createCard(title, description, 1);
        this.forceUpdate();
    }

    handleRemove = (uid: number) => {
        this.state.trainingStore.removeItem(uid);
        this.forceUpdate();
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


    // Render
    render() {
   
        return (

            <div className="App">

                <div className="menu">
                    <button onClick={this.handleMenuHome}>Home</button>
                    <button onClick={this.handleMenuToDo}>To Do</button>
                    <button onClick={this.handleMenuInProgress}>In Progress</button>
                    <button onClick={this.handleMenuDone}>Done</button>
                    <br /><br />
                </div>
                <TrainingHeader onAdd={this.handleAdd} />

                {(()=> {
                    if(layoutStatus == 0) {

                    return (
                        <div className="">

                        <div className="phase-row">
                            <div className="phase-column-to-do"><p>TO DO</p></div>
                            <div className="phase-column-in-progress"><p>IN PROGRESS</p></div>
                            <div className="phase-column-done"><p>DONE</p></div>
                        </div>
                        <div className="phase-row-card">
                            <div className="phase-column-card-to-do">
                            <TrainingList store={this.state.trainingStore} layoutStatus={layoutStatus} phaseStatus={1} onRemove={this.handleRemove} />
                            </div>

                            <div className="phase-column-card-in-progress">
                            <TrainingList store={this.state.trainingStore} layoutStatus={layoutStatus} phaseStatus={2} onRemove={this.handleRemove} />
                            </div>

                            <div className="phase-column-card-done">
                            <TrainingList store={this.state.trainingStore} layoutStatus={layoutStatus} phaseStatus={3} onRemove={this.handleRemove} />
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
                        <TrainingList store={this.state.trainingStore} layoutStatus={layoutStatus} phaseStatus={1} onRemove={this.handleRemove} />
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
                        <TrainingList store={this.state.trainingStore} layoutStatus={layoutStatus} phaseStatus={2} onRemove={this.handleRemove} />
                        <br /><br />
                        </div>
                    );
                    }
                })()}
		
                {(()=> {		
                    if(layoutStatus == 3 ) {
                    return (
                        <div className="Done">
                        <p className="phase-header">DONE</p>
                        <TrainingList store={this.state.trainingStore} layoutStatus={layoutStatus} phaseStatus={3} onRemove={this.handleRemove} />
                        <br /><br />
                        </div>
                    )
                    };
                })()}
            </div>
		);
	}
}

// Get Cards
function readCards() {

    console.log("### Read Cards ###");

    /*let url = serverURL + "read/cards";
     
    http.get(url, function(res){
    
        var data = '';

        res.on('data', function(chunk){
            data += chunk;
        });
        
        res.on('end', function(){
        
            cards = JSON.parse(data);

            // Add Card to Store
            addStore();
            app.forceUpdate();
        });

    }).on('error', function(e){
        console.log("error: ", e);
    });      */
    
    const options = {
     hostname: hostname,
     port: port,
     path: '/db/read/cards',
     method: 'GET'
	}

    const req = http.request(options, res => {
        var data = '';

        res.on('data', function(chunk){
            data += chunk;
        });
        
        res.on('end', function(){
        
            cards = JSON.parse(data);

            // Add Card to Store
            addStore();
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
        initialState.push(new TrainingModel(cards[i]["title"], cards[i]["description"], cards[i]["phaseStatus"]));
	}
}

// Create Card
function createCard(title: string, description: string, phaseStatus: number) {

    console.log("### Create Card ###");

    const postData = querystring.stringify({
        'title': title,
        'description': description,
        'phaseStatus': phaseStatus
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

        res.on('data', (chunk) => {
            //console.log("data " + chunk);
		});

        res.on('end', () => {

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


