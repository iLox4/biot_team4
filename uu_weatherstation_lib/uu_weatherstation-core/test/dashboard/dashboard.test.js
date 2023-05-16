import UuWeatherstation from "uu_weatherstation-core";
import { testProperties } from "uu5g05-test";

const CONFIG = {
  props: {
    // left: {
    //   values: ["Left as text", <span key="l">Left as JSX</span>, 0],
    // },
  },
  requiredProps: {
    // children: "Children content",
  },
};

describe(`UuWeatherstation.Dashboard.Dashboard`, () => {
  testProperties(UuWeatherstation.Dashboard.Dashboard, CONFIG);
});
