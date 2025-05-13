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

let textWidget;
let temp, humidity;
let lightButton, blindsButton;

function log() {
    console.log([...arguments].join(' '))
}

const endpoints = {
    temperature: "states/sensor.temperature",
       humidity: "states/sensor.humidity",
          light: "states/light.lamp",
         blinds: "states/cover.blinds"
};

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
          this.toggleEntity("light.lamp");
        },
      });

      blindsButton = hmUI.createWidget(hmUI.widget.BUTTON, {
        ...FETCH_BUTTON,
        h: 100,
        y: 250,

        text: "Blinds: ???",
        click_func: (button_widget) => {
          this.toggleEntity("cover.blinds");
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

      temperature = hmUI.createWidget(hmUI.widget.TEXT, {
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

      this.updateAll();

    },

    updateAll() {
      timeoutPromise(this.request({
          method: "FETCH_ENDPOINTS",
          endpoints: endpoints
      }), 3000).then((response) => {
          console.log(JSON.stringify(response))
           temperature.text = [Number(response.temperature.state).toFixed(1), response.temperature.attributes.unit_of_measurement].join('')
              humidity.text = [Number(response.humidity.state).toFixed(1), response.humidity.attributes.unit_of_measurement].join('')
           lightButton.text = ['Light:', response.light.state].join(' ')
          blindsButton.text = ['Blinds:', response.blinds.state].join(' ')
      }).catch((error) => {
          hmUI.showToast({
            text: error.toString()
          })
      })
    },

    toggleEntity(entity) {
      timeoutPromise(this.request({
        method: "TOGGLE_ENTITY",
        entity: entity
      }), 3000)
        .then((result) => {
          this.updateAll();
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
