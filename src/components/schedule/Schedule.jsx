import React from 'react';
import Paper from '@material-ui/core/Paper'
import { Scheduler, WeekView, Appointments, AppointmentTooltip, AppointmentForm, ConfirmationDialog } from '@devexpress/dx-react-scheduler-material-ui'
import { ViewState, EditingState, IntegratedEditing } from '@devexpress/dx-react-scheduler';
import { appointments } from './appointments'

const currentDate = '2020-06-04'


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

class Schedule extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: appointments,
            currentDate: currentDate
        };

        this.commitChanges = this.commitChanges.bind(this)
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
                        currentDate={currentDate}
                    />
                    <EditingState onCommitChanges={this.commitChanges} />
                    <IntegratedEditing />
                    <WeekView
                        startDayHour={9}
                        endDayHour={21}
                    />
                    <ConfirmationDialog />
                    <Appointments
                        appointmentComponent={Appointment} />
                    <AppointmentTooltip showOpenButton showDeleteButton />
                    <AppointmentForm />
                </Scheduler>
            </Paper >
        );
    }
}

export default Schedule;