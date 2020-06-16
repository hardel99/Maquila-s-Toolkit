import React from 'react';
import Paper from '@material-ui/core/Paper'
import { ViewState, EditingState } from '@devexpress/dx-react-scheduler';
import { connectProps } from '@devexpress/dx-react-core';
import { appointments } from './appointments'
import { AppointmentFormContainerBasic } from './form/appointmentForm'
import { withStyles } from '@material-ui/core/styles';
import {
    Scheduler,
    DayView,
    WeekView,
    MonthView,
    ViewSwitcher,
    Toolbar,
    DateNavigator,
    TodayButton,
    Appointments,
    AppointmentTooltip,
    AppointmentForm,
    ConfirmationDialog,
    DragDropProvider,
    EditRecurrenceMenu
} from '@devexpress/dx-react-scheduler-material-ui'
import { Dialog, DialogContent, DialogActions, DialogTitle, DialogContentText, Button, Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add'

const now = new Date()
var dd = String(now.getDate()).padStart(2, '0');
var mm = String(now.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = now.getFullYear();

var currentDate = yyyy + '-' + mm + '-' + dd + 'T' + now.getHours() + ':' + now.getMinutes();

const Appointment = ({
    children, style, ...restProps
}) => (
        <Appointments.Appointment
            {...restProps}
            style={{
                ...style,
                backgroundColor: '#940e0e',
                borderRadius: '8px',
            }}
        >
            {children}
        </Appointments.Appointment>
    );

const containerStyles = theme => ({
    container: {
        width: theme.spacing(68),
        padding: 0,
        paddingBottom: theme.spacing(2),
    },
    content: {
        padding: theme.spacing(2),
        paddingTop: 0,
    },
    header: {
        overflow: 'hidden',
        paddingTop: theme.spacing(0.5),
    },
    closeButton: {
        float: 'right',
    },
    buttonGroup: {
        display: 'flex',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 2),
    },
    button: {
        marginLeft: theme.spacing(2),
    },
    picker: {
        marginRight: theme.spacing(2),
        '&:last-child': {
            marginRight: 0,
        },
        width: '50%',
    },
    wrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: theme.spacing(1, 0),
    },
    icon: {
        margin: theme.spacing(2, 0),
        marginRight: theme.spacing(2),
    },
    textField: {
        width: '100%',
    },
});

const AppointmentFormContainer = withStyles(containerStyles, { name: 'AppointmentFormContainer' })(AppointmentFormContainerBasic);

class Schedule extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: appointments,
            currentDate: currentDate,
            confirmationVisible: false,
            editingFormVisible: false,
            deletedAppointmentId: undefined,
            editingAppointment: undefined,
            previousAppointment: undefined,
            addedAppointment: {},
            startDayHour: 9,
            endDayHour: 19,
            isNewAppointment: false,
        };

        this.commitChanges = this.commitChanges.bind(this);
        this.onEditingAppointmentChange = this.onEditingAppointmentChange.bind(this);
        this.onAddedAppointmentChange = this.onAddedAppointmentChange.bind(this);

        this.toogleConfirmationVisible = this.toogleConfirmationVisible.bind(this);
        this.commitDeleteAppointment = this.commitDeleteAppointment.bind(this);
        this.toogleEditingFormVisibility = this.toogleEditingFormVisibility.bind(this);

        this.appointmentForm = connectProps(AppointmentFormContainer, () => {
            const {
                editingFormVisible,
                editingAppointment,
                data,
                addedAppointment,
                isNewAppointment,
                previousAppointment,
            } = this.state;

            const currentAppointment = data.filter(appointment => editingAppointment && appointment.id === editingAppointment.id)[0] || addedAppointment;

            const cancelAppointment = () => {
                if (isNewAppointment) {
                    this.setState({
                        editingAppointment: previousAppointment,
                        isNewAppointment: false,
                    });
                }
            };

            return {
                visible: editingFormVisible,
                appointmentData: currentAppointment,
                commitChanges: this.commitChanges,
                visibleChange: this.toogleEditingFormVisibility,
                onEditingAppointmentChange: this.onEditingAppointmentChange,
                cancelAppointment,
            }
        });
    }

    componentDidUpdate() {
        this.appointmentForm.update();
    }

    onEditingAppointmentChange(editingAppointment) {
        this.setState({ editingAppointment });
    }

    onAddedAppointmentChange(addedAppointment) {
        this.setState({ addedAppointment });
        const { editingAppointment } = this.state;

        if (editingAppointment !== undefined) {
            this.setState({
                previousAppointment: editingAppointment,
            });
        }

        this.setState({ editingAppointment: undefined, isNewAppointment: true });
    }

    commitChanges({ added, changed, deleted }) {
        this.setState((state) => {
            let { data } = state;
            if (added) {
                const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
                data = [...data, { id: startingAddedId, ...added }];
            }
            if (changed) {
                data = data.map(appointment => (
                    changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment
                ));
            }
            if (deleted !== undefined) {
                data = data.filter(appointment => appointment.id !== deleted);
            }
            return { data };
        });
    }

    setDeleteAppointment(id) {
        this.setState({ deleteAppointmentId: id });
    }

    toogleEditingFormVisibility() {
        const { editingFormVisible } = this.state;
        this.setState({
            editingFormVisible: !editingFormVisible
        });
    }

    toogleConfirmationVisible() {
        const { confirmationVisible } = this.state;
        this.setState({ confirmationVisible: !confirmationVisible });
    }

    commitDeleteAppointment() {
        this.setState(state => {
            const { data, deletedAppointmentId } = state;
            const nextData = data.filter(appointment => appointment.id !== deletedAppointmentId);

            return { data: nextData, deletedAppointmentId: null }   //!May have ;
        });

        this.toogleConfirmationVisible();
    }


    render() {
        const { data, currentDate, confirmationVisible, editingFormVisible } = this.state;

        return (
            <Paper>
                <Scheduler
                    data={data}
                >
                    <ViewState
                        defaultCurrentDate={currentDate}
                        defaultCurrentViewName='Month'
                    />
                    <EditingState
                        onCommitChanges={this.commitChanges}
                        onEditingAppointmentChange={this.onEditingAppointmentChange}
                        onAddedAppointmentChange={this.onAddedAppointmentChange} />
                    <EditRecurrenceMenu />

                    <DayView
                        startDayHour={9}
                        endDayHour={21}
                    />
                    <WeekView
                        startDayHour={9}
                        endDayHour={21}
                    />

                    <MonthView />
                    <Toolbar />
                    <DateNavigator />
                    <TodayButton />
                    <ViewSwitcher />

                    <ConfirmationDialog />
                    <Appointments
                        appointmentComponent={Appointment} />
                    <AppointmentTooltip showOpenButton showDeleteButton showCloseButton />
                    <DragDropProvider />
                    <AppointmentForm
                        overlayComponent={this.appointmentForm}
                        visible={editingFormVisible}
                        onVisibilityChange={this.toogleEditingFormVisibility} />
                </Scheduler>

                <Dialog open={confirmationVisible} onClose={this.cancelDelete}>
                    <DialogTitle>Delete Appointment</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this appointment?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.toogleConfirmationVisible}
                            color="primary"
                            cariant="outlined">
                            Cancel
                        </Button>
                        <Button onClick={this.commitDeleteAppointment}
                            color="secondary"
                            variant="outlined">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>

                <Fab
                    color="secondary"
                    style={{
                        position: 'fixed',
                        bottom: 24,
                        right: 32,
                    }}
                    onClick={() => {
                        this.setState({ editingFormVisible: true });
                        this.onEditingAppointmentChange(undefined);
                        this.onAddedAppointmentChange({
                            startDate: new Date(currentDate).setHours(9),
                            endDate: new Date(currentDate).setHours(10)
                        });
                    }}>
                    <AddIcon />
                </Fab>
            </Paper >
        );
    }
}

export default Schedule;