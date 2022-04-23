import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

/*
    This file was copied from from a public GitHub library:
    https://github.com/cornflourblue/react-hooks-bootstrap-alerts

    Some adaptions were made to simplify it for the application context.
 */
const alertSubject = new Subject();
const defaultId = 'default-alert';

export const alertService = {
    onAlert,
    success,
    error,
    info,
    warn,
    alert,
    clear
};

export const AlertType = {
    Success: 'Success',
    Error: 'Error',
    Info: 'Info',
    Warning: 'Warning'
}

// enable subscribing to alerts observable
function onAlert(id = defaultId) {
    return alertSubject.asObservable().pipe(filter(x => x && x.id === id));
}

// convenience methods
function success(message, options) {
    alert({ ...options, type: AlertType.Success, message });
}

function error(message, options) {
    alert({ ...options, type: AlertType.Error, message });
}

function info(message, options) {
    alert({ ...options, type: AlertType.Info, message });
}

function warn(message, options) {
    alert({ ...options, type: AlertType.Warning, message });
}

// core alert method
function alert(alert) {
    alert.id = alert.id || defaultId;
    alertSubject.next(alert);
}

// clear alerts
function clear(id = defaultId) {
    alertSubject.next({ id });
}