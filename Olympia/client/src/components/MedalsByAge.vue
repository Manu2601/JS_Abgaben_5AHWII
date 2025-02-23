<template>
    <div>
      <h2>Altersverteilung der Medaillengewinner</h2>
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
        layout: { title: "Altersverteilung", height: 400, width: "100%" },
      };
    },
    async created() {
      await this.fetchData();
    },
    methods: {
      async fetchData() {
        try {
          const response = await axios.get("http://127.0.0.1:5000/medals_by_age");
          this.plotData = [
            {
              x: response.data.ages,
              y: response.data.counts,
              type: "histogram",
            },
          ];
        } catch (error) {
          console.error("Fehler beim Laden der Altersverteilung:", error);
        }
      },
    },
  };
  </script>
  