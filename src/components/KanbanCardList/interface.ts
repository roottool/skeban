import { DraggableId, DraggableLocation } from "react-beautiful-dnd";

export interface CardListState {
  filename: string;
}

export interface CardListData {
  title: string;
  data: CardListState[];
}

type Unbox<T> = T extends { [K in keyof T]: infer U } ? U : never;

export interface MovedCardData {
  draggableId: DraggableId;
  draggableIndex: Unbox<Pick<DraggableLocation, "index">>;
  droppableId: Unbox<Pick<DraggableLocation, "droppableId">>;
}

export interface RemoveCardData {
  draggableId: DraggableId;
  sourceCardList: Unbox<Pick<DraggableLocation, "droppableId">>;
}
