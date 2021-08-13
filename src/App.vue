<template>
  <v-app>
    <!-- Inicio de la barra de navegacion -->
    <v-app-bar app color="success" dark dense>
      <v-app-bar-nav-icon
        @click="mver = !mver"
        class="d-md-none"
      ></v-app-bar-nav-icon>

      <div class="d-flex align-center">
        <v-img
          alt="Donal Logo"
          class="shrink mr-2"
          contain
          src="https://i.imgur.com/HFvPKBz.png"
          transition="scale-transition"
          width="40"
        />
      </div>

      <!-- Titulo de barra de navegacion para dispositivos pequeños -->
      <v-toolbar-title><v-btn plain to="/">Antojitos Heidy</v-btn></v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- Barra de navegacion para dispositivos pequeños -->
      <div class="d-none d-md-block">
        <v-btn plain to="/Pedidos">Pedidos <v-icon right>mdi-view-list-outline</v-icon></v-btn>
        <v-btn plain to="/Clientes">Clientes <v-icon right>mdi-account</v-icon></v-btn>
        <v-btn plain to="/Tortillas">Tortillas <v-icon right>mdi-alpha-t-circle</v-icon></v-btn>
        <v-btn plain to="/Ventas">Ventas <v-icon right>mdi-receipt</v-icon></v-btn>
        <v-btn plain to="/Reportes">Reportes <v-icon right>mdi-clipboard-list</v-icon></v-btn>
      </div>
    </v-app-bar>

    <!-- Barra de navegacion -->
    <v-navigation-drawer app v-model="mver" temporary color="success">
      <v-row wrap>
        <!-- Logo de Pagina -->
        <v-col cols="4"></v-col>
        <v-col class="justify-center" cols="3">
          <v-img
            src="https://i.imgur.com/HFvPKBz.png"
            height="45"
            width="40"
          />
        </v-col>
        <v-col cols="4"></v-col>
        <!-- Titulo de la pagina -->
        <v-col cols="12" class="text-center">
          <v-btn plain to="/"><p class="white--text headline">Antojitos Heidy</p></v-btn>
        </v-col>
        <v-col cols="12">
          <!-- Lista con links de navegacion pra dispositivos grandes -->
          <v-list>
            <v-list-item-group class="white--text">
              <v-list-item to="/Pedidos">
                <v-list-item-icon>
                  <v-icon>mdi-view-list-outline</v-icon>
                  <v-list-item-content>
                    <v-list-item-title>Pedidos</v-list-item-title>
                  </v-list-item-content>
                </v-list-item-icon>
              </v-list-item>

              <v-list-item to="/Clientes">
                <v-list-item-icon>
                  <v-icon>mdi-account</v-icon>
                  <v-list-item-content>
                    <v-list-item-title>Clientes</v-list-item-title>
                  </v-list-item-content>
                </v-list-item-icon>
              </v-list-item>

              <v-list-item to="/Tortillas">
                <v-list-item-icon>
                  <v-icon>mdi-alpha-t-circle</v-icon>
                  <v-list-item-content>
                    <v-list-item-title>Tortillas</v-list-item-title>
                  </v-list-item-content>
                </v-list-item-icon>
              </v-list-item>

              <v-list-item to="/Ventas">
                <v-list-item-icon>
                  <v-icon>mdi-receipt</v-icon>
                  <v-list-item-content>
                    <v-list-item-title>Ventas</v-list-item-title>
                  </v-list-item-content>
                </v-list-item-icon>
              </v-list-item>

              <v-list-item to="/Reportes">
                <v-list-item-icon>
                  <v-icon>mdi-clipboard-list</v-icon>
                  <v-list-item-content>
                    <v-list-item-title>Reportes</v-list-item-title>
                  </v-list-item-content>
                </v-list-item-icon>
              </v-list-item>

            </v-list-item-group>
          </v-list>
        </v-col>
      </v-row>
    </v-navigation-drawer>

    <v-main>
      <router-view />

      <!-- Mensaje de carga reutilizable -->
      <v-dialog v-model="Loading.Estado" hide-overlay persistent width="300">
        <v-card :color="Loading.Color" dark>
          <v-card-text class="text-center">
            {{ Loading.Titulo }}
            <v-progress-linear
              indeterminate
              color="white"
              class="mb-0"
            ></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>

    </v-main>
  </v-app>
</template>

<script>

import { mapState } from 'vuex';

export default {
  name: "App",

  components: {},

  data: () => ({
    mver: false,
  }),
  computed:{
    ...mapState(['Loading'])
  },
};
</script>
