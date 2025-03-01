import "react-native-url-polyfill/auto"; // Ensure this is at the very top
import { AppRegistry } from "react-native";
import App from "./src/App";

AppRegistry.registerComponent('main', () => App);