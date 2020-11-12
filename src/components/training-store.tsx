export class TrainingStore {
  constructor(initialState: TrainingModel[]) {
    this.state = initialState;
  }
  state: TrainingModel[];

  addItem = (uid: string, title: string, description: string, phaseStatus: number) => {
    let newItem = new TrainingModel(uid, title, description, phaseStatus);

    this.state.push(newItem);
  }
      
  editItem = (uid: string, title: string, description: string) => {
    let existingItem = this.state.find(item => item.uid === uid);
    if (existingItem == null) return;

    existingItem.title = title;
    existingItem.description = description;
  }

  removeItem = (uid: string) => {
    let newState = this.state.filter((item) => item.uid !== uid);
    this.state = newState;
  }
}

let uidIterator = 0;

export class TrainingModel {
  //uid: number = uidIterator++;
  uid: string;
  title: string;
  description: string;
  itemStatus: number;

  constructor(uid: string, title: string, description: string, itemStatus: number) {
    this.uid = uid;
    this.title = title;
    this.description = description;
    this.itemStatus = itemStatus;
  }
}