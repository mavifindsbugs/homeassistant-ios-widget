# Home Assistant Scriptable Widget

This is a minimal iOS widget using [Scriptable](https://scriptable.app) to display selected Home Assistant sensor data like temperature, humidity, and the number of lights currently on.

## Setup

1. Install Scriptable on your iPhone or iPad.
2. Paste the script into a new Scriptable script.
3. Adjust the configuration in the script.

## Configuration

### Home Assistant URL and Token

At the top of the script, set the URL and long-lived access token for your Home Assistant instance:

```js
const hassUrl = "http://your-homeassistant.local:8123";
const hassToken = "your_long_lived_token";
```

### Sensor Entities

Edit the sensorConfig array to include the sensors you want to display. Each entry should include the sensor’s entity_id and an icon name from SF Symbols:

```js
const sensorConfig = [
  { title: "Home" }, // Optional static title
  { id: "sensor.temp_sensor_temperature", icon: "thermometer.medium" },
  { id: "sensor.temp_sensor_humidity", icon: "humidity" },
  { id: "sensor.light_count", icon: "lightbulb.fill" }
];
```

You can find your sensor entity_ids in Home Assistant under Developer Tools → States.

### Creating the light_count Sensor

To display the number of lights currently turned on, you need to create a helper template sensor in Home Assistant:
	1.	Go to Settings → Devices & Services → Helpers.
	2.	Click “Create Helper” → “Template”.
	3.	Use the following template code:

```
{% set lights = [
  states.light.lamp_1,
  states.light.lamp_2,
  states.light.lamp_3,
  states.switch.plug_1,
  states.switch.plug_2
] %}
{{ lights | selectattr('state','eq','on') | list | count }}
```

Name this helper light_count, which will make the entity ID sensor.light_count.

## Usage

Once configured, add the Scriptable widget to your iOS home screen and select this script. Use the small widget size.

This script is intended to be simple and easy to extend.

