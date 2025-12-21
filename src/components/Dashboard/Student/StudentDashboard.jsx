import InfoBox from "./InfoBox";
import MemberBox from "./MemberBox";
import FollowedCommunities from "./FollowedCommunities";
import Buttons from "./Buttons";

const StudentDashboard = () => {
    return (
        <div className="container flex flex-col">
            <InfoBox />
            <MemberBox />
            <FollowedCommunities />
            <Buttons />
        </div>
    );
};

export default StudentDashboard;