import {TrainingStore, TrainingModel} from '../../src/components/training-store';
import * as trs from '../../src/components/training-store';

const initialState: TrainingModel[] = trs.initialState();
const trainingStore = new TrainingStore(initialState);
class AssertHelper {
    runned = 0;
    passed = 0;
    failed = 0;
    assert = (assertion) => {
      this.runned++;
      if (assertion) this.passed++;
      else this.failed++;
    }
}


// test addItem
const addItemAssertHelper = new AssertHelper();
const title = 'new item title';
const description = 'new item description';
trainingStore.addItem(title, description);
addItemAssertHelper.assert(trainingStore.state.length === 4);
let newItem = trainingStore.state.slice(-1).pop();
addItemAssertHelper.assert(newItem.title === title);
addItemAssertHelper.assert(newItem.description === description);
console.log(`TrainingStore.addItem -> ${addItemAssertHelper.passed}/${addItemAssertHelper.runned}`);

export let failed = addItemAssertHelper.failed;
export let passed = addItemAssertHelper.passed;
