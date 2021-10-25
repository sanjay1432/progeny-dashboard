import React, { useState, useEffect } from "react";
import { CANCEL_REQUEST } from "../constants";
import { Redirect } from "react-router-dom"
import { activeDashboard, progenySubject } from "../services/pubsub.service";
import MenuRoundedIcon from "@material-ui/icons/MenuRounded";
import ImportantDevicesRoundedIcon from "@material-ui/icons/ImportantDevicesRounded";
import Insights_black from "../assets/img/icons/insights_black_24dp.svg";
import AccountCircleRoundedIcon from "@material-ui/icons/AccountCircleRounded";
import logo from "../assets/img/Progeny-logo/logoStyle02.png";
// reactstrap components
import { Container } from "reactstrap";

import {
  Loader,
  Header,
  Navbar,
  Icon,
  Content,
  Nav as NavRS,
  Container as ContainerRS,
  Dropdown,
  Drawer,
  Sidenav,
} from "rsuite";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardData } from "../redux/actions/dashboarddata.action";
import axios from "axios";
import ProgenySubNavBar from "../components/nav/ProgenySubNavBar";
import TabPanel from "../components/shared/TabPanel";
import { useHistory } from "react-router-dom";
import { logout } from "../redux/actions/auth.action";
import GeneralHelper from "../helper/general.helper";
import SuccessMessage from "../components/SharedComponent/SuccessMessage";
import { useKeycloak } from "@react-keycloak/web";
import AccessDenied from "./AccessDenied";
import Dashboard from "./Dashboard";
const initialSidenavState = {
  expanded: true,
  activeKey: "1",
};
const initialSubnavState = {
  active: "estate",
};
const listItems = [
  {
    name: "Master Data",
    customClass: "master",
    customIcon: ImportantDevicesRoundedIcon,
    eventKey: "1",
    sublist: [
      {
        name: "Estate",
        eventKey: "estate",
        filters: [
          {
            name: "estate",
            label: "Estate",
            type: "select",
            disable: false,
          },
          {
            name: "estatefullname",
            label: "Estate Full Name",
            type: "select",
            disable: false,
          },
        ],
        search: true,
      },
      {
        name: "Trial and Replicate",
        eventKey: "trial",
        filters: [
          {
            name: "trialCode",
            label: "Trial ID",
            type: "select",
            disable: false,
          },
          {
            name: "planteddate",
            label: "Planted Date (Year)",
            type: "select",
            disable: false,
          },
          {
            name: "estate",
            label: "Estate",
            type: "select",
            disable: false,
          },
        ],
        search: false,
      },
      {
        name: "Plot",
        eventKey: "plot",
        filters: [
          {
            name: "trialCode",
            label: "Trial ID",
            type: "select",
            disable: false,
          },
          {
            name: "estate",
            label: "Estate",
            type: "select",
            disable: false,
          },
          {
            name: "replicate",
            label: "Replicate",
            type: "select",
            disable: true,
          },
        ],
        search: false,
      },
      {
        name: "Palm",
        eventKey: "palm",
        filters: [
          {
            name: "trialCode",
            label: "Trial ID",
            type: "select",
            disable: false,
          },
          {
            name: "estate",
            label: "Estate",
            type: "select",
            disable: false,
          },
          // {
          //   name: "replicate",
          //   label: "Replicate",
          //   type: "select",
          //   disable: true
          // },
          // {
          //   name: "plot",
          //   label: "Plot",
          //   type: "select",
          //   disable: true
          // }
        ],
        search: false,
      },
      {
        name: "Progeny",
        eventKey: "progeny",
        filters: [
          {
            name: "progenyCode",
            label: "Progeny ID",
            type: "text",
          },
          {
            name: "progeny",
            label: "Progeny",
            type: "text",
          },
          {
            name: "fpFam",
            label: "FP Fam",
            type: "text",
          },
          {
            name: "mpFam",
            label: "MP Fam",
            type: "text",
          },
          {
            name: "mp",
            label: "MP",
            type: "text",
          },
          {
            name: "fp",
            label: "FP",
            type: "text",
          },

          {
            name: "ortet",
            label: "Ortet",
            type: "text",
          },
        ],
        search: false,
      },
    ],
    type: "single",
  },
  {
    name: "Statistician",
    customClass: "master",
    customIcon: Insights_black,
    eventKey: "2",
    subItems: [
      {
        name: "Verification",
        customClass: "master",
        customIcon: null,
        eventKey: "2-1",
        sublist: [
          {
            name: "Yearly Verification",
            eventKey: "yearlyverification",
            filters: [
              {
                name: "year",
                label: "Year",
                type: "select",
                disable: false,
              },
            ],
            search: true,
          },
          {
            name: "Verify Forms",
            eventKey: "verifyforms",
            filters: [
              {
                name: "trialCode",
                label: "Trial ID",
                type: "select",
                disable: false,
              },
              {
                name: "uploadedby",
                label: "Uploaded By",
                type: "select",
                disable: false,
              },
              {
                name: "recordedby",
                label: "Recorded By",
                type: "select",
                disable: false,
              },
            ],
            search: false,
          },
        ],
      },
      {
        name: "Data List",
        customClass: "master",
        customIcon: null,
        eventKey: "2-2",
        sublist: [
          {
            name: "Form Data",
            eventKey: "formdata",
            filters: [],
            search: true,
          },
        ],
      },
    ],
    type: "multiple",
  },
  // {
  //   name: "User Management",
  //   icon: "group",
  //   customIcon: SupervisedUserCircleRoundedIcon,
  //   customClass: "master",
  //   eventKey: "2",
  //   sublist: [
  //     {
  //       name: "User List",
  //       eventKey: "userlist",
  //       filters: [
  //         {
  //           name: "username",
  //           label: "Username",
  //           type: "text"
  //         },
  //         {
  //           name: "position",
  //           label: "Position",
  //           type: "select"
  //         }
  //       ],
  //       search: true
  //     },
  //     {
  //       name: "Estate Assignment",
  //       eventKey: "estateAssignment",
  //       filters: [
  //         {
  //           name: "estate",
  //           label: "Estate",
  //           type: "select"
  //         },
  //         {
  //           name: "estatefullname",
  //           label: "Estate Full Name",
  //           type: "select",
  //           disable: false
  //         }
  //       ],
  //       search: true
  //     },
  //     {
  //       name: "User Assignment",
  //       eventKey: "userAssignment",
  //       filters: [
  //         {
  //           name: "username",
  //           label: "Username",
  //           type: "text"
  //         },
  //         {
  //           name: "estate",
  //           label: "Estate",
  //           type: "select"
  //         },
  //         {
  //           name: "position",
  //           label: "Position",
  //           type: "select"
  //         }
  //       ],
  //       search: true
  //     }
  //   ]
  // }
];

const Overview = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDrawer, setDrawer] = useState(false);
  const [sidenavState, setSidenavState] = useState(initialSidenavState);
  const [subnavState, setSubnavState] = useState(initialSubnavState);
  const [successMessage, setSuccessMessage] = useState(false);
  const [action, setAction] = useState("");
  const dispatch = useDispatch();
  const { keycloak } = useKeycloak();
  const isAutherized = (roles) => {
    if (keycloak && roles) {
      return roles.some((r) => {
        const realm = keycloak.hasRealmRole(r);
        const resource = keycloak.hasResourceRole(r);
        return realm || resource;
      });
    }
    return false;
  };

  const { isLoggedIn, user } = useSelector((state) => state.authReducer);
  dispatch(getDashboardData("trial"));
  useEffect(() => {
    function subscribedData(data) {
      handleSelect(data);
    }

    activeDashboard.subscribe((data) => {
      subscribedData(data);
    });
  }, []);

  useEffect(() => {
    function Success(data) {
      itemSaved(data);
    }

    progenySubject.subscribe((data) => {
      Success(data);
    });
  }, []);

  function itemSaved(data) {
    setAction(data.type);
    setSuccessMessage(true);
  }

  const history = useHistory();

  const mainKey = sidenavState.activeKey.split("-")[0];
  let currentSideItem;
  if (mainKey === sidenavState.activeKey) {
    currentSideItem = listItems.find(
      (item) => item.eventKey === sidenavState.activeKey
    );
  } else {
    const mainItem = listItems.find((item) => item.eventKey === mainKey);

    currentSideItem = mainItem.subItems.find(
      (item) => item.eventKey === sidenavState.activeKey
    );
  }

  function toggleDrawer() {
    setDrawer(true);
  }
  function handleSelectTab(eventKey) {
    setSidenavState(() => ({ ...sidenavState, activeKey: eventKey }));
    if (eventKey === "1") {
      setSubnavState(() => ({ ...subnavState, active: "estate" }));
      handleSelect("estate");
    } else if (eventKey === "2") {
      setSubnavState(() => ({ ...subnavState, active: "userlist" }));
      handleSelect("userlist");
    } else if (eventKey === "2-1") {
      setSubnavState(() => ({ ...subnavState, active: "yearlyverification" }));
      handleSelect("yearlyverification");
    } else if (eventKey === "2-2") {
      setSubnavState(() => ({ ...subnavState, active: "formdata" }));
      handleSelect("formdata");
    }

    close();
  }
  function handleSelect(activeKey) {
    console.log({ activeKey });
    if (activeKey != "palm") {
      dispatch(getDashboardData(activeKey));
    }

    setSubnavState(() => ({ ...subnavState, active: activeKey }));
  }
  function close() {
    setDrawer(false);
  }
  useEffect(() => {
    if (!isLoggedIn) {
      history.push({
        pathname: "/",
      });
    } else {
      const { active } = subnavState;
      console.log({ active });
      if (active !== "palm") {
        dispatch(getDashboardData(active));
      }

      const CancelToken = axios.CancelToken;
      const source = CancelToken.source();

      const fetchData = async () => {
        setIsLoading(false);
      };

      fetchData();
      return () => {
        source.cancel(CANCEL_REQUEST);
      };
    }
  }, [dispatch, history, isLoggedIn, props.location.state, user, keycloak]);
  // }, [dispatch, history, isLoggedIn, props.location.state, user])

  if (isLoading) {
    return <Loader center content="Loading" />;
  }
  const { activeKey, expanded } = sidenavState;
  const { active } = subnavState;
  return (
    <>
      <SuccessMessage
        action={action}
        show={successMessage}
        hide={() => setSuccessMessage("")}
      />
      {isLoggedIn && (
        <>
          <ContainerRS>
            <Header>
              <Navbar>
                <Navbar.Header id="header">
                  <div className="headerLayout">
                    {isAutherized(["Administrator", "Supervisor"]) && (
                      <MenuRoundedIcon
                        className="toggle"
                        onClick={() => toggleDrawer()}
                      />
                    )}
                    <img
                      className="progenyLogo"
                      alt="Progeny Management System"
                      src={logo}
                    />

                    <p className="title">Progeny Management System</p>

                    <NavRS pullRight className="logoutToggle">
                      <Dropdown
                        icon={
                          <AccountCircleRoundedIcon className="logoutLogo" />
                        }
                        title={GeneralHelper.buildDisplayName(
                          user.firstName,
                          user.lastName,
                          user.username
                        )}
                      >
                        {/* <Dropdown.Item
                          icon={<Icon icon="sign-out" />}
                          onClick={() => dispatch(logout())}
                        >
                          Logout
                        </Dropdown.Item> */}
                        <Dropdown.Item
                          icon={<Icon icon="sign-out" />}
                          onClick={() => {
                            keycloak.logout();
                          }}
                        >
                          Logout
                        </Dropdown.Item>
                      </Dropdown>
                    </NavRS>
                  </div>
                </Navbar.Header>
              </Navbar>
              {isAutherized(["Administrator"]) && (
                <div id="subNavigation">
                  <ProgenySubNavBar
                    active={active}
                    onSelect={handleSelect}
                    currentItem={currentSideItem}
                  />
                </div>
              )}
            </Header>
            {isAutherized(["Administrator"]) ? (
              <Content>
                <main id="contentSection">
                  <div className="content">
                    <section id="overview">
                      {isLoading ? (
                        <Loader center content="Loading" />
                      ) : (
                        <Container fluid>
                          {/* MAIN COMPOENTS */}
                          <TabPanel
                            currentSubNavState={subnavState}
                            currentItem={currentSideItem}
                          />
                        </Container>
                      )}
                    </section>
                  </div>
                </main>
                <NavRS pullRight></NavRS>
              </Content>
            ) : isAutherized(["Supervisor"])? (<Dashboard/>): (
              <AccessDenied />
            )}
            <Drawer
              id="sideNavigation"
              size="xs"
              placement="left"
              backdrop
              show={isDrawer}
              onHide={close}
            >
              <Drawer.Header>
                <img src={logo} className="progenyLogo" />
                <div className="title">
                  <b className="titleContent">Progeny</b>
                  <b className="titleContent">Management System</b>
                </div>
              </Drawer.Header>
              <Drawer.Body>
                <div style={{ width: "100% " }}>
                  <Sidenav
                    expanded={expanded}
                    activeKey={activeKey}
                    onSelect={handleSelectTab}
                  >
                    <Sidenav.Body>
                      <NavRS>
                        {listItems.map((item, i) => {
                          if (item.type === "multiple") {
                            return (
                              <Dropdown
                                eventKey={item.eventKey}
                                title={<p>{item.name}</p>}
                                icon={
                                  <img src={item.customIcon} alt="" key={i} />
                                }
                              >
                                {item.subItems.map((subitem, idx) => {
                                  return (
                                    <Dropdown.Item
                                      eventKey={subitem.eventKey}
                                      key={idx}
                                    >
                                      <p>{subitem.name}</p>
                                    </Dropdown.Item>
                                  );
                                })}
                              </Dropdown>
                            );
                          } else {
                            return (
                              <NavRS.Item
                                eventKey={item.eventKey}
                                icon={
                                  <item.customIcon
                                    className="contentIcon"
                                    key={i}
                                  />
                                }
                              >
                                <p>{item.name}</p>
                              </NavRS.Item>
                            );
                          }
                        })}
                      </NavRS>
                    </Sidenav.Body>
                  </Sidenav>
                </div>
              </Drawer.Body>
            </Drawer>
          </ContainerRS>
        </>
      )}
    </>
  );
};
export default Overview;
