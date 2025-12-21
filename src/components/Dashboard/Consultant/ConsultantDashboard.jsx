import InfoBox from "./InfoBox";
import EventDetails from "./EventDetails";
import ApprovedApplications from "./ApprovedApplications";

const StudentDashboard = () => {
    return (
        <div className="container flex flex-col">
            <InfoBox />
            <EventDetails />
            <ApprovedApplications />
        </div>
    );
};

export default StudentDashboard;