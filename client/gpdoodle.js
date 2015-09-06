Lists = new Meteor.Collection('lists')
Participants = new Meteor.Collection('participants')

if (Meteor.isClient) {
  Session.setDefault('showListDialog', false)
  Session.setDefault('editingList', null)

  Router.route('/', function () {
    this.render('homepage');
  });

  Handlebars.registerHelper("formatDate", function(datetime) {
    if (moment) {
      return moment(datetime).format("DD/MM/YYYY");
    }
    else {
      return datetime;
    }
  });

  Template.homepage.helpers({
    title: 'Greenpeace Dresden Doodle',
    editingList: function(){
      return Session.get('editingList')
    },
    showListDialog: function(){
      return Session.get('showListDialog')
    },
    lists: function(){
      return Lists.find();
    },
  });

  Template.doodle.helpers({
    editingList: function(){
      return Session.get('editingList')
    },
    showListDialog: function(){
      return Session.get('showListDialog')
    },
    list: function(){
      return Lists.findOne(Session.get('editingList'));
    },
    participant: function(){
      return Participants.find({
        doodle: Session.get('editingList')
      });
    },
  });

  Template.homepage.events({
    'click .addList': function(event, template){
      Session.set('showListDialog', true);
    }
  });

  Template.listRow.events({
    'dblclick .listRow': function(event, template){
      Session.set('editingList', template.data._id);
      Session.set('showListDialog', true);
    }
  });

  Template.doodle.events({
    'click .save': function(event, template){
      var name = template.find('.name').value;
      var when = template.find('.when').value;
      var place = template.find('.place').value;
      if (Session.get('editingList')){
        updateList(name, when, place);
      } else {
        addList(name, when, place);
      }
      Session.set('showListDialog', false);
      Session.set('editingList', null);
    },
    'click .cancel': function(event, template){
      Session.set('showListDialog', false);
      Session.set('editingList', null);
    },
    'click .close': function(event, template){
      Session.set('showListDialog', false);
      Session.set('editingList', null);
    },
    'click .remove': function(event, template){
      removeList()
      Session.set('showListDialog', false);
      Session.set('editingList', null);
    }
  });

  Template.participantList.events({
    'click .participantSave': function(event, template){
      var name = template.find('.participantName').value;
      var vote = template.find('.vote').value;
      console.log(123)
      Participants.insert({
        doodle: Session.get('editingList'),
        name: name,
        vote: vote
      });
    }
  });

  var addList = function(name, when, place){
    Lists.insert({
      name: name,
      when: when,
      place: place
    });
  };

  var updateList = function(name, when, place){
    Lists.update(Session.get('editingList'), {$set: {name: name, when: when, place: place}});
    return true;
  };

  var removeList = function(){
    Lists.remove({_id: Session.get('editingList')});
  };
}
