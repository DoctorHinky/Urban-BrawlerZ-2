import { createSlice } from "@reduxjs/toolkit";

export const selectionSlice = createSlice({
  name: "selection",
  initialState: {
    player1: { selectedMap: null, selectedChar: null, ready: false },
    player2: { selectedMap: null, selectedChar: null, ready: false },
  },
  reducers: {
    selectMap: (state, action) => {
      const { player, map } = action.payload;
      state[player].selectedMap = map;
    },
    selectCharacter: (state, action) => {
      const { player, character } = action.payload;
      state[player].selectedChar = character;
    },
    setReady: (state, action) => {
      const { player, ready } = action.payload;
      state[player].ready = ready;
    },
  },
});

export const { selectMap, selectCharacter, setReady } = selectionSlice.actions;

export default selectionSlice.reducer;
