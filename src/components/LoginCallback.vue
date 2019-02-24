<template lang="html">
  <div class="">
    {{ authData }}
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: {
    code: String
  },
  data() {
    return {
      authData: {}
    }
  },
  mounted() {
    axios
      .post("https://cbf9bhx78g.execute-api.eu-west-1.amazonaws.com/dev/gettoken" + '?code=' + this.code)
      .then(response => {
        this.authData = response.data
      })
      .catch(error => {
        this.authData = {
          data: error.response.data,
          response_code: error.response.status
        }
      })
  }
}
</script>

<style lang="css" scoped>
</style>
