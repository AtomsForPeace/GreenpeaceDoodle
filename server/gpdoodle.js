Lists = new Meteor.Collection('lists')

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
