import { BrowserRouter, Routes, Route } from "react-router-dom";
import Gateway from "@pages/Gateway/Gateway";
import Main from "@pages/Main/Main";
import Tour from "@pages/Tour/Tour";
import Pension from "@pages/Pension/Pension";
import Schedule from "@pages/Schedule/Schedule";
// import Notice from "@pages/Notice/Notice";
// import Program from "@pages/Program/Program";
// import { Alarm } from "@components/common";
import InitializeScroll from "@modules/InitializeScroll/InitializeScroll";

const Router = () => {
  return (
    <BrowserRouter basename="/presentation">
        <Routes>
            <Route path="/" element={<Gateway />} />
            <Route path="/main" element={<Main />} />
            <Route path="/tour" element={<Tour />} />
            <Route path="/pension" element={<Pension />} />
            <Route path="/schedule" element={<Schedule />} />

            {/*<Route path="/notice" element={<Notice />} />*/}
            {/*<Route path="/program" element={<Program />} />*/}
        </Routes>

        {/*<Alarm />*/}
        <InitializeScroll />
    </BrowserRouter>
  );
};

export default Router;
