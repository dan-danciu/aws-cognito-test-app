<template lang="html">
  <div class="">

  </div>
</template>

<script>

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
    this.$store.dispatch('auth/authenticate', this.code)
  }
}
</script>

<style lang="css" scoped>
</style>
