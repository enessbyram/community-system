import Buttons from "./Buttons";
import CommunityBoxes from "./CommunityBoxes";
import InfoBox from "./InfoBox";
import WaitingApplications from "./WaitingApplications";

const SksDashboard = () => {
    return (
        <div className="container flex flex-col">
            <InfoBox />
            <WaitingApplications />
            <CommunityBoxes />
            <Buttons />
        </div>
    );
};

export default SksDashboard;