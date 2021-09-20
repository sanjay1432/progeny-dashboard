import { Subject } from "rxjs"
// The Main Subject/Stream to be listened on.
export const progenySubject = new Subject()
// This function is used to publish data to the Subject via next().
export const publish = data => progenySubject.next(data)

export const activeDashboard = new Subject()
export const changeActive = data => activeDashboard.next(data)
