
class RequestQueue {
    protected _queue: any[] = [];

    // constructor(){
    //     this._queue = [];
    // }    

    enqueue(key: string, value: any){
        this._queue.push({
            key: key,
            value: value,
        });
    };
    
    update(){
        if(this._queue.length === 0) return;
    
        var top = this._queue[0];
        if(top.value.isRequestReady()){
            this._queue.shift();
            if(this._queue.length !== 0){
                this._queue[0].value.startRequest();
            }
        }else{
            top.value.startRequest();
        }
    };
    
    raisePriority(key: string){
        for(var n = 0; n < this._queue.length; n++){
            var item = this._queue[n];
            if(item.key === key){
                this._queue.splice(n, 1);
                this._queue.unshift(item);
                break;
            }
        }
    };
    
    clear(){
        this._queue.splice(0);
    };    
}


