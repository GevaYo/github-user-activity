async function fetchEvents(username) {
  const response = await fetch(
    `https://api.github.com/users/${username}/events`
  );
  if (!response.ok) {
    throw new Error(`Error fecthing user activity: ${response.status}`);
  }
  return response.json();
}

function showActivity(events) {
  if (events.length === 0) {
    console.log("No user activity to show");
    return;
  }

  events.forEach((event) => {
    let activity;
    switch (event.type) {
      case "PushEvent":
        activity = `Pushed ${event.payload.commits.length} commit(s) to ${event.repo.name}`;
        break;
      case "WatchEvent":
        activity = `Starred ${event.repo.name}`;
        break;
      case "IssuesEvent":
        activity = `${
          event.payload.action.charAt(0).toUpperCase() +
          event.payload.action.slice(1)
        } an issue: ${event.payload.issue.title}`;
        break;
      case "ForkEvent":
        activity = `Forked ${event.repo.name}`;
        break;
      case "CreateEvent":
        activity = `Created new ${event.payload.ref_type} called`;
        break;
      default:
        activity = `${event.type.replace("Event", "")} in ${event.repo.name}`;
        break;
    }
    console.log(`(*) ${activity}`);
  });
}

const username = process.argv.splice(2)[0];

if (!username) {
  console.error("Please insert a GitHub username");
  process.exit(1);
}

fetchEvents(username)
  .then((events) => {
    showActivity(events);
  })
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
