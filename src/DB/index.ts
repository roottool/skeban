import Dexie from "dexie";

export interface BoardTable {
  id?: number;
  createdTimestamp: number;
  title: string;
  updatedTimestamp: number;
}

export interface ListTable {
  id?: number;
  boardId: number;
  index: number;
  title: string;
}

export interface CardTable {
  id?: number;
  listId: number;
  index: number;
  text: string;
}

type DexieDatabase = { [P in keyof Dexie]: Dexie[P] };
interface SkebanDB extends DexieDatabase {
  boardTable: Dexie.Table<BoardTable, number>;
  listTable: Dexie.Table<ListTable, number>;
  cardTable: Dexie.Table<CardTable, number>;
}

const db = new Dexie("SkebanDB") as SkebanDB;
db.version(1).stores({
  boardTable: "++id, title, createdTimestamp, updatedTimestamp",
  listTable: "++id, boardId, index, title",
  cardTable: "++id, listId, index, text"
});

export default db;
