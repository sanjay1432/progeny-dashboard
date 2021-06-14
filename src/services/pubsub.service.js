import { Subject } from "rxjs"
// The Main Subject/Stream to be listened on.
export const mainSubject = new Subject()
// This function is used to publish data to the Subject via next().
export const publish = data => mainSubject.next(data)
