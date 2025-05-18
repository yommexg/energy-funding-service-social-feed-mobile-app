import Spinner from "@/components/Spinner";
import { loadUserFromStorage } from "@/redux/slices/loginSlice";
import { useAppDispatch } from "@/redux/store";
import { useEffect, useState } from "react";

const App = () => {
  const dispatch = useAppDispatch();

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      await dispatch(loadUserFromStorage());
      setInitialized(true);
    };
    initialize();
  }, [dispatch]);

  if (!initialized) {
    return <Spinner />;
  }

  return;
};

export default App;
