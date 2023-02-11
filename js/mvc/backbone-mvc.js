// Model表示数据层，也就是程序需要的数据源，通常使用JSON格式表示。

// View表示表现层，也就是用户界面，对于网页来说，就是用户看到的网页HTML代码。

// Controller表示控制层，用来对原始数据（Model）进行加工，传送到View。
var AppName = {
    Models: {},
    Views: {},
    Controllers: {}
}

// model
AppName.Models.Person = Backbone.Model.extend({
    urlRoot: "/persons"
})

// view
AppName.Views.Modals.AcceptDecline = Backbone.View.Extend({
    el: ".modal-accept",
  
    events: {
      "ajax:success .link-accept" :"acceptSuccess",
      "ajax:error   .link-accept" :"acceptError"
    },
  
    acceptSuccess :function(evt, response) {
      this.$el.modal("hide")
      alert('Cool! Thanks')
    },
  
    acceptError :function(evt, response) {
      var $modalContent = this.$el.find('.panel-modal');
  
      $modalContent.append("Something was wrong!")
    }
  })

  // Controller
  AppName.Controllers.Person = {};
  AppName.Controllers.Person.show = function(id) {
    // 调度model 拿到数据
    var aMa = new AppName.Models.Person({id: id})

    aMa.updateAge(25);
 
    aMa.fetch().done(function(){
        // 更新视图
        var view = new AppName.Views.Show({model: aMa})
    })
  }