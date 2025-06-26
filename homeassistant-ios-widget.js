// Adjust URL and token of your Home Assistant installation here
const hassUrl = "http://localhost:8123";
const hassToken = "";

// Adjust these sensor names to match your Home Assistant sensor ids
const sensorConfig = [
  { title: "Home" }, // Static title
  { id: "sensor.temp_sensor_1_temperature", icon: "thermometer.medium" },
  { id: "sensor.temp_sensor_1_humidity", icon: "humidity" },
  { id: "sensor.light_count", icon: "lightbulb.fill" }
];

//
//
//

const colors = {
  bgStart: "#049cdb",
  bgEnd: "#0180c8",
  text: "#ffffff",
  icon: "#ffffff"
};

const sizes = {
  sensorFont: 15,
  titleFont: 16,
  padding: 0
};

const refreshRateSec = 120;

// --- Init ---
const states = await fetchStates();
const widget = new ListWidget();
setupBackground(widget);

const layout = widget.addStack();
layout.layoutHorizontally();
const sensorStack = layout.addStack();
layout.addSpacer(60);
sensorStack.layoutVertically();

sensorConfig.forEach(entry => {
  if (entry.id) {
    const state = getState(entry.id);
    if (state) {
      addSensorRow(sensorStack, state, entry.icon);
    }
  } else if (entry.title) {
    addTitle(sensorStack, entry.title);
  }
});

Script.setWidget(widget);
Script.complete();
widget.presentSmall();

// --- Functions ---
function setupBackground(w) {
  const gradient = new LinearGradient();
  gradient.colors = [new Color(colors.bgStart), new Color(colors.bgEnd)];
  gradient.locations = [0, 1];
  w.backgroundGradient = gradient;
  w.setPadding(sizes.padding, sizes.padding, sizes.padding, sizes.padding);
  w.spacing = 0;
}

function addTitle(stack, title, icon = null) {
  const titleStack = stack.addStack();
  titleStack.cornerRadius = 4;
  titleStack.setPadding(0, 4, 0, 0);

  if (icon) {
    const img = titleStack.addImage(SFSymbol.named(icon).image);
    img.imageSize = new Size(sizes.titleFont, sizes.titleFont);
    titleStack.addSpacer(5);
  }

  const label = titleStack.addText(title);
  label.font = Font.semiboldRoundedSystemFont(sizes.titleFont);
  label.textColor = Color.white();
}

function addSensorRow(stack, sensor, iconName = "questionmark.circle") {
  const row = stack.addStack();
  row.layoutHorizontally();

  const iconStack = row.addStack();
  iconStack.setPadding(1, 0, 0, 4);
  const img = iconStack.addImage(SFSymbol.named(iconName).image);
  img.imageSize = new Size(sizes.sensorFont, sizes.sensorFont);
  img.tintColor = new Color(colors.icon);

  const valueStack = row.addStack();
  valueStack.setPadding(0, 0, 0, 4);
  const valueText = valueStack.addText(formatSensorValue(sensor));
  valueText.font = Font.mediumRoundedSystemFont(sizes.sensorFont);
  valueText.textColor = new Color(colors.text);

  if (sensor.attributes.unit_of_measurement) {
    const unitStack = row.addStack();
    const unitText = unitStack.addText(sensor.attributes.unit_of_measurement);
    unitText.font = Font.mediumSystemFont(sizes.sensorFont);
    unitText.textColor = new Color(colors.text);
  }
}

function formatSensorValue(sensor) {
  const id = sensor.entity_id;

  if (sensor.attributes.device_class === "temperature") {
    return sensor.state.slice(0, 4);
  }

  if (id === "sensor.light_count") {
    return sensor.state === "0" ? "All off" : `${sensor.state} on`;
  }

  return sensor.state;
}

async function fetchStates() {
  const req = new Request(`${hassUrl}/api/states`);
  req.headers = {
    Authorization: `Bearer ${hassToken}`,
    "Content-Type": "application/json"
  };
  return await req.loadJSON();
}

function getState(id) {
  return states.find(s => s.entity_id === id);
}