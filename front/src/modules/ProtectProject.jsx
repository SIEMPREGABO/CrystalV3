import { Navigate, Outlet } from "react-router-dom";
import { useProject } from "../context/projectContext";

function ProtectProject(){
    const { IsParticipant, setIsParticipant} = useProject();
    //console.log(IsParticipant,"protect");

    if(!IsParticipant) {
        setIsParticipant(true);
        return <Navigate to="/panel" replace/>;
    }
    return <Outlet />
    
}

export default ProtectProject;