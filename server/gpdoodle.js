Lists = new Meteor.Collection('lists')
Participants = new Meteor.Collection('participants')

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
