Lists = new Meteor.Collection('lists')
// Participants = new Meteor.Collection('participants')

if (Meteor.isClient) {
  Session.setDefault('showListDialog', false)
  Session.setDefault('editingList', null)
  Session.setDefault('showDeleteDoodle', false)

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
    }
  });

  Template.participantList.helpers({
    participants: function(){
      return Lists.findOne(Session.get('editingList')).participants;
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
      Session.set('showDeleteDoodle', true);
      var confirmDelete = confirm("Doodle löschen?")
      if (confirmDelete == true) {
        removeList()
        Session.set('showListDialog', false);
        Session.set('editingList', null);
      } else {
        return false;
      }
    }
  });

  Template.participantList.events({
    'click .participantSave': function(event, template){
      var name = template.find('.participantName').value;
      var vote = template.find('.vote').value;
      addParticipants({participantId: Random.id(), participantName: name, vote: vote});
    },
    'click .removeParticipant': function(event, template){
      _id = event.target.getAttribute('data-id');
      console.log(_id)
      removeParticipant(_id);
    }
  });

  var addList = function(name, when, place){
    Lists.insert({
      name: name,
      when: when,
      place: place,
      participants: [],
    });
  };

  var updateList = function(name, when, place){
    Lists.update(Session.get('editingList'), {$set: {name: name, when: when, place: place}});
    return true;
  };

  var addParticipants = function(participants){
    Lists.update(Session.get('editingList'), {$push: {participants: participants}});
  };

  var removeParticipant = function(_id){
    console.log(1)
    Lists.update(Session.get('editingList'), {$pull: {participants: {participantId: _id}}})
    console.log(2)
  }

  var removeList = function(){
    Lists.remove({_id: Session.get('editingList')});
  };
}
