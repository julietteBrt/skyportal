import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import {
  makeStyles,
  createMuiTheme,
  MuiThemeProvider,
  useTheme,
} from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CircularProgress from "@material-ui/core/CircularProgress";
import MUIDataTable from "mui-datatables";
import dayjs from "dayjs";

import * as Actions from "../ducks/source";
import * as UserActions from "../ducks/users";

const useStyles = makeStyles(() => ({
  container: {
    margin: "1rem 0",
  },
  accordion: {
    width: "99%",
  },
  assignmentTable: {
    borderSpacing: "0.7em",
  },
  verticalCenter: {
    margin: 0,
    position: "absolute",
    top: "50%",
    msTransform: "translateY(-50%)",
    transform: "translateY(-50%)",
  },
}));

// Tweak responsive styling
const getMuiTheme = (theme) =>
  createMuiTheme({
    palette: theme.palette,
    overrides: {
      MUIDataTable: {
        paper: {
          width: "100%",
        },
      },
      MUIDataTableBodyCell: {
        stackedCommon: {
          overflow: "hidden",
          "&:last-child": {
            paddingLeft: "0.25rem",
          },
        },
      },
      MUIDataTablePagination: {
        toolbar: {
          flexFlow: "row wrap",
          justifyContent: "flex-end",
          padding: "0.5rem 1rem 0",
          [theme.breakpoints.up("sm")]: {
            // Cancel out small screen styling and replace
            padding: "0px",
            paddingRight: "2px",
            flexFlow: "row nowrap",
          },
        },
        tableCellContainer: {
          padding: "1rem",
        },
        selectRoot: {
          marginRight: "0.5rem",
          [theme.breakpoints.up("sm")]: {
            marginLeft: "0",
            marginRight: "2rem",
          },
        },
      },
    },
  });

const AssignmentList = ({ assignments }) => {
  const styles = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();

  const deleteAssignment = (id) => {
    dispatch(Actions.deleteAssignment(id));
  };

  const { users: allUsers } = useSelector((state) => state.users);
  const { observingRunList } = useSelector((state) => state.observingRuns);
  const { instrumentList } = useSelector((state) => state.instruments);

  // use useEffect to only send 1 fetchUser per User
  useEffect(() => {
    if (allUsers.length === 0) {
      dispatch(UserActions.fetchUsers());
    }
  }, [allUsers, dispatch]);

  if (allUsers.length === 0) {
    return (
      <div>
        <CircularProgress color="secondary" />
      </div>
    );
  }

  if (assignments.length === 0) {
    return <b>No assignments to show for this object...</b>;
  }

  if (observingRunList.length === 0) {
    return (
      <div>
        <CircularProgress color="secondary" />
      </div>
    );
  }

  const observingRunDict = {};
  observingRunList.forEach((run) => {
    observingRunDict[run.id] = run;
  });

  assignments.sort(
    (a, b) =>
      dayjs(observingRunDict[a.run_id].calendar_date).unix() -
      dayjs(observingRunDict[b.run_id].calendar_date).unix()
  );

  const renderRunId = (value) => <a href={`/run/${value}`}>{value}</a>;

  const renderRequester = (value, tableMeta) => {
    const { requester_id } = assignments[tableMeta.rowIndex];
    const requester = allUsers.find((user) => user.id === requester_id);
    return requester?.username || "Loading...";
  };

  const renderInstrument = (value, tableMeta) => {
    const { run_id } = assignments[tableMeta.rowIndex];
    const run = observingRunList?.filter((r) => r.id === run_id)[0];
    const instrument_id = run?.instrument_id;
    const instrument = instrumentList?.filter((i) => i.id === instrument_id)[0];
    return instrument?.name || "Loading...";
  };

  const renderRunDate = (value, tableMeta) => {
    const { run_id } = assignments[tableMeta.rowIndex];
    const run = observingRunList?.filter((r) => r.id === run_id)[0];
    return run?.calendar_date || "Loading...";
  };

  const renderPI = (value, tableMeta) => {
    const { run_id } = assignments[tableMeta.rowIndex];
    const run = observingRunList?.filter((r) => r.id === run_id)[0];
    return run?.pi || "Loading...";
  };

  const renderDelete = (dataIndex) => {
    const { id } = assignments[dataIndex];
    return (
      <span>
        <IconButton
          aria-label="delete-assignment"
          onClick={() => {
            deleteAssignment(id);
          }}
        >
          <DeleteIcon />
        </IconButton>
      </span>
    );
  };

  const columns = [
    {
      name: "run_id",
      label: "Run Id",
      options: {
        customBodyRender: renderRunId,
      },
    },
    {
      name: "requester",
      label: "Requester",
      options: {
        customBodyRender: renderRequester,
      },
    },
    {
      name: "instrument",
      label: "Instrument",
      options: {
        customBodyRender: renderInstrument,
      },
    },
    {
      name: "runDate",
      label: "Run Date",
      options: {
        customBodyRender: renderRunDate,
      },
    },
    {
      name: "pi",
      label: "PI",
      options: {
        customBodyRender: renderPI,
      },
    },
    { name: "priority", label: "Priority" },
    { name: "status", label: "Status" },
    { name: "comment", label: "Comment" },
    {
      name: "delete",
      label: "Delete",
      options: {
        customBodyRenderLite: renderDelete,
      },
    },
  ];

  const options = {
    filter: false,
    sort: false,
    print: true,
    download: true,
    search: true,
    selectableRows: "none",
    elevation: 0,
    rowsPerPageOptions: [1, 10, 15],
  };

  return (
    <div className={styles.container}>
      <Accordion className={styles.accordion}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="observing-run-assignments"
          id="observing-run-assignments-header"
        >
          <Typography variant="subtitle1">Assignments</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <MuiThemeProvider theme={getMuiTheme(theme)}>
            <MUIDataTable
              data={assignments}
              options={options}
              columns={columns}
            />
          </MuiThemeProvider>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

AssignmentList.propTypes = {
  assignments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      requester: PropTypes.shape({
        id: PropTypes.number,
        username: PropTypes.string,
      }),
      run: PropTypes.shape({
        pi: PropTypes.string,
        calendar_date: PropTypes.string,
      }),
      priority: PropTypes.string,
      status: PropTypes.string,
      comment: PropTypes.string,
    })
  ).isRequired,
};

export default AssignmentList;
