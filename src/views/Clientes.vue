<template>
  <v-container>
    <v-row wrap class="mt-5">
      <v-col>
        <!-- Barra de busqueda -->
        <v-toolbar flat>
          <v-toolbar-title>Clientes</v-toolbar-title>
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
          <!-- Formulario de Clientes -->
          <v-dialog v-model="Modal" persistent>
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="green" dark v-bind="attrs" v-on="on">Registrar Cliente</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline" v-if="ModoEdicion">Editar Cliente</span>
                <span class="headline" v-else>Registrar Cliente</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <!-- IdCliente -->
                    <v-col cols="12" sm="6" md="4" v-if="ModoEdicion">
                      <v-text-field
                        prepend-icon="mdi-alpha-c-circle"
                        label="Cod."
                        disabled
                        v-model="Cliente.IdCliente"
                        color="green"
                      ></v-text-field>
                    </v-col>
                    <!-- Nombres -->
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        prepend-icon="mdi-account"
                        label="Nombres"
                        required
                        v-model="Cliente.Nombres"
                        color="green"
                        maxlength="30"
                      ></v-text-field>
                    </v-col>
                    <!-- Apellidos -->
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        prepend-icon="mdi-account"
                        label="Apellidos"
                        required
                        v-model="Cliente.Apellidos"
                        color="green"
                        maxlength="30"
                      ></v-text-field>
                    </v-col>
                    <!-- Direccion -->
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        prepend-icon="mdi-directions"
                        label="Direccion"
                        required
                        v-model="Cliente.Direccion"
                        color="green"
                        maxlength="50"
                      ></v-text-field>
                    </v-col>
                    <!-- Telefono -->
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        prepend-icon="mdi-cellphone"
                        label="Telefono"
                        required
                        v-model="Cliente.Telefono"
                        color="green"
                        type="number"
                      ></v-text-field>
                    </v-col>
                    <!-- NIT -->
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        prepend-icon="mdi-file-document"
                        label="NIT"
                        required
                        v-model="Cliente.Nit"
                        color="green"
                        maxlength="15"
                      ></v-text-field>
                    </v-col>
                    <!-- Adelanto -->
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        prepend-icon="mdi-head-question-outline"
                        label="Adelanto"
                        required
                        v-model="Cliente.Adelanto"
                        color="green"
                        type="number"
                      ></v-text-field>
                    </v-col>
                    <!-- Debe -->
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        prepend-icon="mdi-head-question-outline"
                        label="Debe"
                        required
                        v-model="Cliente.Debe"
                        color="green"
                        type="number"
                      ></v-text-field>
                    </v-col>
                    <!-- Observaciones -->
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        prepend-icon="mdi-clipboard-text"
                        label="Anotaciones"
                        required
                        v-model="Cliente.Observacion"
                        color="green"
                      ></v-text-field>
                    </v-col>
                    <!-- Foto -->
                    <v-col cols="12" sm="6" md="4">
                      <v-file-input
                        accept="image/*"
                        prepend-icon="mdi-camera"
                        chips
                        show-size
                        truncate-length="30"
                        label="Foto"
                        color="green"
                        v-model="Cliente.Foto"
                      ></v-file-input>
                    </v-col>
                    <!-- Activo -->
                    <v-col cols="12" sm="6" md="4" v-if="ModoEdicion">
                      <v-checkbox
                        prepend-icon="mdi-alpha-a-circle"
                        label="Activo"
                        required
                        v-model="Cliente.Activo"
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

        <!-- Tabla con el contenido a mostrar -->
        <v-simple-table fixed-header :search="Buscar">
          <template v-slot:default>
            <thead>
              <tr>
                <!-- <th class="text-left">Cod.</th> -->
                <th class="text-left">Nombre</th>
                <th class="text-left">Direccion</th>
                <th class="text-left">Telefono</th>
                <th class="text-left">NIT</th>
                <th class="text-left">Adelanto</th>
                <th class="text-left">Debe</th>
                <th class="text-left">Observacion</th>
                <th class="text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in Busqueda" :key="index">
                <!-- <td>{{ item.IdCliente }}</td> -->
                <td>{{ item.Nombres }} {{ item.Apellidos }}</td>
                <td>{{ item.Direccion }}</td>
                <td>{{ item.Telefono }}</td>
                <td>{{ item.Nit }}</td>
                <td>{{ item.Adelanto }}</td>
                <td>{{ item.Debe }}</td>
                <td>{{ item.Observacion }}</td>
                <td>
                  <v-icon
                    color="green"
                    class="mr-2"
                    @click="MostrarPerfil(item)"
                    >mdi-eye</v-icon
                  >
                  <v-icon color="yellow" @click="Editar(item)"
                    >mdi-pencil</v-icon
                  >
                  <v-icon color="red" @click="Confirmar(item)"
                    >mdi-delete</v-icon
                  >
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>

    <!-- Modal para mostrar perfil -->
    <v-row justify="center">
      <v-dialog
        v-model="Perfil"
        transition="dialog-bottom-transition"
        max-width="80%"
      >
        <v-card class="mx-auto">
          <v-card-title class="headline">
            <v-avatar size="60">
              <img alt="Cliente" :src="InfoPerfil.Foto" />
            </v-avatar>
            <p class="ml-3">
              {{ InfoPerfil.Nombres }} {{ InfoPerfil.Apellidos }}
            </p>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <!-- <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    prepend-icon="mdi-alpha-c-circle"
                    label="Cod."
                    readonly
                    v-model="InfoPerfil.IdCliente"
                    color="green"
                  ></v-text-field>
                </v-col> -->
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    prepend-icon="mdi-account"
                    label="Nombres"
                    readonly
                    v-model="InfoPerfil.Nombres"
                    color="green"
                    maxlength="30"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    prepend-icon="mdi-account"
                    label="Apellidos"
                    readonly
                    v-model="InfoPerfil.Apellidos"
                    color="green"
                    maxlength="30"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    prepend-icon="mdi-directions"
                    label="Direccion"
                    readonly
                    v-model="InfoPerfil.Direccion"
                    color="green"
                    maxlength="50"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    prepend-icon="mdi-cellphone"
                    label="Telefono"
                    readonly
                    v-model="InfoPerfil.Telefono"
                    color="green"
                    type="number"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    prepend-icon="mdi-file-document"
                    label="NIT"
                    readonly
                    v-model="InfoPerfil.Nit"
                    color="green"
                    maxlength="15"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    prepend-icon="mdi-head-question-outline"
                    label="Adelanto"
                    readonly
                    v-model="InfoPerfil.Adelanto"
                    color="green"
                    type="number"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    prepend-icon="mdi-head-question-outline"
                    label="Debe"
                    readonly
                    v-model="InfoPerfil.Debe"
                    color="green"
                    type="number"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    prepend-icon="mdi-clipboard-text"
                    label="Anotaciones"
                    readonly
                    v-model="InfoPerfil.Observacion"
                    color="green"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    prepend-icon="mdi-calendar"
                    label="Fecha de Creacion"
                    readonly
                    v-model="InfoPerfil.FC"
                    color="green"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    prepend-icon="mdi-calendar"
                    label="Fecha de Edicion"
                    readonly
                    v-model="InfoPerfil.FE"
                    color="green"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-checkbox
                    prepend-icon="mdi-alpha-a-circle"
                    label="Activo"
                    readonly
                    v-model="InfoPerfil.Activo"
                    color="green"
                  ></v-checkbox>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>

  </v-container>
</template>

<script>
import {db} from '../main';
import {storage} from '../main';
import alertify from "vue-alertify";
import moment from 'moment';
export default {
  data() {
    return {
      Clientes: [],
      Modal: false,
      Perfil: false,
      ModoEdicion: false,
      Buscar: "",

      Cliente: {
        IdCliente: 0,
        Nombres: "",
        Apellidos: "",
        Direccion: "",
        Telefono: "",
        Nit: "",
        Adelanto: 0,
        Debe: 0,
        Observacion: "",
        Foto: null,
        Vieja: "",
        Activo: true,
      },

      InfoPerfil: {
        IdCliente: 0,
        Nombres: "",
        Apellidos: "",
        Direccion: "",
        Telefono: "",
        Nit: "",
        Adelanto: 0,
        Debe: 0,
        Observacion: "",
        Foto: "",
        FC: "",
        FE: "",
        Activo: null,
      },
    };
  },

  created() {
    //Obtener Lista de clientes cuando se carga la vista de clientes
    this.GetClientes();
  },

  computed: {
    Busqueda() {
      const BusquedaLimpia = this.Buscar.toLowerCase().trim();

      if (!BusquedaLimpia) {
        return this.Clientes;
      } else {
        return this.Clientes.filter(
          (item) =>
            item.Nombres.toLowerCase().includes(BusquedaLimpia) ||
            item.Direccion.toLowerCase().includes(BusquedaLimpia) ||
            item.Nit.toLowerCase().includes(BusquedaLimpia)
        );
      }
    },
  },

  methods: {
    async GetClientes() {
      //Constante local para guardar los clientes
      const Clientes = [];
      //Se llaman a los clientes de la base de datos que estan activos
      db.collection("clientes").orderBy("Nombres").get().then((querySnapshot) => {
        //Se obtiene los datos y el id de cada cliente y se mueven a la constante
        querySnapshot.forEach((doc) => {
          if(doc.data().Activo == true){
            let CliData = doc.data();
            CliData.IdCliente = doc.id;
            Clientes.push(CliData);
          }
        });
      }, this.Clientes = Clientes)
      .catch((error) => {
          console.log("Error obteniendo documentos: ", error);
      });
    },

    async Agregar() {
      //Verificacion de formulario de cliente
      if (this.Cliente.Nombres.length > 3 && this.Cliente.Apellidos.length > 3 && this.Cliente.Direccion.length > 0){
        if (this.Cliente.Nit.length == 0) {
          this.Cliente.Nit = "C/F";
        }
        //Objeto con los datos del cliente a registrar
        var params = {
          Nombres: this.Cliente.Nombres,
          Apellidos: this.Cliente.Apellidos,
          Direccion: this.Cliente.Direccion,
          Telefono: this.Cliente.Telefono,
          Nit: this.Cliente.Nit,
          Adelanto: this.Cliente.Adelanto,
          Debe: this.Cliente.Debe,
          Observacion: this.Cliente.Observacion,
          Foto: '',
          FC: new Date().toISOString(),
          FE:'',
          Activo:true
        };
        //Se comprueba si se escogio una foto para el cliente y se sube
        if (this.Cliente.Foto != null) {
          var NFoto =
            this.Cliente.Nombres +
            " " +
            this.Cliente.Apellidos +
            "." +
            this.Cliente.Foto.name.split(".").pop().toLowerCase();
          params.Foto = NFoto;
          //this.SubirFoto(NFoto);
        }
        //Se sube el cliente a la base de datos, se actulizan los datos locales, se cierra el modal, se limpia y se manda una notificacion de exito
        try {
          await db.collection('clientes').add(params);
        } catch (error) {
          console.log(error)
        }
        this.GetClientes();
        this.Modal = false;
        this.Limpiar();
        this.$alertify.success("Cliente Registrado");

      } else {
        this.$alertify.error("Complete el formulario primero");
      }
    },

    async Actualizar() {
      //Verificar si el formulario de edicion no va vacio
      if (this.Cliente.Nombres.length > 3 && this.Cliente.Apellidos.length > 3 && this.Cliente.Direccion.length > 0){
        //Verificar que el nit no vaya vacio
        if (this.Cliente.Nit.length == 0) {this.Cliente.Nit = "C/F";}
        //Datos del cliente editados
        var params = {
          Nombres: this.Cliente.Nombres,
          Apellidos: this.Cliente.Apellidos,
          Direccion: this.Cliente.Direccion,
          Telefono: this.Cliente.Telefono,
          Nit: this.Cliente.Nit,
          Adelanto: this.Cliente.Adelanto,
          Debe: this.Cliente.Debe,
          Observacion: this.Cliente.Observacion,
          FE: new Date().toISOString(),
          Activo: this.Cliente.Activo,
        };
        //Verificar si esta editando la foto
        if (this.Cliente.Foto != null) {
          //Si hay una foto vieja se elimina antes de subir la nueva
          if (this.Cliente.Vieja != "") {
            this.BorrarFoto();
          }
          //Se sube la nueva foto
          var NFoto =
            this.Cliente.Nombres +
            " " +
            this.Cliente.Apellidos +
            "." +
            this.Cliente.Foto.name.split(".").pop().toLowerCase();
          params.Foto = NFoto;
          this.SubirFoto(NFoto);
        }
        //Se subo el cliente editado
        try {
          await db.collection('clientes').doc(this.Cliente.IdCliente).update(params);
        } catch (error) {
          console.log(error)
        }
        this.GetClientes();
        this.Modal = false;
        this.Limpiar();
        this.$alertify.success("Cliente Actualizado");
      } else {
        this.$alertify.error("Complete el formulario primero");
      }
    },

    Confirmar(item) {
      //Ventana de confirmacion de desactivacion del cliente
      this.$alertify.confirmWithTitle(
        "Inactivar Cliente",
        "Desea inactivar a " + item.Nombres,
        () => this.Eliminar(item.IdCliente),
        () => this.$alertify.error("Inactivacion Cancelada")
      );
    },

    async Eliminar(ID){
      //En caso de que se confirme la eliminacion se obtendra la id y se desactivara
      await db.collection('clientes').doc(ID).update({Activo:false});
      this.GetClientes();
      this.$alertify.success("Inactivacion Realizada");
    },

    Editar(item) {
      //Se recive la informacion y se pasa al formulario del cliente
      this.ModoEdicion = true;
      this.Cliente.IdCliente = item.IdCliente;
      this.Cliente.Nombres = item.Nombres;
      this.Cliente.Apellidos = item.Apellidos;
      this.Cliente.Direccion = item.Direccion;
      this.Cliente.Telefono = item.Telefono;
      this.Cliente.Nit = item.Nit;
      this.Cliente.Adelanto = item.Adelanto;
      this.Cliente.Debe = item.Debe;
      this.Cliente.Observacion = item.Observacion;
      if (item.Foto != null) {
        this.Cliente.Vieja = item.Foto;
      }
      this.Modal = true;
    },

    MostrarPerfil(item) {
      //Mover informacion completa del cliente hacia el modal
      this.InfoPerfil = [];
      this.InfoPerfil.IdCliente = item.IdCliente;
      this.InfoPerfil.Nombres = item.Nombres;
      this.InfoPerfil.Apellidos = item.Apellidos;
      this.InfoPerfil.Direccion = item.Direccion;
      this.InfoPerfil.Telefono = item.Telefono;
      this.InfoPerfil.Nit = item.Nit;
      this.InfoPerfil.Adelanto = item.Adelanto;
      this.InfoPerfil.Debe = item.Debe;
      this.InfoPerfil.Observacion = item.Observacion;
      //Verificar si existe una foto personalizada y mostrarla, si no se mostrara una foto stock
      if (item.Foto != "") {
        this.InfoPerfil.Foto = "http://192.168.1.4:3000/" + item.Foto;
      }else{
        this.InfoPerfil.Foto = "https://w7.pngwing.com/pngs/786/899/png-transparent-computer-icons-custumer-black-business-desktop-wallpaper-thumbnail.png"
      }
      //Se mostrara la fecha de creacion del cliente con una formato mas legible para el usuario final
      this.InfoPerfil.FC = moment(item.FC).locale('es-mx', null).format('dddd, D [de] MMMM [de] YYYY  h:m A')
      //Si la fehca de edicion no esta vacia tambien se le dara un formato laegible para el usuario final
      if(item.FE != ""){
        this.InfoPerfil.FE = moment(item.FE).locale('es-mx', null).format('dddd, D [de] MMMM [de] YYYY  h:m A')
      }
      this.InfoPerfil.Activo = item.Activo;

      this.Perfil = true;
    },

    async SubirFoto(Nombre) {
      let ext = "img/"+Nombre.split(".").pop().toLowerCase();
      const Img = storage.ref().child("Clientes/"+Nombre);
      const metadata = {contentType: ext};
      try {
        await Img.put(this.Cliente.Foto,metadata);
      } catch (error) {
        console.log(error)
      } finally {
        this.$alertify.success("Imagen Subida");
      }
    },

    async BorrarFoto() {
      const Img = storage.ref().child("Clientes/"+this.Cliente.Vieja);
      await Img.delete().catch(function(error){
        console.log(error);
      })
    },

    Limpiar() {
      this.Modal = false;
      this.ModoEdicion = false;
      this.Cliente.IdCliente = 0;
      this.Cliente.Nombres = "";
      this.Cliente.Apellidos = "";
      this.Cliente.Direccion = "";
      this.Cliente.Telefono = "";
      this.Cliente.Nit = "";
      this.Cliente.Adelanto = 0;
      this.Cliente.Debe = 0;
      this.Cliente.Observacion = "";
      this.Cliente.Foto = null,
      this.Cliente.Vieja = "",
      this.Cliente.Activo = true;
    },
  },
};
</script>