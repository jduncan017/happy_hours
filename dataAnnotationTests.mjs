import HappyHours from "./denver-happy-hours.mjs";

function formatHappyHours(happyHours) {
  let output = "";

  // Check if there are any Denver areas
  if (happyHours.CO.Denver.length > 0) {
    // Loop through each area in Denver
    for (let i = 0; i < happyHours.CO.Denver.length; i++) {
      let place = happyHours.CO.Denver[i];

      // Add the place information to the output
      output += `Name: ${place.name}\n`;
      output += `Address: ${place.address}\n`;
      output += `Website: ${place.website}\n`;

      // Format and add the happy hours information
      let happyHoursFormatted = Object.entries(place.happyHours)
        .map(([day, times]) => {
          let timesFormatted = times
            .map((time) => {
              // Convert start time to 12-hour format with AM/PM
              let startHour = parseInt(time.Start.split(":")[0]);
              let startMinutes = time.Start.split(":")[1];
              let startMeridiem = startHour >= 12 ? "PM" : "AM";
              startHour = startHour > 12 ? startHour - 12 : startHour;
              startHour = startHour === 0 ? 12 : startHour; // Convert 0 hour to 12 for 12AM
              let startTimeFormatted = `${startHour}:${startMinutes} ${startMeridiem}`;

              // Convert end time to 12-hour format with AM/PM
              let endHour = parseInt(time.End.split(":")[0]);
              let endMinutes = time.End.split(":")[1];
              let endMeridiem = endHour >= 12 ? "PM" : "AM";
              endHour = endHour > 12 ? endHour - 12 : endHour;
              endHour = endHour === 0 ? 12 : endHour; // Convert 0 hour to 12 for 12AM
              let endTimeFormatted = `${endHour}:${endMinutes} ${endMeridiem}`;

              return `${startTimeFormatted} - ${endTimeFormatted}`;
            })
            .join(", ");
          return `${day}: ${timesFormatted}`;
        })
        .join("\n");
      output += `Happy Hours:\n${happyHoursFormatted}\n`;

      // Add notes if they exist
      if (place.notes && place.notes.length > 0) {
        output += `Notes: ${place.notes.join(", ")}\n`;
      }

      // Add a separator between places
      output += `\n---\n`;
    }
  } else {
    // No Denver areas found
    output += "No Denver areas found.";
  }

  console.log(output);
}

formatHappyHours(HappyHours);
