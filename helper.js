import moment from "moment";
//This is a helper function for the hbs for setting the ui of past messages
export default {
    messageShow: function(user, message, options){
        let ele = ""
        message.forEach(element => {
            if(element.from.username===user){
                ele+=`<div class="outgoing">
                <p>${element.context}</p><span class="text-muted">
                <small>${moment(element.time).format("h:mm a")}</small>
                </span>
                </div>`
            }else{
                ele+=`<div class="incoming">
                <div class="msgBy">${element.from.username}</div>
                <p>${element.context}</p><span class="text-muted">
                <small>${moment(element.time).format("h:mm a")}</small>
                </span>
                </div>`
            }
        });
        return ele
    }
}
