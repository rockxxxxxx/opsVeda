/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
var app = app || {};

(function () {
  "use strict";

  var Utils = app.Utils;
  const a = [];
  // Generic "model" object. You can use whatever
  // framework you want. For this application it
  // may not even be worth separating this logic
  // out, but we do this to demonstrate one way to
  // separate out parts of your application.
  app.TodoModel = function (key) {
    this.key = key;

    this.todos = Utils.store(key);
    this.onChanges = [];
  };

  app.TodoModel.prototype.subscribe = function (onChange) {
    this.onChanges.push(onChange);
  };

  app.TodoModel.prototype.inform = function () {
    Utils.store(this.key, this.todos);
    this.onChanges.forEach(function (cb) {
      cb();
    });
  };

  function time() {
    const d = new Date();
    const utc = d.getTime() + d.getTimezoneOffset() * 60000;
    const nd = new Date(utc + 3600000 * +5.5);
    const ist = nd.toLocaleTimeString();
    return ist;
  }

  function changeColor(a, b) {
    let c = "";
    if (a.indexOf(b) === 0) {
      c = "yellow";
    } else if (a.indexOf(b) === 1) {
      c = "red";
    } else if (a.indexOf(b) === 2) {
      c = "green";
    } else {
      c = "gray";
    }

    return c;
  }

  app.TodoModel.prototype.addTodo = function (title) {
    this.todos = this.todos.concat({
      id: Utils.uuid(),
      title: title,
      completed: false,
      timeAdded: time(),
    });

    this.inform();
  };

  app.TodoModel.prototype.toggleAll = function (checked) {
    // Note: it's usually better to use immutable data structures since they're
    // easier to reason about and React works very well with them. That's why
    // we use map() and filter() everywhere instead of mutating the array or
    // todo items themselves.
    this.todos = this.todos.map(function (todo) {
      console.log(todo);
      return Utils.extend({}, todo, { completed: checked });
    });

    this.inform();
  };

  app.TodoModel.prototype.toggle = function (todoToToggle) {
    a.length === 3
      ? (a.shift(), a.push(todoToToggle.id))
      : a.push(todoToToggle.id);

    this.todos = this.todos.map(function (todo, index) {
      let c = changeColor(a, todo.id);
      return todo !== todoToToggle
        ? Utils.extend({}, todo, {
            completed: todo.completed,
            change: todo.completed ? c : "black",
          })
        : Utils.extend({}, todo, {
            completed: !todo.completed,
            change: c,
            deletedAt: time(),
          });
    });

    this.inform();
  };

  app.TodoModel.prototype.destroy = function (todo) {
    this.todos = this.todos.filter(function (candidate) {
      return candidate !== todo;
    });

    this.inform();
  };

  app.TodoModel.prototype.save = function (todoToSave, text) {
    this.todos = this.todos.map(function (todo) {
      return todo !== todoToSave
        ? todo
        : Utils.extend({}, todo, { title: text });
    });

    this.inform();
  };

  app.TodoModel.prototype.clearCompleted = function () {
    this.todos = this.todos.filter(function (todo) {
      return !todo.completed;
    });

    this.inform();
  };
})();
