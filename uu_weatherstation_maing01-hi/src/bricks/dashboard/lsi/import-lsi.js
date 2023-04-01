import { Utils } from "uu5g05";
import lsiEn from "./en.json";

const libraryCode = process.env.NAME;

const importLsi = (language) => import(`./${language}.json`);
importLsi.libraryCode = libraryCode;

Utils.Lsi.setDefaultLsi(libraryCode, { en: lsiEn });

export default importLsi;
