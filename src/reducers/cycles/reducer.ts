import { Actiontypes } from "./actions";
import { produce } from "immer";

export interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

interface CyclesState {
  cycles: Cycle[];
  activeStatusId: string | null;
}

export function cyclesReducer(state: CyclesState, action: any) {
  switch (action.type) {
    case Actiontypes.ADD_NEW_CYCLE:
      return produce(state, (draft) => {
        draft.cycles.push(action.payload.newCycle);
        draft.activeStatusId = action.payload.newCycle.id;
      });
    case Actiontypes.INTERRUPT_CURRENT_CYCLE: {
      const currentCycleIndex = state.cycles.findIndex((cycle) => {
        return cycle.id === state.activeStatusId;
      });
      if (currentCycleIndex < 0) {
        return state;
      }
      return produce(state, (draft) => {
        draft.activeStatusId = null;
        draft.cycles[currentCycleIndex].interruptedDate = new Date()
      });
    }

    case Actiontypes.MARK_CURRENT_CYCLE_AS_FINISHED: {
        const currentCycleIndex = state.cycles.findIndex((cycle) => {
          return cycle.id === state.activeStatusId;
        });
        if (currentCycleIndex < 0) {
          return state;
        }
        return produce(state, (draft) => {
          draft.activeStatusId = null;
          draft.cycles[currentCycleIndex].finishedDate = new Date()
        });
      }
    default:
      return state;
  }
}
