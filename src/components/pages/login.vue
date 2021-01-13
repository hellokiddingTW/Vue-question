<template>
  <div>
    <form class="form-signin" @submit.prevent="signin">
  <h1 class="h3 mb-3 font-weight-normal">請先登入</h1>
  <label for="inputEmail" class="sr-only">Email address</label>
  <input type="email" id="inputEmail" class="form-control" placeholder="Email address" v-model="user.username" required autofocus>
  <label for="inputPassword" class="sr-only">Password</label>
  <input type="password" id="inputPassword" class="form-control" placeholder="Password" v-model="user.password" required>
  <div class="checkbox mb-3">
    <label>
      <input type="checkbox" value="remember-me"> Remember me
    </label>
  </div>
  <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
  <p class="mt-5 mb-3 text-muted">&copy; 2017-2020</p>
</form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user:{
        "username": "",
        "password": "",
      }
    };
  },
  methods:{
    signin(){
      const api = `${process.env.APIPATH}/admin/signin`;
      const vm = this;
      this.$http
      .post(api, vm.user)
      .then((response) => {
        console.log(response.data);
        if(response.data.success){
          const token = response.data.token;
          const expired = response.data.expired;
          console.log(token, expired)
          document.cookie = `hexCookie=${token}; expires=${new Date(expired)}`;
            vm.$router.push('/admin/products')
        }
      });
    }
  }
};
</script>

