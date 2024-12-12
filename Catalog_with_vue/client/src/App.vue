<template>
  <div>
    <input v-model="search" placeholder="Nach Zettel suchen" /> <br />
    <div v-if="selectedZettel" class="edit-container">
      <div class="edit-section">
        <img :src="selectedZettel.img" alt="Zettel Bild" />
        <textarea v-model="selectedZettel.text"></textarea>
        <button @click="saveChanges">Speichern</button>
        <button @click="cancelEdit">Abbrechen</button>
      </div>
      <div class="history-section">
        <h3>Änderungshistorie</h3>
        <ul>
          <li v-for="entry in selectedZettelHistory" :key="entry.id" class="history-entry">
            <div>
              <strong>Datum:</strong> {{ entry.date }}
            </div>
            <div>
              <strong>Text:</strong> {{ entry.description }}
            </div>
            <button @click="applyPreviousVersion(entry.description)">Übernehmen</button>
          </li>
        </ul>
      </div>
    </div>
    <table>
      <tr>
        <th>Image</th>
        <th>Text</th>
        <th>Edit</th>
      </tr>
      <tr v-for="zettel in zettelliste" :key="zettel.id">
        <td><img :src="zettel.img" /></td>
        <td v-html="zettel.text"></td>
        <td><button @click="edit(zettel)">Edit</button></td>
      </tr>
    </table>
  </div>
</template>

<style>
strong {
  font-weight: bold;
}
input {
  width: 100%;
  padding: 12px 16px;
  margin: 16px 0;
  box-sizing: border-box;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: box-shadow 0.3s ease-in-out, border-color 0.3s ease-in-out;
}

.edit-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;
}

.edit-section {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.edit-section img {
  width: 200px;
  height: auto;
}

textarea {
  flex: 1;
  min-height: 100px;
  padding: 8px;
}

table {
  width: 80vw;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

img {
  width: 500px;
  height: auto;
}

button {
  padding: 8px 16px;
  margin: 8px 4px;
}

.history-section {
  margin-top: 16px;
}

.history-entry {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 8px;
}
</style>

<script>

import { searchZettel, edit, loadHistory, cancelEdit, saveChanges, applyPreviousVersion } from '@/api.js';

export default {
  data() {
    return {
      search: "",
      zettelliste: [
        { id: 1, img: "https://placehold.co/600x400", text: "text1" },
        { id: 2, img: "https://placehold.co/600x400", text: "text2" },
        { id: 3, img: "https://placehold.co/600x400", text: "text3" },
      ],
      selectedZettel: null,
      selectedZettelHistory: [],
    };
  },
  methods: {
    searchZettel,
    edit,
    loadHistory,
    cancelEdit,
    saveChanges,
    applyPreviousVersion,
  },
  watch: {
    search(val) {
      this.searchZettel(val);
    },
  },
};
</script>
