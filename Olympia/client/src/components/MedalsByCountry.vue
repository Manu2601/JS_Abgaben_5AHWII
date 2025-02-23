<template>
  <div>
    <h2>Medaillen nach Land</h2>
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
      layout: { title: "Medaillen nach Land", height: 400, width: "100%" },
    };
  },
  async created() {
    await this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.get("http://127.0.0.1:5000/medals_by_country");

        const totalMedals = response.data.counts.reduce((acc, count) => acc + count, 0);
        const threshold = totalMedals * 0.01; 

        let otherCountriesCount = 0;
        const countries = [];
        const counts = [];

        response.data.countries.forEach((country, index) => {
          if (response.data.counts[index] < threshold) {
            otherCountriesCount += response.data.counts[index];
          } else {
            countries.push(country);
            counts.push(response.data.counts[index]);
          }
        });

        if (otherCountriesCount > 0) {
          countries.push("Andere");
          counts.push(otherCountriesCount);
        }

        this.plotData = [
          {
            labels: countries,
            values: counts,
            type: "pie",
          },
        ];
      } catch (error) {
        console.error("Fehler beim Laden der Medaillen nach Land:", error);
      }
    },
  },
};
</script>
