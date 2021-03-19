
function selectCategory(todos, visibility) {
    if (visibility === "all") {
      return todos;
    } else if (visibility === "active") {
      return todos.filter((todo) => {
        return !todo.isCompleted;
      });
    } else {
      return todos.filter((todo) => {
        return todo.isCompleted;
      });
    }
}

export { selectCategory }