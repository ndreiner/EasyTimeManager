// Class definition of Task and Tasklist
class Task {
    constructor(name, startDateTime = new Date(), endDateTime = null){
        this.name = name;
        this.startDateTime = startDateTime;
        this.endDateTime = endDateTime;
    }

    /**
     * Checks is the Task is finished
     * @returns {boolean}     true if the Task is has an endDate
     */
    isFinished(){
        return this.endDateTime !== null ;
    };

    /**
     * exports the Task as Json ready object
     * @returns {object}      JSON ready Object
     */
    toJSON(){
        let endDateTime_co = null;
        if (this.isFinished()){
            endDateTime_co = this.endDateTime.toJSON();
        };

        let json = {
            "name": this.name,
            "startDateTime": this.startDateTime.toJSON(),
            "endDateTime": endDateTime_co,
        };

        return(json);
    };
    /** 
     * 
     * @param {Date} endDateTime The Timestamp as Date(). Default ist the current Timestamp
     */
    finish(endDateTime =  new Date()){
        this.endDateTime = endDateTime;
    };
}

class TaskList extends Array{
    constructor(...args){
        super(...args);
    };
    push(task){
        if (this.length > 0){
            let lastTask = this[this.length-1];
            if(!lastTask.isFinished()){
                // finish the Last Task with the current Date
                this.finishLastTask(new Date());
            };
        };
        super.push(task)
    };

    /**
     * Finishes the last task of the List with the desired timestamp. Last Task has to be unfinished.
     * @param {Date} endDateTime  Timestamp of the desired finish time. Default is the current Timestamp "new Date()"
     */
    finishLastTask(endDateTime =  new Date()){

        // Check wether there is a Last Task
        if (this.length == 0){
            const e = Error("There is no former Task to finish.");
        };

        let lastTask = this[this.length-1];
        if(!lastTask.isFinished()){
            lastTask.finish();
            // refill last task with updated end date value
            this[this.length-1] = lastTask;
        } else {
            // issue Error if alreaedy filled
            const e= Error("Last Task already has an enddate");
        }
    };

    getAllTasks(unique = true){
        let result = [];
        result = this.map((task) =>{
            return(task.name)
        });
       
        if(unique){
            result=[...new Set(result)]
        }; // end if
    return(result)
    }; // end function

    parseJSON(json){
        if(this.length){
            const e = Error("Can only Parse JSON into empty List.");
        };
        json = JSON.parse(json)
        for (let i in json) {
            let object = json[i];
            console.log(object)
            this.push(
                new Task(
                    object.name,
                    new Date(object.startDateTime),
                    new Date(object.endDateTime)
                    )
            );
        };
    };
};

exports.Task       = Task;
exports.TaskList   = TaskList;


