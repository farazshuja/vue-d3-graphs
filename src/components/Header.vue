<template>
  <div class="container">
    <header class="d-flex mt-5">
      <div class="logo">
        <img src="../assets/img/logo.gif">
      </div>
      <div class="col round-bg">
        <div class="user-details row no-gutters">
          <div class="col-md-6">
            <h2 class="title"><em>{{ user.name }}</em></h2>
            <label>DOB: {{user.dob}}</label>
            <label>ID: {{user.id}}</label>
          </div>
          <div class="col-md-6 text-right mt-2">
            <label>Evaluation Date: {{user.examDate}}</label>
          </div>
        </div>
      </div>
    </header>
  </div>
</template>

<script>
export default {
  props: ['user']
}
</script>


<style>
  div.logo {
    width: 110px;
    margin: 0 10px 0 0;
  }
  div.logo img {
    width: 100%;
  }
  div.user-details label {
    color: #8a8989;
    font-size: 1.6rem;
    display: block;
    line-height: 1.25;
  }
</style>

