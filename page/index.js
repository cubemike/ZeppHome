import * as hmUI from "@zos/ui";
import { log as Logger } from "@zos/utils";
import { BasePage } from "@zeppos/zml/base-page.debug";
import {
  FETCH_BUTTON,
  FETCH_RESULT_TEXT,
} from "zosLoader:./index.[pf].layout.js";

const logger = Logger.getLogger("fetch_api");
function timeoutPromise(promise, timeout) {
    const timeoutP = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), timeout);
    });
    return Promise.race([promise, timeoutP]);
};

const headers = {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI3YzlmNWQ2YWJkNDM0MjEwYjMxZDlkYThmNDg4OTI2ZCIsImlhdCI6MTc0MzczMDk2MywiZXhwIjoyMDU5MDkwOTYzfQ.FPJ0AU0wqHt6rPdMRXuaWRdMaihLtWec6nKt8-4006Q",
    "content-type": "application/json"
}

let textWidget;
let temp, humidity;
let lightButton, blindsButton;

function log() {
    console.log([...arguments].join(' '))
}

Page(
  BasePage({
    state: {},
    build() {
      lightButton = hmUI.createWidget(hmUI.widget.BUTTON, {
        ...FETCH_BUTTON,
        h: 100,
        y: 130,
        text: "Light: ???",
        click_func: (button_widget) => {
          this.toggleLight();
        },
      });
      blindsButton = hmUI.createWidget(hmUI.widget.BUTTON, {
        ...FETCH_BUTTON,
        h: 100,
        y: 250,

        text: "Blinds: ???",
        click_func: (button_widget) => {
          this.toggleBlinds();
        },
      });
      hmUI.createWidget(hmUI.widget.BUTTON, {
        ...FETCH_BUTTON,
        h: 50,
        y: 380,
        w: 200,
        x: 466/2-200/2,

        text: "Test",
        click_func: (button_widget) => {
          this.test();
        },
      });

      temp = hmUI.createWidget(hmUI.widget.TEXT, {
          x: 100,
          y: 70,
          w: 200,
          h: 50,
          text_size: px(36),
          text: '???',
          color: '0xffffff'
      })

      humidity = hmUI.createWidget(hmUI.widget.TEXT, {
          x: 263,
          y: 70,
          w: 200,
          h: 50,
          text_size: px(36),
          text: '???',
          color: '0xffffff'
      })

      timeoutPromise(this.request({
          method: "GET_CLIMATE"
      }), 3000).then((response) => {
          console.log(JSON.stringify(response))
          temp.text =  [Number(response.temperature.value).toFixed(1), response.temperature.unit].join(' ')
          humidity.text =  [Number(response.humidity.value).toFixed(1), response.humidity.unit].join(' ')
          lightButton.text =  ['Light:', response.light.value].join(' ')
          blindsButton.text =  ['Blinds:', response.blinds.value].join(' ')
      }).catch((error) => {
          hmUI.showToast({
            text: error.toString()
          })
      })



    },
    toggleLight() {
      timeoutPromise(this.httpRequest({
        method: "POST",
        url: 'http://homeassistant.sphinx-city.ts.net:8123/api/services/light/toggle',
        headers: headers,
        body: JSON.stringify({entity_id: "light.lamp"})
      }), 3000)
        .then((result) => {
          logger.log("receive data");
          Object.keys(result).forEach((key) => {
              console.log(key)
          })
          console.log(JSON.stringify(result))
          console.log(result.status)
          console.log(JSON.stringify(result.body[0].state))
          lightButton.text =  ['Light:', result.body[0].state].join(' ')
        })
        .catch((error) => {
          hmUI.showToast({
            text: error.toString()
          })
        });
    },
    toggleBlinds() {
      timeoutPromise(this.httpRequest({
        method: "POST",
        url: 'http://homeassistant.sphinx-city.ts.net:8123/api/services/cover/toggle',
        headers: headers,
        body: JSON.stringify({entity_id: "cover.blinds"})
      }), 3000)
        .then((result) => {
          logger.log("receive data");
          console.log(JSON.stringify(result.body))
          console.log(result.status)
          timeoutPromise(this.httpRequest({
              method: "GET",
              url:  'http://homeassistant.sphinx-city.ts.net:8123/api/states/cover.blinds',
              headers: headers
          }), 3000)
            .then((response) => {
                log(response.body.state)
                blindsButton.text =  ['Blinds:', response.body.state].join(' ')
            })
            .catch((error) => {
              hmUI.showToast({
                text: error.toString()
              });
            });
        })
        .catch((error) => {
          hmUI.showToast({
            text: error.toString()
          })
        });
    },
    test() {
      timeoutPromise(this.request({
        method: "TEST",
      }), 3000)
        .then((result) => {
          hmUI.showToast({
            text: "OK!"
          })
        })
        .catch((error) => {
          hmUI.showToast({
            text: error.toString()
          })
        });
    },
  })
);
