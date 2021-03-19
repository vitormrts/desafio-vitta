<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
* {
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
  
  margin: 0;
  padding: 0;
  box-sizing: border-box;

  font-family: 'Roboto', sans-serif;
}

#app {
  height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;


  background-image: linear-gradient(to right bottom, #3e4361, #5c6bc0);
}

</style>
