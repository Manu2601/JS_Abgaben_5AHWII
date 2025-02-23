<template>
    <div class="medals-for-region">
      <h2>Medaillenübersicht für {{ region }}</h2>
  
      <div v-if="loading">Lade Daten...</div>
      <div v-else-if="error">{{ error }}</div>
      <div v-else>

        <VuePlotly v-if="plotData.length" :data="plotData" :layout="layout" />
  
        <DataTable v-if="tableData.length" :columns="columns" :data="tableData" class="display" />
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  import { VuePlotly } from "vue3-plotly";
  import DataTable from "datatables.net-vue3";
  import DataTablesLib from "datatables.net-bs5";
  
  export default {
    components: {
      VuePlotly,
      DataTable,
    },
    props: {
      region: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        medalData: [],
        loading: false,
        error: null,
      };
    },
    watch: {
      region: {
        immediate: true, // Lädt Daten sofort, wenn die Komponente erstellt wird
        handler(newRegion) {
          if (newRegion) {
            this.fetchMedalData(newRegion);
          }
        },
      },
    },
    methods: {
      async fetchMedalData(region) {
        this.loading = true;
        this.error = null;
        try {
          const response = await axios.get(`http://127.0.0.1:5000/medals2/${region}`);
          this.medalData = response.data;
        } catch (err) {
          this.error = "Fehler beim Laden der Medaillendaten.";
          console.error(err);
        } finally {
          this.loading = false;
        }
      },
    },
    computed: {
      plotData() {
        if (!this.medalData || this.medalData.length === 0) return [];
        return [
          {
            x: this.medalData[0].x,
            y: this.medalData[0].y,
            type: "bar",
            marker: { color: ["gold", "silver", "#cd7f32"] },
          },
        ];
      },
      layout() {
        return {
          title: "Medaillenverteilung",
          xaxis: { title: "Medaillentyp" },
          yaxis: { title: "Anzahl" },
        };
      },
      tableData() {
        return this.medalData[0]?.x.map((medal, index) => ({
          medal,
          count: this.medalData[0]?.y[index],
        })) || [];
      },
      columns() {
        return [
          { title: "Medaillentyp", data: "medal" },
          { title: "Anzahl", data: "count" },
        ];
      },
    },
  };
  </script>
  
  <style scoped>
  .medals-for-region {
    margin-top: 20px;
  }
  </style>
  