/**
 * 1、Model 数据管理，主要负责和服务器交互。将请求到的数据传给Controller。
 * 2、View负责用户界面，HTML渲染。
 * 3、Controller 负责监听并处理View的事件，更新和调用Model；也负责监听Model的变化，并且更新View。Controller控制其他所有流程。
 */

!function () {
    var view = View('.message')
    var model = Model({ resourceName: 'Message' })

    var controller = Controller({
        init: function (view, model) {
            this.messageList = view.querySelector('#messageList')
            this.form = view.querySelector('form')
            this.loadMessages()
        },
        loadMessages: function () {
            model.fetch.then(
                (messages) => {
                    let array = messages.map((item) => item.attributes)
                    array.forEach((item) => {
                        let li = document.createElement('li')
                        li.innerText = `${item.name}: ${item.content}`
                        this.messageList.appendChild(li)
                    })
                },
                function (error) {
                    alert('提交失败')
                }
            )
        },
        bindEvents: function () {
            //表单提交存储数据
            this.form.addEventListener('submit', function (e) {
                e.preventDefault()
                this.saveMessages()
            }.bind(this))
        },
        saveMessages: function () {
            let myForm = this.form
            let content = myForm.querySelector('input[name=content]').value
            let name = myForm.querySelector('input[name=name]').value
            if (content === '' || name === '') {
                document.querySelector('.notice').classList.add('noticeVisible')
            }else{
                document.querySelector('.notice').classList.remove('noticeVisible')
                this.model.save({ 'name': name, 'content': content }).then(function (object) {
                    let li = document.createElement('li')
                    li.innerText = `${object.attributes.name}: ${object.attributes.content}`
                    let messageList = document.querySelector('#messageList')
                    messageList.appendChild(li)
                    myForm.querySelector('input[name=content]').value = ''
                    console.log(object)
                })
            }
            
        }
    })
} ()