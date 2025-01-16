const COHORT = "2409-GHP-ET-WEB-PT";
const BASE_URL = 'https://fsa-crud-2aa9294fe819.herokuapp.com/api/' + COHORT;

// === State ===

const state = {
  events: [],
};

const form = document.getElementById('partyPlanner');
const eventlist = document.getElementById('partyList');

/** Updates state with events from API (pulling events from API) */
async function getEvent() {
  try {
    const response = await fetch(`${BASE_URL}/events`);
    const json = await response.json();
    if (!json.success) {
      throw json.error;
    }
    state.events = json.data;
  } catch (error) {
    console.error("Unable to load Events");
  }
}

/** Asks the API to create a new artist based on the given `Events` */
async function addEvent(newEvent) {
  try {
    const response = await fetch(`${BASE_URL}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEvent),
    });
    if (!response.ok) {
      throw new Error(
        "Unable to add Event due to Http error: " + response.status
      );
    }
    render();
  } catch (error) {
    alert(error.message);
  }
}
/** Asks the API to delete the given event */
async function deleteEvent(id) {
  try {
    const response = await fetch(`${BASE_URL}/events/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(
        "Unable to delete event due to Http error: " + response.status
      );
    }
    render();
  } catch (error) {
    console.log(error.message);
  }
};


// Event Listener
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  try {

    const eventDate = new Date(form.date.value).toISOString();

    const newParty = {
      name: form.eventName.value,
      description: form.discription.value,
      date: eventDate,
      location: form.location.value,
    };

    await addEvent(newParty);


    form.reset();
  } catch (err) {
    console.log(err);
  }
});


/** Renders event from state */
function renderEvent() {
  const eventList = document.querySelector("#events");

  if (!state.events.length) {
    eventList.innerHTML = "<li>No events.</li>";
    return;
  }

  const eventCards = state.events.map((event) => {
    const card = document.createElement("li");

    //H1 for Artist Name
    const h1 = document.createElement("h1");
    h1.textContent = event.name;

    //H2 for event Description
    const h2 = document.createElement("h2");
    h2.textContent = event.description;

    //h3 Event Date 
    const eventDate = new Date(event.date).toLocaleString();


    //Button to Delete the Event
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.style.display = "block";
    deleteButton.addEventListener("click", async () => {
      console.log("Delete button clicked!");
      await deleteEvent(event);
    })
    card.append(h1, h2, eventDate, deleteButton)
    return card
  });
  eventList.replaceChildren(...eventCards);

}
/** Syncs state with the API and rerender */
async function render() {
  await getEvent();
  renderEvent();
}

render();