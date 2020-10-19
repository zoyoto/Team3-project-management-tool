import * as fs from 'fs-extra';
import * as path from 'path';

const outDir = path.resolve(`$(__dirname)`,'../outDir/');
const fPath = outDir+"\\"+"training";

export class TrainingStore {
  constructor(initialState: TrainingModel[]) {
    this.state = initialState;
  }
  state: TrainingModel[];

  addItem = (title: string, description: string) => {
    let newItem = new TrainingModel(this.state.length++,title, description);
    this.state.push(newItem);
    fs.writeFileSync(fPath,JSON.stringify(this.state));
  }

  editItem = (uid: number, title: string, description: string) => {
    let existingItem = this.state.find(item => item.uid === uid);
    if (existingItem == null) return;
    existingItem.title = title;
    existingItem.description = description;
    fs.writeFileSync(fPath,JSON.stringify(this.state));
  }

  removeItem = (uid: number) => {
    let newState = this.state.filter((item) => item.uid !== uid);
    this.state = newState;
    fs.writeFileSync(fPath,JSON.stringify(this.state));
  }
}

export class TrainingModel {
  uid: number;
  title: string;
  description: string;
  constructor(uid: number,title: string, description: string) {
    this.uid = uid;
    this.title = title;
    this.description = description;
  }
}

export function initialState() :TrainingModel[]{
  let buf: TrainingModel[] = [];
  fs.readFile(fPath, "utf8", function (err, data) {
    buf = initial(data);
  });
  return buf;
}

function initial(content: string):TrainingModel[]{
  let buf: TrainingModel[] = [];

  let sp: string[] = content.split("\n");
  if (sp.length <= 1) {
    buf= [
    new TrainingModel(1,'fake training 1', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et.'),
    new TrainingModel(2,'fake training 2', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et.'),
    new TrainingModel(3,'fake training 3', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et.')]
    return buf;
  }

  for (let i: number = 1; i < sp.length; i++) {
      let text: string = sp[i];
      if (text && text.length > 0) {
          var model = JSON.parse(text);
          buf.push(model);
      }
  }
  return buf;
}