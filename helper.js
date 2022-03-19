import moment from "moment";
//This is a helper function for the hbs for setting the ui of past messages
export default {
    messageShow: function (user, message, options) {
        let ele = ""
        message.forEach(element => {
            let date = new Date(element.time)
            console.log(date.getDate());
            let today = new Date()
            console.log(today.getDate())
            let momentVar = date.getDate() == today.getDate() ?
                moment(element.time).format("h:mm a") :
                moment(element.time).format("h:mm a DD-MM-YY")
            console.log(momentVar);
            if (element.from.username === user) {

                ele += `<div class="outgoing">
                <p>${element.context}</p><span class="text-muted">
                <small>${momentVar}</small>
                </span>
                </div>`
            } else {
                ele += `<div class="incoming">
                <div class="msgBy">${element.from.username}</div>
                <p>${element.context}</p><span class="text-muted">
                <small>${momentVar}</small>
                </span>
                </div>`
            }
        });
        return ele
    }
}
