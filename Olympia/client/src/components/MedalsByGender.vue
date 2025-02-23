<template>
    <div>
      <h2>Medaillenverteilung nach Geschlecht</h2>
      <VuePlotly :data="plotData" :layout="layout" style="height: 400px; width: 100%;" />
    </div>
  </template>
  
  <script>
  import { VuePlotly } from "vue3-plotly";
  import axios from "axios";
  
  export default {
    components: { VuePlotly },
    data() {
      return {
        plotData: [],
        layout: { title: "Medaillen nach Geschlecht", height: 400, width: "100%" },
      };
    },
    async created() {
      await this.fetchData();
    },
    methods: {
      async fetchData() {
        try {
          const response = await axios.get("http://127.0.0.1:5000/count_by_sex2");
          this.plotData = response.data;
        } catch (error) {
          console.error("Fehler beim Laden der Medaillen nach Geschlecht:", error);
        }
      },
    },
  };
  </script>
  