<template>
  <div>
    <h2>Medaillenentwicklung über die Jahre</h2>
    <VuePlotly :data="plotData" :layout="layout" style="height: 400px; width: 100%;" />
  </div>
</template>

<script>
import { VuePlotly } from "vue3-plotly";
import axios from "axios";

export default {
  components: { VuePlotly },
  props: ["noc"],
  data() {
    return {
      plotData: [],
      layout: {
        title: "Medaillenentwicklung",
        xaxis: { title: "Jahr" },
        yaxis: { title: "Anzahl Medaillen" },
        height: 400,
        width: "100%",
      },
    };
  },
  watch: {
    noc: "fetchMedalsOverTime",
  },
  mounted() {
    this.fetchMedalsOverTime();
  },
  methods: {
    async fetchMedalsOverTime() {
      if (!this.noc) return;

      try {
        const response = await axios.get(`http://127.0.0.1:5000/medals_over_time/${this.noc}`);

        if (!Array.isArray(response.data) || response.data.length === 0) {
          console.error("Ungültige API-Daten:", response.data);
          return;
        }

        // Jahre extrahieren
        const years = response.data.map(entry => entry.year);

        // Medaillenarten separat extrahieren (ersetze undefined durch 0)
        const goldCounts = response.data.map(entry => entry.Gold || 0);
        const silverCounts = response.data.map(entry => entry.Silver || 0);
        const bronzeCounts = response.data.map(entry => entry.Bronze || 0);

        // Plotly-Daten erstellen
        this.plotData = [
          {
            x: years,
            y: goldCounts,
            type: "scatter",
            mode: "lines+markers",
            name: "Gold",
            marker: { color: "gold" },
          },
          {
            x: years,
            y: silverCounts,
            type: "scatter",
            mode: "lines+markers",
            name: "Silber",
            marker: { color: "silver" },
          },
          {
            x: years,
            y: bronzeCounts,
            type: "scatter",
            mode: "lines+markers",
            name: "Bronze",
            marker: { color: "brown" },
          },
        ];
      } catch (error) {
        console.error("Fehler beim Laden der Medaillenentwicklung:", error);
      }
    },
  },
};
</script>
