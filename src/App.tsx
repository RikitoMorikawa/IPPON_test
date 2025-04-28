import { Provider } from "react-redux";
import AppRouter from "./route";
import { store } from './store/index';

export default function App() {
  return (
    <Provider store={store}>
      <AppRouter />
    </Provider>

  );
}
