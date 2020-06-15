import React from 'react';
import Paper from '@material-ui/core/Paper'
import { ViewState, EditingState, IntegratedEditing } from '@devexpress/dx-react-scheduler';
import { connectProps } from '@devexpress/dx-react-core';
import { appointments } from './appointments'
import { AppointmentFormContainerBasic } from './form/appointmentForm'
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
    DragDropProvider
} from '@devexpress/dx-react-scheduler-material-ui'


const now = new Date()
var dd = String(now.getDate()).padStart(2, '0');
var mm = String(now.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = now.getFullYear();

var currentDate = yyyy + '-' + mm + '-' + dd + 'T' + now.getHours() + ':' + now.getMinutes()


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

const style = theme => ({
    addButton: {
        position: 'absolute',
        bottom: theme.spacing(1) * 3,
        right: theme.spacing(1) * 4,
    },
});

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
        this.commitDeleteAppointment = this.commitDeleteAppoint.bind(this);
        this.toogleEditingFormVisibility = this.toogleEditingFormVisibility.bind(this);

        this.appointmentForm = connectProps(AppointmentFormContainerBasic, () => {
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
                visibleChanges: this.toogleEditingFormVisibility,
                onEditingAppointmentChange: this.onEditingAppointmentChange,
                cancelAppointment,
            }       //!Maybe has ;
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


    render() {
        const { data, currentDate } = this.state;

        return (
            <Paper>
                <Scheduler
                    data={data}
                >
                    <ViewState
                        defaultCurrentDate={currentDate}
                        defaultCurrentViewName='Week'
                    />
                    <EditingState onCommitChanges={this.commitChanges} />
                    <IntegratedEditing />

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
                    <AppointmentForm />
                </Scheduler>
            </Paper >
        );
    }
}

export default Schedule;