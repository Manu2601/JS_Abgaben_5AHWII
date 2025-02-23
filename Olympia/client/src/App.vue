<template>
  <div id="app">
    <h1>Olympische Medaillen Dashboard</h1>

    <div class="selector">
      <label for="region">Wähle ein Land:</label>
      <select v-model="selectedRegion" @change="fetchMedalData">
        <option v-for="region in regions" :key="region" :value="region">{{ region }}</option>
      </select>
    </div>

    <!-- Bestehende Komponenten -->
    <MedalsForRegion v-if="selectedRegion" :region="selectedRegion" />
    <MedalsOverTime v-if="selectedRegion" :noc="selectedRegion" />
    <MedalsByGender />
    <TopSports />
    <MedalsByAge />

    <MedalsByCountry :medalData="medalData" />

  </div>
</template>

<script>
import axios from "axios";
import MedalsOverTime from "./components/MedalsOverTime.vue";
import MedalsByGender from "./components/MedalsByGender.vue";
import TopSports from "./components/TopSports.vue";
import MedalsByAge from "./components/MedalsByAge.vue";
import MedalsByCountry from "./components/MedalsByCountry.vue";
import MedalsForRegion from "./components/MedalsForRegion.vue"
import DataTable from "datatables.net-vue3";
import DataTablesLib from "datatables.net-bs5"
import {VuePlotly} from "vue3-plotly";

export default {
  components: {
    MedalsOverTime,
    MedalsByGender,
    TopSports,
    MedalsByAge,
    MedalsByCountry, 
    DataTable,
    VuePlotly,
    MedalsForRegion,

  },
  data() {
    return {
      selectedRegion: null,
      regions: [],
      medalData: null, 
    };
  },
  async created() {
    await this.fetchRegions();
  },
  methods: {
    async fetchRegions() {
      try {
        const response = await axios.get("http://127.0.0.1:5000/regions");
        console.log("Erhaltene Daten:", response.data);

        this.regions = response.data.map(region => region.region || region);
      } catch (error) {
        console.error("Fehler beim Laden der Regionen:", error);
      }
    },

    async fetchMedalData() {
      if (this.selectedRegion) {
        try {
          console.log("Lade Medaillendaten für:", this.selectedRegion);
          const response = await axios.get(`http://127.0.0.1:5000/medals2/${this.selectedRegion}`);
          this.medalData = response.data;
        } catch (error) {
          console.error("Fehler beim Laden der Medaillendaten:", error);
        }
      }
    },
  },
};
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  text-align: center;
  margin: 20px;
}

.selector {
  margin-bottom: 20px;
}

select {
  padding: 8px;
  font-size: 16px;
}
</style>
