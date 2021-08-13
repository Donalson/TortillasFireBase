<template>
  <v-container>

    <!-- Inputs iniciales para ver ventas por fecha o por cliente -->
    <v-row>
      <v-col cols="12" sm="6">
        <!-- Input de Fecha -->
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
              label="Ventas de Fecha"
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
            :max="Hoy"
            @input="FechaFormulario = false"
            @change="GetVentas(VerFecha)"
          ></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" sm="6">
        <!-- Input de Cliente -->
        <v-select
          color="green"
          :items="Clientes"
          item-text="FullName"
          item-value="IdCliente"
          label="Ventas de Cliente"
          prepend-icon="mdi-account"
          v-model="VerCliente"
          @change="GetVentasCliente(VerCliente)"
        ></v-select>
      </v-col>
    </v-row>

    <!-- Encabezado de Ventas -->
    <v-toolbar flat>
      <v-toolbar-title>Ventas</v-toolbar-title>
      <v-divider class="mx-4" inset vertical></v-divider>
      <v-spacer></v-spacer>
      <!-- Campo de filtrado de ventas -->
      <v-text-field
        v-model="Buscar"
        append-icon="mdi-magnify"
        label="Buscar"
        single-line
        hide-details
        color="green"
      ></v-text-field>
      <v-spacer></v-spacer>
      <!-- Formulario de Registro de Ventas -->
      <v-dialog v-model="Modal" persistent>
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="green" dark v-bind="attrs" v-on="on">Registrar Ventas</v-btn>
        </template>
        <!-- Si hay fechas pendientes se muestra formulario de registro -->
        <v-card v-if="FechasPedidos.length > 0">
          <v-card-title>
            <span class="headline">Pedidos A Registrar</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <!-- Selector de Fechas Pendientes(limitado a las fechhas pendientes) -->
                  <v-menu
                    v-model="VentasModel"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="VentasFecha"
                        label="Fecha De Pedidos A Registrar"
                        prepend-icon="mdi-calendar"
                        color="green"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="VentasFecha"
                      year-icon="mdi-calendar-blank"
                      prev-icon="mdi-skip-previous"
                      next-icon="mdi-skip-next"
                      color="green"
                      :allowed-dates="FechasPermitidasRegistro"
                      @change="GetPedidos()"
                      @input="VentasModel = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                
                <!-- Si la variable esta en verdadero(se obtuvo pedidos pendientes de registro) -->
                <v-col v-if="RegistrarVentas">
                  <v-card class="mb-5" v-for="(Venta, index) in Clientes" :key="index">
                    <!-- Si el cliente tiene pedidos pendientes de registro se muestra la card -->
                    <template v-if="Venta.Pedidos">
                      <v-card-title>Antojitos Heidy | Venta A Registrar</v-card-title>
                      <v-card-subtitle>
                        Cliente: {{ Venta.Nombres }} {{ Venta.Apellidos }} <br>
                        Direccion: {{ Venta.Direccion }} <br>
                        Fecha: {{ VentasFecha }} <br>
                        Adelanto: {{Venta.Adelanto}}
                        Debe: {{Venta.Debe}}
                      </v-card-subtitle>
                      <v-simple-table>
                        <thead>
                          <tr>
                            <th class="text-left">Cantidad</th>
                            <th class="text-left">Descripcion</th>
                            <th class="text-left">Precio C/U</th>
                            <th class="text-left">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(Deta, i) in Clientes[index].Pedidos" :key="i">
                            <td>{{Deta.Cantidad}}</td>
                            <td>{{Deta.Descripcion}}</td>
                            <td>Q.{{Deta.Precio}}</td>
                            <td>Q.{{Deta.Cantidad * Deta.Precio}}</td>
                          </tr>
                          <tr>
                            <td class="text-right" colspan="3">Subtotal</td>
                            <td>Q.{{Venta.SubTotal}}</td>
                          </tr>
                          <tr>
                            <td class="text-center">
                              <v-text-field label="Total" readonly v-model="Clientes[index].Total" color="green" type="number"></v-text-field>
                            </td>
                            <td class="text-center">
                              <v-text-field label="Pago" required v-model="Clientes[index].Pago" color="green" type="number" @change="Cambio(Clientes[index].Pago,Clientes[index].Total,index)"></v-text-field>
                            </td>
                            <td class="text-center">
                              <v-text-field label="Cambio" readonly v-model="Clientes[index].Cambio" color="green" type="number"></v-text-field>
                            </td>
                          </tr>
                        </tbody>
                      </v-simple-table>
                    </template>
                  </v-card>
                </v-col>
              
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green" text @click="Agregar"
              >Guardar <v-icon right>mdi-content-save</v-icon></v-btn
            >
            <v-btn color="red" text @click="Limpiar"
              >Cancelar <v-icon right>mdi-cancel</v-icon></v-btn
            >
          </v-card-actions>
        </v-card>
        <!-- Si no el mensaje correspondiente y el boton de cancelar -->
        <v-card v-else>
          <v-card-title class="text-center">No hay ventas pedientes de registro</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" text @click="Limpiar"
              >Cancelar <v-icon right>mdi-cancel</v-icon></v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>

    <!-- Listado de Ventas -->
    <v-row>
      <v-col>
        <v-card class="mb-5" v-for="(Venta, index) in Busqueda" :key="index">
          <v-card-title>Antojitos Heidy | Venta No.{{ Venta.IdVenta }} </v-card-title>
          <v-card-subtitle>Cliente: {{ Venta.Nombres }} {{ Venta.Apellidos }} <br> Direccion: {{ Venta.Direccion }} <br> Fecha: {{ FormatoFecha(Venta.Fecha) }}</v-card-subtitle>
          <v-simple-table>
            <thead>
              <tr>
                <th class="text-left">Cantidad</th>
                <th class="text-left">Descripcion</th>
                <th class="text-left">Precio C/U</th>
                <th class="text-left">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(Deta, i) in Ventas[index].Detalles" :key="i">
                <td>{{Deta.Cantidad}}</td>
                <td>{{Deta.Descripcion}}</td>
                <td>Q.{{Deta.Precio}}</td>
                <td>Q.{{Deta.Total}}</td>
              </tr>
              <tr>
                <td class="text-right" colspan="3">Total</td>
                <td>Q.{{Venta.SubTotal}}</td>
              </tr>
              <tr>
                <td class="text-center">Total:Q.{{Venta.Total}}</td>
                <td class="text-center">Pago:Q.{{Venta.Pago}}</td>
                <td class="text-center">Cambio:Q.{{Venta.Cambio}}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import { mapMutations } from 'vuex';
import alertify from "vue-alertify";
import moment from 'moment';
export default {
  data() {
    return{
      //Arrays de informacion
      Ventas: [], Clientes:[],FechasPedidos:[],
      //Valores booleanos de modals
      Modal: false,VerFechaModal:false,VentasModel: false,RegistrarVentas:false,
      //Valores de Inputs
      VerCliente: '',VentasFecha: '',VerFecha: moment(new Date()).subtract(1, 'days').format("YYYY-MM-DD"),Hoy:moment(new Date()).format("YYYY-MM-DD"),
      //Busqueda introducida por el usuario
      Buscar: "",
    };
  },

  created() {
    //Mandar a traer la ventas de ayer
    this.GetVentas(this.VerFecha)
    //Verificar si hay pedidos pendientes de registrar
    this.VerificarPendientes()
    //Obtener clientes para select(mostrar ventas de cliente especifico)
    this.GetClientes()
  },

  computed: {
    //Funcion computada de busqueda dentro de la lista de ventas(filtra por Nombres, Apellidos y Direccion)
    Busqueda() {
      const BuquedaLimpia = this.Buscar.toLowerCase().trim();

      if (!BuquedaLimpia) {
        return this.Ventas;
      } else {
        return this.Ventas.filter(
          (item) =>
            item.Nombres.toLowerCase().includes(BuquedaLimpia) ||
            item.Apellidos.toLowerCase().includes(BuquedaLimpia) ||
            item.Direccion.toLowerCase().includes(BuquedaLimpia) ||
            item.Fecha.includes(BuquedaLimpia)
        );
      }
    },
  },

  methods: {
    ...mapMutations(['MostrarLoading','OcultarLoading']),

    async GetVentas(Fecha) {
      try {
        this.MostrarLoading({Titulo:'Accediendo a la información', Color:'green'})
        var Ventas = []
        await axios.get(`http://192.168.1.4:3000/Ventas/${Fecha}`).then((res) => {
          Ventas = res.data;
        });
        if(Ventas.length > 0){
          this.VerCliente = ''
          for(var i = 0; i < Ventas.length; i++){
            await axios.get(`http://192.168.1.4:3000/DetallesVentas/${Ventas[i].IdVenta}`).then((res) => {
              Ventas[i].Detalles = (res.data)
            });
          }
          this.Ventas = await Ventas
          this.VerFechaModal = false
        }else{
          this.$alertify.error("No hay ventas en la fecha " + Fecha)
          this.Ventas = []
        }
      } catch (e) {
        console.log(e);
      } finally{
        this.OcultarLoading()
      }
    },

    async GetVentasCliente(Cliente) {
      try {
        this.MostrarLoading({Titulo:'Accediendo a la información', Color:'green'})
        var Ventas = []
        await axios.get(`http://192.168.1.4:3000/VentasDe/${Cliente}`).then((res) => {
          Ventas = res.data;
        });
        if(Ventas.length > 0){
          this.VerFecha = ''
          for(var i = 0; i < Ventas.length; i++){
            await axios.get(`http://192.168.1.4:3000/DetallesVentas/${Ventas[i].IdVenta}`).then((res) => {
              Ventas[i].Detalles = (res.data)
            });
          }
          this.Ventas = await Ventas
        }else{
          this.$alertify.error("No hay ventas del cliente")
          this.Ventas = []
        }
      } catch (e) {
        console.log(e);
      } finally{
        this.OcultarLoading()
      }
    },

    async GetClientes() {
      try {
        this.Clientes = []
        let Get = await axios.get(`http://192.168.1.4:3000/Clientes`)
        for(var i = 0; i < Get.data.length; i++){
          Get.data[i].FullName = Get.data[i].Nombres + " " + Get.data[i].Apellidos
        }
        this.Clientes = await Get.data

      } catch (e) {
        console.log(e);
      }
    },

    async VerificarPendientes(){
      try{
        var Get = await axios.get(`http://192.168.1.4:3000/PedidosARegistrar/`)
        if(Get.data.length > 0){
          this.FechasPedidos = []
          var Fechas = ""
          var Fecha = moment(new Date()).format("YYYY-MM-DD")
          for(var i=0; i < Get.data.length; i++){
            if(this.FormatoFecha(Get.data[i].Fecha) != Fecha){
              Fechas += this.FormatoFecha(Get.data[i].Fecha) + ", ";
              Fecha = this.FormatoFecha(Get.data[i].Fecha);
              this.FechasPedidos.push(this.FormatoFecha(Get.data[i].Fecha));
            }
          }
          if(Fechas.length>0){this.$alertify.warning("Pedidos Pendientes de registrar en Ventas de Fecha(s) " + Fechas)
          }else{this.$alertify.success("No hay Pedidos pedientes de registrar")}
        }else{this.$alertify.success("No hay Pedidos pedientes de registrar")}
      }catch(e){
        console.log
      }
    },

    async GetPedidos(){
      try{
        this.MostrarLoading({Titulo:'Accediendo a la información', Color:'green'})
        this.GetClientes()
        var datos
        await axios.get(`http://192.168.1.4:3000/PedidosARegistrar/${this.VentasFecha}`).then((res) => {
          datos = res.data
        });
        for(var it = 0; it < this.Clientes.length; it++){
          var id = this.Clientes[it].IdCliente
          var pedidos = []
          for(var ite = 0; ite < datos.length; ite++){
            if(datos[ite].Cliente == id){
              pedidos.push(datos[ite])
            }
          }
          if(pedidos.length > 0){
            this.Clientes[it].Pedidos = pedidos
            var Sub = 0
            for(var i = 0; i < pedidos.length; i++){
              Sub += pedidos[i].Cantidad * pedidos[i].Precio
            }
            this.$set(this.Clientes[it], 'SubTotal', Sub)
            this.$set(this.Clientes[it], 'Total', Sub)
            this.$set(this.Clientes[it], 'Pago', 0)
            this.$set(this.Clientes[it], 'Cambio', 0)
            this.VentasModel = true
            this.VentasModel = false
          }
        }
      }catch(e){
        console.log(e)
      }finally{
        this.RegistrarVentas = true
        this.OcultarLoading()
      }
    },

    async Agregar() {
      //Objeto de verificacion
      const mal = {Error: false, Nombres:[]};

      for(var i = 0; i < this.Clientes.length; i++){
      //Se verifica por cada cliente si tiene pedidos asignados
        if(this.Clientes[i].Pedidos){
          /*
          Si el cliente tiene pedidos se verifica que el total sea menor al pago
          en caso contrario se cambia el atributo de error a verdedero y se manda el nombre del cliente
          a la lista de nombre del objeto de verificacion
          */
          if(this.Clientes[i].Pago < this.Clientes[i].Total){
            mal.Error = true
            mal.Nombres.push({Nombre: this.Clientes[i].FullName})
          }
        }
      };

      //En caso de que el objeto de valicacion no contenga el error en verdadero
      if (!mal.Error) {
        //Se recorre cada cliente
        for(var i = 0; i < this.Clientes.length; i++){
          //Si el cliente tiene pedidos asignados
          if(this.Clientes[i].Pedidos){
            //Se crea un objeto con los datos de la venta
            var params = {}
            params.Fecha = this.VentasFecha
            params.Cliente = this.Clientes[i].IdCliente
            params.SubTotal = this.Clientes[i].SubTotal
            params.Total = this.Clientes[i].Total
            params.Pago = this.Clientes[i].Pago
            params.Cambio = this.Clientes[i].Cambio

            //Se crae una variable para guardar el numero de venta
            var id

            //Se crea la venta con la informacion anterior
            try{
              await axios.post(`http://192.168.1.4:3000/Ventas`, params).then((res) => {
                //El id devuelto por la api se guarda en la variable ya mencionada
                id = res.data.Venta
              });
            } catch(e){
              console.log(e)
            }

            //Se verifica si el id de la factura es valido
            if(id > 0){
              //Se recorren todos los pedidos del cliente
              for (let index = 0; index < this.Clientes[i].Pedidos.length; index++) {
                //Se almacenan los pedidos en un objeto
                let detalle = {}
                detalle.Factura = id
                detalle.Descripcion = this.Clientes[i].Pedidos[index].Descripcion
                detalle.Cantidad = this.Clientes[i].Pedidos[index].Cantidad
                detalle.Precio = this.Clientes[i].Pedidos[index].Precio
                detalle.Total = this.Clientes[i].Pedidos[index].Cantidad * this.Clientes[i].Pedidos[index].Precio
                try{
                  //Se manda a la base de datos como detalle de la factura creada anteriormente
                  await axios.post(`http://192.168.1.4:3000/DetallesVentas`, detalle)
                } catch(e){
                  console.log(e)
                }
              }
            }

            //Se cambia el estado de los pedidos a registrados en ventas
            let Cliente = {Fecha: this.VentasFecha, Cliente: this.Clientes[i].IdCliente}
            try{
              await axios.put(`http://192.168.1.4:3000/PedidosRVenta`, Cliente)
            }catch(e){
              console.log(e)
            }
          }
        }
        if(this.VerFecha != ''){
          this.GetVentas(this.VerFecha);
        }else{
          this.GetVentas(this.VerCliente);
        }
        this.Modal = false;
        this.Limpiar();
        this.$alertify.success("Ventas Registradas");
      } else {
        //Si el objeto de validacion encuentra errores, imprimira un mensaje por cada nombre agregado
        for(var i = 0; i < mal.Nombres.length; i++){
          this.$alertify.error("Revise la venta de " + mal.Nombres[i].Nombre);
        }
      }
    },

    Limpiar() {
      this.Modal = false;this.RegistrarVentas = false
      this.VentasFecha = ''
      this.GetClientes()
      this.VerificarPendientes()
    },

    FormatoFecha(Fecha){
      let Formateada = moment(Fecha).format("YYYY-MM-DD")
      return Formateada
    },

    FechasPermitidasRegistro(val){ 
      if(this.FechasPedidos.indexOf(val) != -1){
        return true
      }else{
        return false
      }
    },

    Cambio(Pago, Total, index){
      var Cambio = parseFloat(Pago) - parseFloat(Total)
      this.Clientes[index].Pago = parseInt(Pago)
      this.Clientes[index].Cambio = Cambio
    },
  },
};
</script>