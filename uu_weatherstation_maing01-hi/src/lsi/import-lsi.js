import { Utils } from "uu5g05";
import lsiEn from "./en.json";

const libraryCode = "uu-gateways-maing01-hi";

const importLsi = (language) => import(`./${language}.json`);
importLsi.libraryCode = libraryCode;

Utils.Lsi.setDefaultLsi(libraryCode, { en: lsiEn });

export default importLsi;
