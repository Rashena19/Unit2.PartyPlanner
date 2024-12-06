const COHORT = "2409-GHP-ET-WEB-PT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

// === State ===

const state = {
  events: [],
};

/** Updates state with events from API (pulling events from API) */
async function getEvent() {
  try {
    const promise = await fetch(API_URL);
    const response = await promise.json();
    if (!response.success) {
      throw response.error;
    }
    state.artists = response.data;
  } catch (error) {
    alert("Unable to load Events");
  }
}

/** Asks the API to create a new artist based on the given `artist` */
async function addArtist(artist) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(artist),
    });
    if (!response.ok) {
      throw new Error(
        "Unable to add artist due to Http error: " + response.status
      );
    }
  } catch (error) {
    alert(error.message);
  }
}
/** Asks the API to delete the given artist */
async function deleteArtist(artist) {
  try {
    const response = await fetch(API_URL + "/" + artist.id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(
        "Unable to delete artist due to Http error: " + response.status
      );
    }
    render();
  } catch (error) {
    alert(error.message);
  }
}

// === Render ===

/** Renders artists from state */
function renderArtists() {
  const artistList = document.querySelector("#artists");

  if (!state.artists.length) {
    artistList.innerHTML = "<li>No artists.</li>";
    return;
  }

  const artistCards = state.artists.map((artist) => {
    const card = document.createElement("li");
    //H1 for Artist Name
    const h1 = document.createElement("h1");
    h1.textContent = artist.name;

    //H2 for Artist Description
    const h2 = document.createElement("h2");
    h2.textContent = artist.description;

    //Image of Artist
    const image = document.createElement("img");
    image.src = artist.imageUrl; //set the img src to be the imageUrl from the artist object
    image.style.width = "50%";
    image.style.height = "50%";

    //Button to Delete the Artist
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.style.display = "block";
    deleteButton.addEventListener("click", async () => {
      await deleteArtist(artist);
    });

    card.append(h1, h2, image, deleteButton);
    return card;
  });

  artistList.replaceChildren(...artistCards);
}
/** Syncs state with the API and rerender */
async function render() {
  await getArtists();
  renderArtists();
}

// === Script ===

render();

// Add listener to form
const form = document.getElementById("addArtist");
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const artist = {
    name: form.artistName.value,
    description: form.description.value,
    imageUrl: form.imageUrl.value,
  };

  await addArtist(artist);
  render();
});