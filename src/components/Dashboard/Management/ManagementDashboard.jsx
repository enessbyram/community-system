import InfoBox from "./InfoBox";
import MemberBox from "./MemberBox";
import Management from "./Management";
import LatestEvents from "./LatestEvents";
import DashboardBox from "./DashboardBox";

const ManagementDashboard = () => {
    return (
        <div className="container flex flex-col">
            <InfoBox />
            <MemberBox />
            <DashboardBox />
            <LatestEvents />
            <Management />
        </div>
    );
};

export default ManagementDashboard;