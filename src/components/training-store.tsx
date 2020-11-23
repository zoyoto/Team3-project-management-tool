export class TrainingStore {
  constructor(initialState: TrainingModel[]) {
    this.state = initialState;
  }
  state: TrainingModel[];

  addItem = (uid: string, title: string, description: string, phaseStatus: number, people: string, budget: number, duration: number, predecessor: string) => {
    let newItem = new TrainingModel(uid, title, description, phaseStatus, people, budget, duration, predecessor);

    this.state.push(newItem);
  }
      
  editItem = (uid: string, title: string, description: string, people: string, budget: number, duration: number, predecessor: string) => {
    let existingItem = this.state.find(item => item.uid === uid);
    if (existingItem == null) return;

    existingItem.title = title;
    existingItem.description = description;
    existingItem.people = people;
    existingItem.budget = budget;
    existingItem.duration = duration;
    existingItem.predecessor = predecessor;
  }

  removeItem = (uid: string) => {
    let newState = this.state.filter((item) => item.uid !== uid);
    this.state = newState;
  }
}

//let uidIterator = 0;

export class TrainingModel {
  //uid: number = uidIterator++;
  uid: string;
  title: string;
  description: string;
  itemStatus: number;
  people: string;
  budget: number;
  duration: number;
  predecessor: string;

  constructor(uid: string, title: string, description: string, itemStatus: number, people: string, budget: number, duration: number, predecessor: string) {
    this.uid = uid;
    this.title = title;
    this.description = description;
    this.itemStatus = itemStatus;
    this.people = people;
    this.budget = budget;
    this.duration = duration;
    this.predecessor = predecessor;
  }
}