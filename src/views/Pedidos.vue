<template>
  <v-container>
    <v-row wrap class="mt-5">
      <v-col>
        <v-menu
          v-model="VerFechaModal"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              label="Pedidos de Fecha"
              v-model="VerFecha"
              prepend-icon="mdi-calendar"
              color="green"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="VerFecha"
            year-icon="mdi-calendar-blank"
            prev-icon="mdi-skip-previous"
            next-icon="mdi-skip-next"
            color="green"
            @input="FechaFormulario = false"
            @change="GetPedidos(VerFecha)"
          ></v-date-picker>
        </v-menu>
        <v-toolbar flat>
          <v-toolbar-title>Pedidos</v-toolbar-title>
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
              <v-btn color="green" dark v-bind="attrs" v-on="on">Registrar Pedido</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline" v-if="ModoEdicion">Editar Pedido</span>
                <span class="headline" v-else>Registrar Pedido</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field v-if="ModoEdicion"
                        v-model="Pedido.Fecha"
                        label="Fecha de Pedido"
                        prepend-icon="mdi-calendar"
                        color="green"
                        readonly
                      ></v-text-field>
                      <v-menu v-else
                        v-model="FechaFormulario"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="Pedido.Fecha"
                            label="Fecha de Pedido"
                            prepend-icon="mdi-calendar"
                            color="green"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="Pedido.Fecha"
                          year-icon="mdi-calendar-blank"
                          prev-icon="mdi-skip-previous"
                          next-icon="mdi-skip-next"
                          color="green"
                          @input="FechaFormulario = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-select v-if="ModoEdicion"
                        v-model="Pedido.Cliente"
                        :items="ClientesM"
                        item-text="FullName"
                        item-value="IdCliente"
                        label="Clientes"
                        prepend-icon="mdi-account"
                        color="green"
                        readonly
                      ></v-select>
                      <v-select v-else
                        v-model="Pedido.Cliente"
                        :items="ClientesM"
                        item-text="FullName"
                        item-value="IdCliente"
                        label="Clientes"
                        prepend-icon="mdi-account"
                        color="green"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        prepend-icon="mdi-sort-numeric-variant"
                        label="T. Pequeñas"
                        required
                        v-model="Pedido.Cantidad3"
                        color="green"
                        type="number"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        prepend-icon="mdi-sort-numeric-variant"
                        label="T. Medianas"
                        required
                        v-model="Pedido.Cantidad2"
                        color="green"
                        type="number"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        prepend-icon="mdi-sort-numeric-variant"
                        label="T. Grandes"
                        required
                        v-model="Pedido.Cantidad"
                        color="green"
                        type="number"
                      ></v-text-field>
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
                <th class="text-left">Cliente</th>
                <th class="text-left">T. Pequeñas</th>
                <th class="text-left">T. Medianas</th>
                <th class="text-left">T. Grandes</th>
                <th class="text-left">SubTotales</th>
                <th class="text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in Busqueda" :key="index">
                
                <td>{{ item.Nombres }} {{ item.Apellidos }}</td>

                <td v-if="item.Tortilla == 3">{{ item.Cantidad }}</td>
                <td v-else-if="item.Tortilla2 == 3">{{ item.Cantidad2 }}</td>
                <td v-else-if="item.Tortilla3 == 3">{{ item.Cantidad3 }}</td>
                <td v-else></td>

                <td v-if="item.Tortilla == 2">{{ item.Cantidad }}</td>
                <td v-else-if="item.Tortilla2 == 2">{{ item.Cantidad2 }}</td>
                <td v-else-if="item.Tortilla3 == 2">{{ item.Cantidad3 }}</td>
                <td v-else></td>

                <td v-if="item.Tortilla == 1">{{ item.Cantidad }}</td>
                <td v-else-if="item.Tortilla2 == 1">{{ item.Cantidad2 }}</td>
                <td v-else-if="item.Tortilla3 == 1">{{ item.Cantidad3 }}</td>
                <td v-else></td>

                <td>{{ SubTotal(item) }}</td>

                <td v-if="item.Fecha >= Hoy">
                  <v-icon color="yellow" @click="Editar(item)"
                    >mdi-pencil</v-icon
                  >
                  <v-icon color="red" @click="ConfirmarE(item)"
                    >mdi-delete</v-icon
                  >
                </td>
              </tr>
              <tr>
                <td class="font-weight-black">Totales</td>
                <td>{{ Total1 }}</td>
                <td>{{ Total2 }}</td>
                <td>{{ Total3 }}</td>
                <td>{{ Total4 }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
//import axios from "axios";
import { mapMutations } from 'vuex';
import alertify from "vue-alertify";
import moment from 'moment';
export default {
  data() {
    return {
      Pedidos: [],
      Clientes: [],
      Modal: false,
      FechaFormulario: false,
      ModoEdicion: false,      
      Buscar: "",
      Hoy: moment(new Date()).format("YYYY-MM-DD"),
      VerFechaModal:false,
      VerFecha: moment(new Date()).format("YYYY-MM-DD"),

      Pedido: {
        Fecha: this.Hoy,
        Cliente: 0,
        Cantidad: 0,
        Cantidad2: 0,
        Cantidad3: 0,
      },

    };
  },

  created() {
    //Obtener Lista de clientes cuando se carga la vista de clientes
    this.GetPedidos(this.VerFecha);this.GetClientes();this.Limpiar();
  },

  computed: {
    Busqueda() {
      const BuquedaLimpia = this.Buscar.toLowerCase().trim();

      if (!BuquedaLimpia) {
        return this.Pedidos;
      } else {
        return this.Pedidos.filter(
          (item) =>
            item.Nombres.toLowerCase().includes(BuquedaLimpia) ||
            item.Apellidos.toLowerCase().includes(BuquedaLimpia)
        );
      }
    },

    ClientesM(){
      var Temporal = this.Clientes;
      if(this.Pedido.Fecha == this.Hoy && this.ModoEdicion==false){
        var Filtrados = [];
        for( var i in Temporal){
          if(this.Pedidos.findIndex(Pedido => Pedido.Cliente === Temporal[i].IdCliente) === -1){
            Filtrados.push(Temporal[i])
          }
        }
        return Filtrados
      }else{
        return Temporal
      }
    },

    Total1(){
      var t1 = 0
      for(var i in this.Pedidos){
        if(this.Pedidos[i].Tortilla === 1){
          t1 += this.Pedidos[i].Cantidad
          //console.log(this.Pedidos[i].Nombres,this.Pedidos[i].Descripcion, this.Pedidos[i].Cantidad)
        } if(this.Pedidos[i].Tortilla2 === 1){
          t1 += this.Pedidos[i].Cantidad2
          //console.log(this.Pedidos[i].Nombres,this.Pedidos[i].Descripcion2, this.Pedidos[i].Cantidad2)
        } if(this.Pedidos[i].Tortilla3 === 1){
          t1 += this.Pedidos[i].Cantidad3
          //console.log(this.Pedidos[i].Nombres,this.Pedidos[i].Descripcion3, this.Pedidos[i].Cantidad3)
        }
      }
      return t1
    },

    Total2(){
      var t2 = 0
      for(var i in this.Pedidos){
        if(this.Pedidos[i].Tortilla === 2){
          t2 += this.Pedidos[i].Cantidad
          //console.log(this.Pedidos[i].Nombres,this.Pedidos[i].Descripcion, this.Pedidos[i].Cantidad)
        } if(this.Pedidos[i].Tortilla2 === 2){
          t2 += this.Pedidos[i].Cantidad2
          //console.log(this.Pedidos[i].Nombres,this.Pedidos[i].Descripcion2, this.Pedidos[i].Cantidad2)
        } if(this.Pedidos[i].Tortilla3 === 2){
          t2 += this.Pedidos[i].Cantidad3
          //console.log(this.Pedidos[i].Nombres,this.Pedidos[i].Descripcion3, this.Pedidos[i].Cantidad3)
        }
      }
      return t2
    },

    Total3(){
      var t3 = 0
      for(var i in this.Pedidos){
        if(this.Pedidos[i].Tortilla === 3){
          t3 += this.Pedidos[i].Cantidad
          //console.log(this.Pedidos[i].Nombres,this.Pedidos[i].Descripcion, this.Pedidos[i].Cantidad)
        } if(this.Pedidos[i].Tortilla2 === 3){
          t3 += this.Pedidos[i].Cantidad2
          //console.log(this.Pedidos[i].Nombres,this.Pedidos[i].Descripcion2, this.Pedidos[i].Cantidad2)
        } if(this.Pedidos[i].Tortilla3 === 3){
          t3 += this.Pedidos[i].Cantidad3
          //console.log(this.Pedidos[i].Nombres,this.Pedidos[i].Descripcion3, this.Pedidos[i].Cantidad3)
        }
      }
      return t3
    },

    Total4(){
      return this.Total1+this.Total2+this.Total3
    }
  },

  methods: {
    ...mapMutations(['MostrarLoading','OcultarLoading']),

    async GetPedidos(Fecha) {
      try {
        this.MostrarLoading({Titulo:'Accediendo a la información', Color:'green'})
        this.Pedidos = []
        //let Get = await axios.get(`http://192.168.1.4:3000/Pedidos/${Fecha}`)
        var Temporal = await Get.data;
        if(Temporal.length > 0){
          for( var i in Temporal){
            if(this.Pedidos.findIndex(Pedidos => Pedidos.Cliente === Temporal[i].Cliente) != -1){
              var index = this.Pedidos.findIndex(Pedidos => Pedidos.Cliente === Temporal[i].Cliente)
              if(Temporal[i].Tortilla === 2){
                this.Pedidos[index].Tortilla2 = Temporal[i].Tortilla
                this.Pedidos[index].Descripcion2 = Temporal[i].Descripcion
                this.Pedidos[index].Cantidad2 = Temporal[i].Cantidad
              } else if(Temporal[i].Tortilla === 3){
                this.Pedidos[index].Tortilla3 = Temporal[i].Tortilla
                this.Pedidos[index].Descripcion3 = Temporal[i].Descripcion
                this.Pedidos[index].Cantidad3 = Temporal[i].Cantidad
              }
            }else{
              this.Pedidos.push(Temporal[i])
            }
          }
          this.VerFechaModal = false
        }else{
          this.$alertify.error("No hay pedidos en la fecha " + Fecha)
          this.Pedidos = []
        }
      } catch (e) {
        console.log(e);
      }finally{
        this.OcultarLoading()
      }
    },

    async GetClientes() {
      try {
        //let Get = await axios.get(`http://192.168.1.4:3000/Clientes`)
        for(var i = 0; i < Get.data.length; i++){
          Get.data[i].FullName = Get.data[i].Nombres + " " + Get.data[i].Apellidos
        }
        this.Clientes = await Get.data
      } catch (e) {
        console.log(e);
      }
    },

    async Agregar() {
      if (this.Pedido.Cliente > 0 && this.Pedido.Fecha != "") {
        if(this.Pedido.Cantidad != 0 || this.Pedido.Cantidad2 != 0 || this.Pedido.Cantidad3 != 0){

          var infoinicial = {Fecha: this.Pedido.Fecha, Cliente: this.Pedido.Cliente};

          if(this.Pedido.Cantidad > 0){
            var params = infoinicial;
            params.Tortilla = 1
            params.Cantidad = this.Pedido.Cantidad
            try{
              //await axios.post(`http://192.168.1.4:3000/Pedidos`, params)
            } catch(e){
              console.log(e)
            }
          }

          if(this.Pedido.Cantidad2 > 0){
            var params = infoinicial;
            params.Tortilla = 2
            params.Cantidad = this.Pedido.Cantidad2
            try{
              //await axios.post(`http://192.168.1.4:3000/Pedidos`, params)
            } catch(e){
              console.log(e)
            }
          }

          if(this.Pedido.Cantidad3 > 0){
            var params = infoinicial;
            params.Tortilla = 3
            params.Cantidad = this.Pedido.Cantidad3
            try{
              //await axios.post(`http://192.168.1.4:3000/Pedidos`, params)
            } catch(e){
              console.log(e)
            }
          }

          this.GetPedidos(this.Pedido.Fecha);
          this.Modal = false;
          this.Limpiar();
          this.$alertify.success("Pedido Registrado");
        }else{
          this.$alertify.error("Debe llenar al menos una cantidad");
        }
      } else {
        this.$alertify.error("Complete el formulario primero");
      }
    },

    async Actualizar() {
      if (this.Pedido.Cliente > 0 && this.Pedido.Fecha != ""){
        if(this.Pedido.Cantidad != 0 || this.Pedido.Cantidad2 != 0 || this.Pedido.Cantidad3 != 0){
          const Cliente = this.Pedidos.find(Cliente => Cliente.Cliente == this.Pedido.Cliente)
          var prefijo = {Fecha: this.Pedido.Fecha, Cliente: this.Pedido.Cliente};

          if(this.Pedido.Cantidad != Cliente.Cantidad){
            var params = prefijo;params.Tortilla = 1;params.Cantidad = this.Pedido.Cantidad
            if(Cliente.hasOwnProperty('Cantidad')){
              //await axios.put(`http://192.168.1.4:3000/Pedidos`,params)
            }else{
              //await axios.post(`http://192.168.1.4:3000/Pedidos`,params)
            }
          }

          if(this.Pedido.Cantidad2 != Cliente.Cantidad2){
            var params = prefijo;params.Tortilla = 2;params.Cantidad = this.Pedido.Cantidad2
            if(Cliente.hasOwnProperty('Cantidad2')){
              //await axios.put(`http://192.168.1.4:3000/Pedidos`,params)
            }else{
              //await axios.post(`http://192.168.1.4:3000/Pedidos`,params)
            }
          }

          if(this.Pedido.Cantidad3 != Cliente.Cantidad3){
            var params = prefijo;params.Tortilla = 3;params.Cantidad = this.Pedido.Cantidad3
            if(Cliente.hasOwnProperty('Cantidad3')){
              //await axios.put(`http://192.168.1.4:3000/Pedidos`,params)
            }else{
              //await axios.post(`http://192.168.1.4:3000/Pedidos`,params)
            }
          }

          this.GetPedidos(this.Pedido.Fecha);
          this.Modal = false;
          this.Limpiar();
          this.$alertify.success("Pedido Actualizado");

        }else {
          this.$alertify.error("Debe llenar al menos una cantidad");
        }
      } else {
        this.$alertify.error("Complete el formulario primero");
      }
    },

    ConfirmarE(item) {
      const detalles ={Cliente: item.Cliente, Fecha: moment(item.Fecha).format("YYYY-MM-DD")}
      this.$alertify.confirmWithTitle(
        "Eliminar Pedido","Desea eliminar el pedido de " + item.Nombres + " " + item.Apellidos,
        () => this.Eliminar(detalles)
        ,
        () => this.$alertify.error("Eliminacion Cancelada")
      );
    },

    async Eliminar(parametros){
      //await axios.delete(`http://192.168.1.4:3000/Pedidos`, {data: parametros})
      this.GetPedidos(parametros.Fecha)
      this.$alertify.success("Pedido eliminado")
    },

    Editar(item) {
      this.ModoEdicion = true;
      this.Pedido.Fecha = moment(item.Fecha).format('YYYY-MM-DD')
      this.Pedido.Cliente = item.Cliente
      this.Pedido.Cantidad = item.Cantidad
      this.Pedido.Cantidad2 = item.Cantidad2
      this.Pedido.Cantidad3 = item.Cantidad3
      this.Modal = true;
    },

    Limpiar() {
      this.Modal = false;
      this.ModoEdicion = false;
      this.Pedido.Fecha = this.Hoy
      this.Pedido.Cliente = 0
      this.Pedido.Tortilla =  0
      this.Pedido.Descripcion =  ""
      this.Pedido.Cantidad =  0
      this.Pedido.Tortilla2 =  0
      this.Pedido.Descripcion2 =  ""
      this.Pedido.Cantidad2 =  0
      this.Pedido.Tortilla3 =  0
      this.Pedido.Descripcion3 =  ""
      this.Pedido.Cantidad3 =  0
    },

    SubTotal(item){
      var Sub = 0
      if(!isNaN(item.Cantidad)){Sub += item.Cantidad}
      if(!isNaN(item.Cantidad2)){Sub += item.Cantidad2}
      if(!isNaN(item.Cantidad3)){Sub += item.Cantidad3}
      return Sub
    },
  },
};
</script>