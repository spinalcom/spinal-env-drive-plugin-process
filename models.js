
function newGuid() {
    var d = new Date().getTime();
    var guid = 'xxxx-xxxx-xxxx-xxxx-xxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
    });
    return guid;
};


var VisaGroupModel = class VisaGroupModel extends Model {
    constructor() {
        super();
        this.add_attr({
            id : newGuid(),
            name : '',
            process : []
        });
    }
};

module.exports.VisaGroupModel = VisaGroupModel;


var ProcessModel = class ProcessModel extends Model {
    constructor(argPriority) {
        super();
        this.add_attr({
            id : newGuid(),
            name : '',
            color: '',
            items : [],
            priority : argPriority
        });
    }
};

module.exports.ProcessModel = ProcessModel;


var StateModel = class StateModel extends Model {
    constructor(argPriority) {
        super();
        this.add_attr({
            groupId : "",
            stateId : "",
            priority : argPriority,
            date : 0
        });
    }
};

module.exports.StateModel = StateModel;