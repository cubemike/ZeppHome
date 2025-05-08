import { BaseSideService } from "@zeppos/zml/base-side";

const headers = {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI3YzlmNWQ2YWJkNDM0MjEwYjMxZDlkYThmNDg4OTI2ZCIsImlhdCI6MTc0MzczMDk2MywiZXhwIjoyMDU5MDkwOTYzfQ.FPJ0AU0wqHt6rPdMRXuaWRdMaihLtWec6nKt8-4006Q",
    "content-type": "application/json"
}

async function test(res) {
  try {
    // Requesting network data using the fetch API
    // The sample program is for simulation only and does not request real network data, so it is commented here
    // Example of a GET method request
    // const { body: { data = {} } = {} } = await fetch({
    //   url: 'https://xxx.com/api/xxx',
    //   method: 'GET'
    // })
    // Example of a POST method request
    // const { body: { data = {} } = {} } = await fetch({
    //   url: 'https://xxx.com/api/xxx',
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     text: 'Hello Zepp OS'
    //   })
    // })

    // A network request is simulated here, Reference documentation: https://jsonplaceholder.typicode.com/
    //const response = await fetch({
    //  url: 'https://jsonplaceholder.typicode.com/todos/1',
    //  method: 'GET'
    //})
    //const resBody = typeof response.body === 'string' ? JSON.parse(response.body) : response.body

    res(null, {
      status: 123,
    });
  } catch (error) {
    res(null, {
      result: "ERROR",
    });
  }
};

async function get_climate(res) {
    try {
        let response
        response = await fetch({
            method: "GET",
            url:  'http://homeassistant.sphinx-city.ts.net:8123/api/states/sensor.temperature',
            headers: headers
        })
        const resBodyTemp = typeof response.body === 'string' ? JSON.parse(response.body) : response.body
        console.log(resBodyTemp)

        response = await fetch({
            method: "GET",
            url:  'http://homeassistant.sphinx-city.ts.net:8123/api/states/sensor.humidity',
            headers: headers
        })
        const resBodyHumidity = typeof response.body === 'string' ? JSON.parse(response.body) : response.body
        console.log(resBodyHumidity)

        response = await fetch({
            method: "GET",
            url:  'http://homeassistant.sphinx-city.ts.net:8123/api/states/light.lamp',
            headers: headers
        })
        const resBodyLight = typeof response.body === 'string' ? JSON.parse(response.body) : response.body
        console.log(resBodyLight)

        response = await fetch({
            method: "GET",
            url:  'http://homeassistant.sphinx-city.ts.net:8123/api/states/cover.blinds',
            headers: headers
        })
        const resBodyBlinds = typeof response.body === 'string' ? JSON.parse(response.body) : response.body

        res(null, {
            temperature: {value: resBodyTemp.state, unit: resBodyTemp.attributes.unit_of_measurement},
            humidity: {value: resBodyHumidity.state, unit: resBodyHumidity.attributes.unit_of_measurement},
            light: {value: resBodyLight.state},
            blinds: {value: resBodyBlinds.state},
        });
    } catch {
    }
}

AppSideService(
  BaseSideService({
    onInit() {},

    onRequest(req, res) {
      console.log("=====>,", req.method);
      if (req.method === "TEST") {
        test(res);
      } else if (req.method == "GET_CLIMATE") {
        get_climate(res);
      }
    },

    onRun() {},

    onDestroy() {},
  })
);
