<template>
  <v-container>
    <v-row wrap class="mt-5">
      <v-col>
        <v-toolbar flat>
          <v-toolbar-title>Tortillas</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="Buscar"
            append-icon="mdi-magnify"
            label="Buscar"
            single-line
            hide-details
            color="green"
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-dialog v-model="Modal" persistent>
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="green" dark v-bind="attrs" v-on="on"
                >Registrar Tortillas</v-btn
              >
            </template>
            <v-card>
              <v-card-title>
                <span class="headline" v-if="ModoEdicion">Editar Tortilla</span>
                <span class="headline" v-else>Registrar Tortilla</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4" v-if="ModoEdicion">
                      <v-text-field
                        prepend-icon="mdi-alpha-c-circle"
                        label="Cod."
                        disabled
                        v-model="Tortilla.IdTortilla"
                        color="green"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        prepend-icon="mdi-card-text"
                        label="Descripcion"
                        required
                        v-model="Tortilla.Descripcion"
                        color="green"
                        maxlength="25"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        prepend-icon="mdi-check-bold"
                        label="Precio"
                        required
                        v-model="Tortilla.Precio"
                        color="green"
                        type="number"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4" v-if="ModoEdicion">
                      <v-checkbox
                        prepend-icon="mdi-alpha-a-circle"
                        label="Activa"
                        required
                        v-model="Tortilla.Activa"
                        color="green"
                      ></v-checkbox>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  v-if="ModoEdicion"
                  color="green"
                  text
                  @click="Actualizar()"
                  >Actualizar <v-icon right>mdi-pencil</v-icon></v-btn
                >
                <v-btn v-else color="green" text @click="Agregar()"
                  >Guardar <v-icon right>mdi-content-save</v-icon></v-btn
                >
                <v-btn color="red" text @click="Limpiar"
                  >Cancelar <v-icon right>mdi-cancel</v-icon></v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>

        <v-simple-table fixed-header :search="Buscar">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Cod.</th>
                <th class="text-left">Descripcion</th>
                <th class="text-left">Precio</th>
                <th class="text-left">Fecha de Registro</th>
                <th class="text-left">Fecha de Edicion</th>
                <th class="text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in Busqueda" :key="index">
                <td>{{ item.IdTortilla }}</td>
                <td>{{ item.Descripcion }} {{ item.Apellidos }}</td>
                <td>{{ item.Precio }}</td>
                <td>{{ FechaConFormato(item.FC) }}</td>
                <td v-if="item.FE" >{{ FechaConFormato(item.FE) }}</td>
                <td v-else ></td>
                <td>
                  <v-icon color="yellow" @click="Editar(item)"
                    >mdi-pencil</v-icon
                  >
                  <v-icon color="red" @click="Eliminar(item)"
                    >mdi-delete</v-icon
                  >
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import alertify from "vue-alertify";
import moment from 'moment';
export default {
  data() {
    return {
      Tortillas: [],
      Modal: false,
      ModoEdicion: false,
      Detalles: false,
      Buscar: "",

      Tortilla: {
        IdTortilla: 0,
        Descripcion: "",
        Precio: 0,
        Activa: true,
      },

    };
  },

  created() {
    //Obtener Lista de clientes cuando se carga la vista de clientes
    this.GetTortillas();
  },

  computed: {
    Busqueda() {
      const BuquedaLimpia = this.Buscar.toLowerCase().trim();

      if (!BuquedaLimpia) {
        return this.Tortillas;
      } else {
        return this.Tortillas.filter(
          (item) =>
            item.Descripcion.toLowerCase().includes(BuquedaLimpia)
        );
      }
    },
  },

  methods: {
    GetTortillas() {
      try {
        axios.get(`http://192.168.1.4:3000/Tortillas`).then((res) => {
          this.Tortillas = res.data;
        });
      } catch (e) {
        console.log(e);
      }
    },

    Agregar() {
      if (
        this.Tortilla.Descripcion.length > 0 &&
        this.Tortilla.Precio > 0
      ) {
        var params = {
          Descripcion: this.Tortilla.Descripcion,
          Precio: this.Tortilla.Precio,
          Activo: this.Tortilla.Activa,
        };
        axios.post(`http://192.168.1.4:3000/Tortillas`, params).then((res) => {
          this.GetTortillas();
          this.Modal = false;
          this.Limpiar();
          this.$alertify.success("Tortilla Registrada");
        }).catch((error) => {
          this.$alertify.error(error);
        });
      } else {
        this.$alertify.error("Complete el formulario primero");
      }
    },

    Actualizar() {
      if (
        this.Tortilla.Descripcion.length > 0 &&
        this.Tortilla.Precio > 0
      ) {
        var params = {
          Descripcion: this.Tortilla.Descripcion,
          Precio: this.Tortilla.Precio,
          Activo: this.Tortilla.Activa,
        };
        axios.put(`http://192.168.1.4:3000/Tortillas/${this.Tortilla.IdTortilla}`,params).then((res) => {
          this.GetTortillas();
          this.Modal = false;
          this.Limpiar();
          this.$alertify.success("Tortilla Actualizado");
        }).catch((error) => {
          this.$alertify.error(error);
        });
      } else {
        this.$alertify.error("Complete el formulario primero");
      }
    },

    Eliminar(item) {
      this.$alertify.confirmWithTitle(
        "Desactivar Tortilla",
        "Desea desactivar " + item.Descripcion,
        () =>
          axios.delete(`http://192.168.1.4:3000/Tortillas/${item.IdTortilla}`).then(() => {
            this.GetTortillas();
            this.$alertify.success("Inactivacion Realizada");
          }).catch((error) => {
            this.$alertify.error(error);
          }),
        () => this.$alertify.error("Inactivacion Cancelada")
      );
    },

    Editar(item) {
      this.ModoEdicion = true;
      this.Tortilla.IdTortilla = item.IdTortilla;
      this.Tortilla.Descripcion = item.Descripcion;
      this.Tortilla.Precio = item.Precio;
      this.Modal = true;
    },

    Limpiar() {
      this.Modal = false;
      this.ModoEdicion = false;
      this.Tortilla.IdTortilla = 0;
      this.Tortilla.Descripcion = "";
      this.Tortilla.Precio = 0;
      this.Tortilla.FC = "";
      this.Tortilla.FE = ""
      this.Tortilla.Activa = true;
    },

    FechaConFormato(Fecha){
        return moment(Fecha).locale('es-mx', null).format('dddd, D [de] MMMM [de] YYYY  h:m A')
    }
  },
};
</script>