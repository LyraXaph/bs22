<template>
  <v-container>
    <v-layout row wrap  v-for="boulder in boulders" :key="boulder.id" class="mb-2">
      <v-flex xs12 sm10 md8 offset-sm1 offset-md2> 
        <v-card class="info">
          <v-container fluid>
            <v-layout row>
              <v-flex xs5 sm3 md3>
                <v-card-media
                  :src="boulder.image"
                  height="130px">
                </v-card-media>
              </v-flex>
              <v-flex xs7 sm8 md9>
                <v-card-title primary-title>
                  <div>
                    <h3 class="headline mb-0">{{ boulder.title }}</h3>
                    <div>Some text</div>
                  </div>
                </v-card-title>
                 <v-card-actions>
                  <v-btn flat 
                    :to="'/boulder/' + boulder.id"
                    ><v-icon left>arrow_forward</v-icon>
                    View boulder
                  </v-btn>
                  <v-btn flat>Edit</v-btn>
                </v-card-actions>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  computed: {
    boulders () {
      return this.$store.getters.loadedBoulders
    }
  }
}
</script>

<style>

</style>