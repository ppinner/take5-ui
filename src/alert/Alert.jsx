import './alert.css';
import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {alertService, AlertType} from "./alert-service";

/*
    This file was copied from from a public GitHub library:
    https://github.com/cornflourblue/react-hooks-bootstrap-alerts

    Found via a blog post by Jason Watmore:
    https://jasonwatmore.com/post/2020/04/11/react-hooks-bootstrap-alert-notifications

    Some adaptions were made to simplify it for the application context.
 */
const propTypes = {
    id: PropTypes.string,
    fade: PropTypes.bool
};

const defaultProps = {
    id: 'default-alert',
    fade: true
};

function Alert({id, fade}) {
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        // subscribe to new alert notifications
        const subscription = alertService.onAlert(id)
            .subscribe(alert => {
                // clear alerts when an empty alert is received
                if (!alert.message) {
                    setAlerts(alerts => {
                        // filter out alerts without 'keepAfterRouteChange' flag
                        const filteredAlerts = alerts.filter(x => x.keepAfterRouteChange);

                        // remove 'keepAfterRouteChange' flag on the rest
                        filteredAlerts.forEach(x => delete x.keepAfterRouteChange);
                        return filteredAlerts;
                    });
                } else {
                    // add alert to array
                    setAlerts(alerts => ([...alerts, alert]));

                    // auto close alert
                    setTimeout(() => removeAlert(alert), 3000);
                }
            });

        // clean up function that runs when the component unmounts
        return () => {
            // unsubscribe & unlisten to avoid memory leaks
            subscription.unsubscribe();
        };
    }, []);

    function removeAlert(alert) {
        if (fade) {
            // fade out alert
            const alertWithFade = {...alert, fade: true};
            setAlerts(alerts => alerts.map(x => x === alert ? alertWithFade : x));

            // remove alert after faded out
            setTimeout(() => {
                setAlerts(alerts => alerts.filter(x => x !== alertWithFade));
            }, 250);
        } else {
            // remove alert
            setAlerts(alerts => alerts.filter(x => x !== alert));
        }
    }

    function cssClasses(alert) {
        if (!alert) return;

        const classes = ['alert', 'alert-dismissable'];

        const alertTypeClass = {
            [AlertType.Success]: 'alert alert-success',
            [AlertType.Error]: 'alert alert-danger',
            [AlertType.Info]: 'alert alert-info',
            [AlertType.Warning]: 'alert alert-warning'
        };

        classes.push(alertTypeClass[alert.type]);

        if (alert.fade) {
            classes.push('fade');
        }

        return classes.join(' ');
    }

    if (!alerts.length) return null;

    return (
        <div className="mx-3">
            {alerts.map((alert, index) =>
                <div key={index} className={cssClasses(alert)}>
                    <a className="close" onClick={() => removeAlert(alert)}>&times;</a>
                    <span dangerouslySetInnerHTML={{__html: alert.message}}></span>
                </div>
            )}
        </div>
    );
}

Alert.propTypes = propTypes;
Alert.defaultProps = defaultProps;
export {Alert};
