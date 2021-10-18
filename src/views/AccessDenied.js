
import NoAccess from "../assets/img/icons/noaccess_icon.svg";
const AccessDenied = (props) => {
  return (
    <div className="imageLayout">
      <img src={NoAccess} alt="" />
      <p className="desc">
        User is{" "}
        <b className="title">
          not authorized <br /> to access this page
        </b>
        .
      </p>
    </div>
  );
};
export default AccessDenied;
