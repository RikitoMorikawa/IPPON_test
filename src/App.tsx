import { Provider } from "react-redux";
import AppRouter from "./route";
import { store } from './store/index';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Provider store={store}>
      <AppRouter />
    </Provider>
    </LocalizationProvider>
  );
}
