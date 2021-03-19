<template>
  <div class="container">
    <div class="container__content">
      <header class="container__header">
        <div class="container__title">
          <i class="fa fa-tasks fa-3x"></i>
          <h1 v-if="!editMode">My Todo-s</h1>
          <h1 v-else>Edit Mode</h1>

          <button class="container__close-edition" v-if="editMode" @click="editMode = false">
            <img src="../../assets/cross.svg" alt="" title="Close edition mode">
          </button>
        </div>

        <form @submit="checkForm" class="container__form">
          <input
            v-if="!editMode"
            class="container__input"
            type="text"
            v-model.trim="newTodo"
            placeholder="Create a new todo..."
          />

          <input
            v-else
            class="container__input"
            type="text"
            v-model.trim="newTodo"
            :placeholder="alreadyTodo.description"
          />

          <div class="container__info"> 
            <i id="tags1" class="fas fa-tags" title="Edit tags"></i>
            <div class="container__tags" v-if="!editMode">
              <vue-tags-input
              v-model="tag"
              :tags="tags"
              @tags-changed="newTags => tags = newTags"
              />
            </div>

            <div class="container__tags" v-else>
              <vue-tags-input
              v-model="tag"
              :tags="alreadyTodo.tags"
              @tags-changed="newTags => tags = newTags"
              />
            </div>
          </div>

          <div class="container__info">
            <label for="date"
              ><i class="fas fa-calendar-alt" title="Insert date"></i
            ></label>

            <div class="container__date-hour">
              <input
                v-if="!editMode"
                type="text"
                placeholder="Date"
                id="date"
                readonly
                @focus="showCalendar = true"
                v-model="todoDate"
              />
              <input
                v-else
                type="text"
                value="20"
                :placeholder="alreadyTodo.date"
                id="date"
                readonly
                @focus="showCalendar = true"
                v-model="todoDate"
              />
              <div>
                <datepicker
                  color="#5c6bc0"
                  v-if="showCalendar"
                  v-model="todoDate"
                  @close="showCalendar = false"
                  :min="minDate"
                >
                </datepicker>
              </div>
              <input
              v-if="!editMode"
                type="number"
                v-model="todoTime"
                placeholder="Time (hour)"
                min="1"
                max="24"
                id="time"
              />
              <input
              v-else
                type="number"
                v-model="todoTime"
                :placeholder="alreadyTodo.time"
                min="1"
                max="24"
                id="time"
              />
            </div>
          </div>

          <div class="container__info">
            <i class="fas fa-clock" title="Time to perform the task"></i>
            <input
            v-if="!editMode"
              placeholder="Dedicated time (min)"
              type="number"
              step="5"
              min="5"
              v-model="doTimeTodo"
            />

            <input
              v-else
              :placeholder="alreadyTodo.doTime"
              type="number"
              step="5"
              min="5"
              v-model="doTimeTodo"
            />
          </div>

          <div class="container__info">
            <i class="fas fa-bell" title="Todo reminder(min)"></i>
            <input
              v-if="!editMode"
              placeholder="Todo reminder (min)"
              type="number"
              step="5"
              min="5"
              max="120"
              v-model="reminderTodo"
            />
            <input
              v-else
              :placeholder="alreadyTodo.reminderTime"
              type="number"
              step="5"
              min="5"
              max="120"
              v-model="reminderTodo"
            />
          </div>

          <input class="container__add" v-if="!editMode" type="submit" value="Add a todo" />
          <input class="container__add" v-else type="submit" value="Edit todo" />

        </form>

        <div class="container__options">
          <ul>
            <li>
              <a
                href="#"
                @click.prevent="visibility = 'all'"
                :class="{ selected: visibility == 'all' }"
                >All</a
              >
            </li>
            <li>
              <a
                href="#"
                @click.prevent="visibility = 'active'"
                :class="{ selected: visibility == 'active' }"
                >Active</a
              >
            </li>
            <li>
              <a
                href="#"
                @click.prevent="visibility = 'completed'"
                :class="{ selected: visibility == 'completed' }"
                >Completed</a
              >
            </li>
          </ul>
        </div>
      </header>

      <main class="container__main">
        <ul class="container__list">
          <li v-for="todo in filteredTodo" v-bind:key="todo" v-bind:todo="todo">
            <div class="container__item">
              <div class="container__checkbox">
                <input
                  type="checkbox"
                  @click="completeTodo(todo)"
                  id="check-input"
                  v-model="todo.isCompleted"
                />
                <label for="check-input"></label>
              </div>

              <button class="container__open-info" type="button">
                <i
                  class="fas fa-info-circle"
                  :title="todo.description"
                  @click="showInfoModal = true"
                ></i>
              </button>

              <div
                class="container__overlay"
                v-if="showInfoModal"
                @click.self="showInfoModal = false"
              >
                <div class="container__modal">
                  <div>
                    <i class="fa fa-tasks fa-3x"></i>
                    <h2>Todo Info</h2>
                  </div>
                  <ul>
                    <li><i class="fas fa-calendar-alt" aria-hidden="true"></i>Deadline: {{ todo.date }} at {{ todo.time }}h</li>
                    <li><i class="fas fa-bell" aria-hidden="true"></i>Reminder: {{ todo.reminderTime }} min</li>
                    <li><i class="fas fa-clock" aria-hidden="true"></i>Do in: {{ todo.doTime }} min</li>
                  </ul>
                </div>
              </div>

              <div class="container__description">
                <p :class="{ completed: todo.isCompleted }">
                  {{ todo.description }}
                </p>
              </div>

              <div class="container__modifiers">
                <button @click="editTagsTodo(todo)">
                  <i id="tags" class="fas fa-tags fa-2x" title="Edit tags"></i>
                </button>
                <button @click="editTodo(todo)">
                  <i
                    id="edit"
                    class="fa fa-pencil text-info btn m-0 p-0 fa-2x"
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title="Update todo"
                  ></i>
                </button>

                <button @click="deleteTodo(todo)">
                  <i
                    id="delete"
                    class="fa fa-trash-o text-danger btn m-0 p-0 fa-2x"
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title="Delete todo"
                  ></i>
                </button>
              </div>
            </div>
          </li>
        </ul>
      </main>
    </div>
  </div>
</template>

<script>
import DatePicker from "vue-md-date-picker";
import VueTagsInput from '@johmun/vue-tags-input';

import { selectCategory } from '../../features/selectCategory'
import { getMinDate } from '../../features/getMinDate'

export default {
  name: "TodoList",
  data() {
    return {
      todos: [],
      errors: [],

      tag: '',
      tags: [],

      visibility: "all",
      minDate: null,

      showCalendar: null,
      showInfoModal: null,
      
      editMode: null,

      alreadyTodo: null,

      newTodo: null,
      todoDate: null,
      todoTime: null,
      doTimeTodo: null,
      reminderTodo: null,

      timeFormat: "HH:mm",
      timeStap: "60",
    };
  },

  created() {
    this.todos = JSON.parse(localStorage.getItem("todo-storage") || "[]");

    this.minDate = getMinDate()
  },

  computed: {
    filteredTodo() {
      const filteredTodo = selectCategory(this.todos, this.visibility)
      return filteredTodo
    },
  },

  methods: {
    checkForm() {
      if (!this.editMode) {
        if (
          !this.newTodo ||
          this.newTodo.length == 0 ||
          !this.todoDate ||
          !this.todoTime ||
          !this.doTimeTodo ||
          !this.reminderTodo ||
          !this.tags
        ) {
          this.errors = [];

          if (!this.newTodo) {
            this.errors.push("Description");
          }

          if (!this.todoDate) {
            this.errors.push(" Date");
          }

          if (!this.todoTime) {
            this.errors.push(" Time");
          }

          if (!this.doTimeTodo) {
            this.errors.push(" Dedicated time");
          }

          if (!this.reminderTodo) {
            this.errors.push(" Reminder");
          }

          window.alert(
            "The following fields are empty or invalid:\n" + this.errors
          );

          this.errors = [];

          return;
        }
      } else {
        this.todos.splice(this.todos.indexOf(this.alreadyTodo), 1);
          if (!this.newTodo) {
            this.newTodo = this.alreadyTodo.description
          }

          if (!this.todoDate) {
            this.todoDate = this.alreadyTodo.date
          }

          if (!this.todoTime) {
            this.todoTime = this.alreadyTodo.time
          }

          if (!this.doTimeTodo) {
            this.doTimeTodo = this.alreadyTodo.doTime
          }

          if (!this.reminderTodo) {
            this.reminderTodo = this.alreadyTodo.reminderTime
          }

          if (this.tags.length === 0) {
            this.tags = this.alreadyTodo.tags
          }

          this.editMode = false
      }

      date = new Date();
      this.todos.push({
        id: this.todos.length,
        description: this.newTodo,
        isCompleted: false,
        date: this.todoDate,
        time: this.todoTime,
        doTime: this.doTimeTodo,
        reminderTime: this.reminderTodo,
        tags: this.tags
      });

      localStorage.setItem("todo-storage", JSON.stringify(this.todos));

      this.newTodo = null;
      this.todoDate = null;
      this.todoTime = null;
      this.doTimeTodo = null;
      this.reminderTodo = null;
      this.tags = []
    },

    deleteTodo(todo) {
      this.todos.splice(this.todos.indexOf(todo), 1);
      localStorage.setItem("todo-storage", JSON.stringify(this.todos));
    },

    editTodo(todo) {
      this.editMode = true
      this.alreadyTodo = todo
    },

    completeTodo(todo) {
      todo.isCompleted = !todo.isCompleted;
      localStorage.setItem("todo-storage", JSON.stringify(this.todos));
    },
  },

  components: { 
    datepicker: DatePicker,
    VueTagsInput
   },
};
</script>

<style src='./style.scss' lang='scss' scoped />

