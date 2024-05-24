const currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
const today = new Date().toDateString();

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");
const currentMonthDisplay = document.getElementById("currentMonth");
const weekdaysContainer = document.querySelector(".weekdays");
const daysContainer = document.querySelector(".days");
const eventList = document.querySelector(".eventList");

const eventContainer = document.getElementById("eventContainer");
const eventForm = document.getElementById("eventForm");
const eventInput = document.getElementById("eventInput");
const addEventBtn = document.getElementById("addEventBtn");
const selectedDateDiv = document.getElementById("selectedDate");
let currentSelectedDayElement = null;

// Add event listeners
addEventBtn.addEventListener("click", addEvent);
eventInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    addEvent();
  }
});

// Event listener for previous month button
prevMonthBtn.addEventListener("click", () => {
  if (currentMonth === 0) {
    currentMonth = 11;
    currentYear -= 1;
  } else {
    currentMonth -= 1;
  }
  renderCalendar();
  clearHtml();
});

// Event listener for next month button
nextMonthBtn.addEventListener("click", () => {
  if (currentMonth === 11) {
    currentMonth = 0;
    currentYear += 1;
  } else {
    currentMonth += 1;
  }
  renderCalendar();
  clearHtml();
});

// Save events to local storage
function saveEvents() {
  localStorage.setItem("events", JSON.stringify(events));
}

// Events array to store events
let events = JSON.parse(localStorage.getItem("events")) || [];

// Render the calendar
function renderCalendar() {
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  daysContainer.innerHTML = "";
  weekdaysContainer.innerHTML = "";

  currentMonthDisplay.textContent =
    monthNames[currentMonth] + " " + currentYear;

  // Render the days of the week
  dayNames.forEach((day) => {
    const dayNameElement = document.createElement("div");
    dayNameElement.classList.add("weekday");
    dayNameElement.textContent = day;

    if (day === "Sun" || day === "Sat") {
      dayNameElement.classList.add("weekend");
    }

    weekdaysContainer.appendChild(dayNameElement);
  });

  // Render empty spaces for days from the previous month
  for (let i = 0; i < firstDayOfMonth; i++) {
    const emptyElement = document.createElement("div");
    emptyElement.classList.add("day", "empty");
    daysContainer.appendChild(emptyElement);
  }

  // Render the days of the current month
  for (let i = 1; i <= daysInMonth; i++) {
    const dayElement = document.createElement("div");
    dayElement.classList.add("day");
    dayElement.textContent = i;
    dayElement.dataset.date = `${currentYear}-${currentMonth + 1}-${i}`;

    const dayOfWeek = new Date(currentYear, currentMonth, i).getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      dayElement.classList.add("weekend");
    }

    const thisDate = new Date(currentYear, currentMonth, i).toDateString();
    if (thisDate === today) {
      dayElement.classList.add("current-day");
    }
    daysContainer.appendChild(dayElement);
    dayElement.addEventListener("click", (e) =>
      handleDateClick(e.target.textContent, dayElement)
    );
  }
}

function clearHtml() {
  selectedDateDiv.style.display = "none";
  eventForm.style.display = "none";
  eventContainer.style.display = "none";
}

//Select day
function handleDateClick(day, dayElement) {
  eventForm.style.display = "flex";
  selectedDateDiv.style.display = "block";
  eventContainer.style.display = "flex";
  eventList.style.display = "flex";
  const selectedDate = new Date(currentYear, currentMonth, day);

  const eventsOnDate = events.filter((event) => {
    const eventDate = new Date(event.date);
    return eventDate.toDateString() === selectedDate.toDateString();
  });

  // Highlight the clicked day
  if (currentSelectedDayElement) {
    currentSelectedDayElement.classList.remove("selected");
  }
  dayElement.classList.add("selected");
  currentSelectedDayElement = dayElement;

  selectedDateDiv.innerText = selectedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  renderEvents(eventsOnDate);
}

function renderEvents(events) {
  eventContainer.innerHTML = "";

  events.forEach((event, index) => {
    const eventElementDiv = document.createElement("div");
    eventElementDiv.classList.add("event-wrapper");

    const starElement = document.createElement("div");
    const eventElement = document.createElement("div");

    const deleteEvent = document.createElement("div");
    starElement.classList.add("star");
    eventElement.classList.add("event");
    deleteEvent.classList.add("delete");
    eventElement.textContent = event.title;
    deleteEvent.textContent = "X";

    eventElementDiv.appendChild(starElement);
    eventElementDiv.appendChild(eventElement);

    eventElementDiv.appendChild(deleteEvent);

    eventContainer.appendChild(eventElementDiv);

    if (index % 2 === 0) {
      eventElementDiv.classList.add("event-even");
    } else {
      eventElementDiv.classList.add("event-odd");
    }

    // Add event listener for delete button
    deleteEvent.addEventListener("click", () => {
      deleteEventFromList(event);
    });
  });
}

//Add an event
function addEvent() {
  const title = eventInput.value.trim();

  if (title) {
    const event = {
      title: title,
      date: selectedDateDiv.innerText,
    };
    events.push(event);
    saveEvents();

    const date = new Date(event.date);
    const day = date.getDate();
    const dayElement = Array.from(daysContainer.querySelectorAll(".day")).find(
      (el) => parseInt(el.textContent) === day
    );
    handleDateClick(day, dayElement);
    eventForm.reset();
  }
}

// Load events from local storage on page load
window.addEventListener("load", () => {
  if (events.length > 0) {
    renderCalendar();
  }
});

//Delete an event

function deleteEventFromList(eventToDelete) {
  events = events.filter((event) => event !== eventToDelete);
  saveEvents();
  // Re-render the events for the currently selected date
  const selectedDate = new Date(selectedDateDiv.innerText);
  const day = selectedDate.getDate();

  // Find the corresponding day element
  const dayElement = Array.from(daysContainer.querySelectorAll(".day")).find(
    (el) => parseInt(el.textContent) === day
  );

  handleDateClick(day, dayElement);
}

renderCalendar();
