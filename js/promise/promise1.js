class MyPormise {
    #initialState = 'pending'
    #resolvedState = 'fulfilled'
    #rejectedState = 'rejected'
    value = undefined
    state = this.#initialState
    resolveCallBack = null
    rejectCallBack = null
    constructor (excutor) {
        excutor(this.resolve.bind(this), this.reject.bind())
    }
    resolve (data) {
        if (this.state === this.#initialState) {
            this.state = this.#resolvedState
            this.value = data
            this.resolveCallBack && this.resolveCallBack(this.value)
        }
    }
    reject (error) {
        if (this.state === this.#initialState) {
            this.state = this.#rejectedState
            this.value = error
            this.rejectCallBack && this.rejectCallBack(this.value)
        }
    }
    then (callBack) {
        if (this.state === this.#initialState) {
            this.resolveCallBack = callBack
        }
        if (this.state === this.#resolvedState) {
            this.resolveCallBack = callBack
            this.resolveCallBack(this.value)
        }
    }
    catch (callBack) {
        if (this.state === this.#initialState) {
            this.rejectCallBack = callBack
        }
        if (this.state === this.#rejectedState) {
            this.rejectCallBack = callBack
            this.rejectCallBack(this.value)
        }
    }
}

let promise = new MyPormise(function (resolve, reject) {
    let data = 'initial data'
    setTimeout(function  () {
        data = 'got data'
        resolve(data)
    }, 5000)
})
promise.then(function(data){
    console.log('invoked in callback', data)
})