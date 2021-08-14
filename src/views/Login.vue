<template>
  <v-container text-aling-center>
    <v-row class="justify-center" wrap>

      <v-col cols="6" md="4">
        <v-card to="/Pedidos">
          <v-img src="@/assets/Ordenes.png" class="black--text align-end" height="20%">
            <v-card-title>Pedidos</v-card-title>
          </v-img>
        </v-card>
      </v-col>

      <v-col cols="6" md="4">
        <v-card to="/Clientes">
          <v-img src="@/assets/Clientes.png" class="black--text align-end" height="20%">
            <v-card-title>Clientes</v-card-title>
          </v-img>
        </v-card>
      </v-col>

      <v-col cols="6" md="4">
        <v-card to="/Tortillas">
          <v-img src="@/assets/Tortilla.png" class="black--text align-end" height="20%">
            <v-card-title>Tortillas</v-card-title>
          </v-img>
        </v-card>
      </v-col>

      <v-col cols="6" md="4">
        <v-card to="/Ventas">
          <v-img src="@/assets/Ventas.png" class="black--text align-end" height="20%">
            <v-card-title>Ventas</v-card-title>
          </v-img>
        </v-card>
      </v-col>

      <v-col cols="6" md="4">
        <v-card to="/Reportes">
          <v-img src="@/assets/Reportes.png" class="black--text align-end" height="20%">
            <v-card-title>Reportes</v-card-title>
          </v-img>
        </v-card>
      </v-col>

    </v-row>
  </v-container>
</template>

<script>

export default {
  name: 'Inicio',

  data: () => ({
    }),
    
  components: {
  }
}
</script>
