import axios from "axios";

export async function searchZettel(val) {
  try {
    const response = await axios.get(`http://127.0.0.1:5000/cat-search/${val}`);
    const data = response.data;
    const slicedData = data.slice(0, 30);
    this.zettelliste = slicedData.map((item) => ({
      id: item.id,
      img: "https://webapp.uibk.ac.at/ubi/cat/" + item.thumb,
      text: item.description,
    }));
    this.zettelliste.forEach((zettel) => {
      const regex = new RegExp(`(${val})`, "gi");
      zettel.text = zettel.text.replace(regex, "<strong>$1</strong>");
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export async function edit(zettel) {
  this.selectedZettel = zettel;
  this.selectedZettel.text = this.selectedZettel.text.replace("<strong>", "").replace("</strong>", "");
  await loadHistory.call(this, zettel.id);
}

export async function loadHistory(id) {
  try {
    const response = await axios.get(`http://127.0.0.1:5000/history/${id}`);
    this.selectedZettelHistory = response.data;
  } catch (error) {
    console.error("Fehler beim Laden der Historie:", error);
  }
}

export function cancelEdit() {
  this.selectedZettel = null;
  this.selectedZettelHistory = [];
}

export async function saveChanges() {
  try {
    const { id, text } = this.selectedZettel;
    const response = await axios.patch(`http://127.0.0.1:5000/cat-item/` + id, {
      params: { description: text },
    });

    if (response.status === 200) {
      const index = this.zettelliste.findIndex((zettel) => zettel.id === id);
      if (index !== -1) {
        this.zettelliste[index].text = text;
      }
      this.selectedZettel = null;
    } else {
      console.error("Fehler beim Speichern:", response.data);
    }
    await loadHistory.call(this, id);
  } catch (error) {
    console.error("Fehler beim Speichern:", error);
  }
}

export function applyPreviousVersion(text) {
  this.selectedZettel.text = text;
}
